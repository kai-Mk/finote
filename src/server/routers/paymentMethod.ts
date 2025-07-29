import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  deletePaymentMethodSchema,
  getPaymentMethodsSchema,
  getPaymentMethodByIdSchema,
  getPaymentMethodUsageStatsSchema,
  getPaymentMethodsByTypeSchema,
} from '@/lib/validations/paymentMethod';

export const paymentMethodRouter = router({
  /**
   * 支払い方法一覧取得（フィルタリング・ソート・ページネーション対応）
   */
  getAll: publicProcedure
    .input(getPaymentMethodsSchema)
    .query(async ({ input, ctx }) => {
      const {
        type,
        searchName,
        includeTransactions,
        limit,
        offset,
        sortBy,
        sortOrder,
      } = input;

      try {
        const paymentMethods = await ctx.prisma.paymentMethod.findMany({
          where: {
            deletedAt: null, // 論理削除されていないもののみ
            ...(type && { type }),
            ...(searchName && {
              name: {
                contains: searchName,
                mode: 'insensitive', // 大文字小文字を区別しない
              },
            }),
          },
          include: {
            ...(includeTransactions && {
              transactions: {
                where: {
                  deletedAt: null,
                },
                include: {
                  mainCategory: true,
                  subCategory: true,
                },
                orderBy: {
                  date: 'desc',
                },
                take: 10, // 最新10件のみ
              },
            }),
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          take: limit,
          skip: offset,
        });

        // 総件数も取得（ページネーション用）
        const totalCount = await ctx.prisma.paymentMethod.count({
          where: {
            deletedAt: null,
            ...(type && { type }),
            ...(searchName && {
              name: {
                contains: searchName,
                mode: 'insensitive',
              },
            }),
          },
        });

        return {
          paymentMethods,
          totalCount,
          hasMore: totalCount > offset + limit,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '支払い方法の取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 支払い方法詳細取得
   */
  getById: publicProcedure
    .input(getPaymentMethodByIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const paymentMethod = await ctx.prisma.paymentMethod.findFirst({
          where: {
            id: input.id,
            deletedAt: null,
          },
          include: {
            ...(input.includeTransactions && {
              transactions: {
                where: {
                  deletedAt: null,
                },
                include: {
                  mainCategory: true,
                  subCategory: true,
                  budget: true,
                },
                orderBy: {
                  date: 'desc',
                },
              },
            }),
          },
        });

        if (!paymentMethod) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された支払い方法が見つかりません',
          });
        }

        // 使用統計も含める場合
        if (input.includeStats) {
          const stats = await ctx.prisma.transaction.groupBy({
            by: ['type'],
            where: {
              paymentMethodId: input.id,
              deletedAt: null,
            },
            _sum: {
              amount: true,
            },
            _count: {
              id: true,
            },
          });

          const totalAmount = stats.reduce(
            (sum, stat) => sum + (stat._sum.amount || 0),
            0
          );
          const totalTransactions = stats.reduce(
            (sum, stat) => sum + stat._count.id,
            0
          );
          const incomeAmount =
            stats.find((s) => s.type === 'income')?._sum.amount || 0;
          const expenseAmount =
            stats.find((s) => s.type === 'expense')?._sum.amount || 0;

          return {
            ...paymentMethod,
            stats: {
              totalAmount,
              totalTransactions,
              incomeAmount,
              expenseAmount,
              incomeCount:
                stats.find((s) => s.type === 'income')?._count.id || 0,
              expenseCount:
                stats.find((s) => s.type === 'expense')?._count.id || 0,
            },
          };
        }

        return paymentMethod;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '支払い方法の取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 支払い方法作成
   */
  create: publicProcedure
    .input(createPaymentMethodSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // 同名・同タイプの支払い方法が既に存在するかチェック
        const existingPaymentMethod = await ctx.prisma.paymentMethod.findFirst({
          where: {
            name: input.name,
            type: input.type,
            deletedAt: null,
          },
        });

        if (existingPaymentMethod) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '同じ名前・同じタイプの支払い方法が既に存在します',
          });
        }

        const paymentMethod = await ctx.prisma.paymentMethod.create({
          data: input,
          include: {
            transactions: {
              where: {
                deletedAt: null,
              },
              take: 0, // 作成時は取引は存在しないが、includeの形を統一
            },
          },
        });

        return paymentMethod;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '支払い方法の作成に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 支払い方法更新
   */
  update: publicProcedure
    .input(updatePaymentMethodSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      try {
        // 既存の支払い方法の存在確認
        const existingPaymentMethod = await ctx.prisma.paymentMethod.findFirst({
          where: { id, deletedAt: null },
        });

        if (!existingPaymentMethod) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された支払い方法が見つかりません',
          });
        }

        // 名前またはタイプが更新される場合、重複チェック
        if (updateData.name || updateData.type) {
          const duplicatePaymentMethod =
            await ctx.prisma.paymentMethod.findFirst({
              where: {
                name: updateData.name || existingPaymentMethod.name,
                type: updateData.type || existingPaymentMethod.type,
                deletedAt: null,
                id: { not: id }, // 自分自身は除外
              },
            });

          if (duplicatePaymentMethod) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: '同じ名前・同じタイプの支払い方法が既に存在します',
            });
          }
        }

        const paymentMethod = await ctx.prisma.paymentMethod.update({
          where: { id },
          data: {
            ...updateData,
            updatedAt: new Date(),
          },
          include: {
            transactions: {
              where: {
                deletedAt: null,
              },
              include: {
                mainCategory: true,
                subCategory: true,
              },
              orderBy: {
                date: 'desc',
              },
              take: 5, // 最新5件のみ
            },
          },
        });

        return paymentMethod;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '支払い方法の更新に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 支払い方法削除（論理削除）
   */
  delete: publicProcedure
    .input(deletePaymentMethodSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const paymentMethod = await ctx.prisma.paymentMethod.findFirst({
          where: { id: input.id, deletedAt: null },
        });

        if (!paymentMethod) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された支払い方法が見つかりません',
          });
        }

        // 関連する取引が存在するかチェック
        const relatedTransactions = await ctx.prisma.transaction.count({
          where: {
            paymentMethodId: input.id,
            deletedAt: null,
          },
        });

        if (relatedTransactions > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'この支払い方法は取引で使用されているため削除できません',
          });
        }

        // 支払い方法を論理削除
        await ctx.prisma.paymentMethod.update({
          where: { id: input.id },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          message: '支払い方法を削除しました',
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '支払い方法の削除に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 支払い方法使用統計取得
   */
  getUsageStats: publicProcedure
    .input(getPaymentMethodUsageStatsSchema)
    .query(async ({ input, ctx }) => {
      const { id, startDate, endDate, groupByMonth } = input;

      try {
        // 支払い方法の存在確認
        const paymentMethod = await ctx.prisma.paymentMethod.findFirst({
          where: { id, deletedAt: null },
        });

        if (!paymentMethod) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された支払い方法が見つかりません',
          });
        }

        // 基本統計を取得
        const basicStats = await ctx.prisma.transaction.groupBy({
          by: ['type'],
          where: {
            paymentMethodId: id,
            deletedAt: null,
            ...(startDate &&
              endDate && {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              }),
          },
          _sum: {
            amount: true,
          },
          _count: {
            id: true,
          },
        });

        // カテゴリー別統計
        const categoryStats = await ctx.prisma.transaction.groupBy({
          by: ['mainCategoryId', 'type'],
          where: {
            paymentMethodId: id,
            deletedAt: null,
            ...(startDate &&
              endDate && {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              }),
          },
          _sum: {
            amount: true,
          },
          _count: {
            id: true,
          },
        });

        // カテゴリー情報を取得
        const categories = await ctx.prisma.mainCategory.findMany({
          where: {
            id: {
              in: categoryStats.map((stat) => stat.mainCategoryId),
            },
            deletedAt: null,
          },
        });

        let monthlyStats = null;
        if (groupByMonth) {
          // 月別統計（PostgreSQL用のDATE_TRUNC関数を使用）
          const monthlyData = await ctx.prisma.$queryRaw`
            SELECT 
              DATE_TRUNC('month', date) as month,
              type,
              SUM(amount) as total_amount,
              COUNT(*) as transaction_count
            FROM transactions 
            WHERE payment_method_id = ${id} 
              AND deleted_at IS NULL
              ${startDate && endDate ? `AND date >= ${startDate} AND date <= ${endDate}` : ''}
            GROUP BY DATE_TRUNC('month', date), type
            ORDER BY month DESC
          `;

          monthlyStats = monthlyData;
        }

        const result = {
          paymentMethod,
          totalAmount: basicStats.reduce(
            (sum, stat) => sum + (stat._sum.amount || 0),
            0
          ),
          totalTransactions: basicStats.reduce(
            (sum, stat) => sum + stat._count.id,
            0
          ),
          incomeAmount:
            basicStats.find((s) => s.type === 'income')?._sum.amount || 0,
          expenseAmount:
            basicStats.find((s) => s.type === 'expense')?._sum.amount || 0,
          incomeCount:
            basicStats.find((s) => s.type === 'income')?._count.id || 0,
          expenseCount:
            basicStats.find((s) => s.type === 'expense')?._count.id || 0,
          categoryBreakdown: categoryStats.map((stat) => ({
            ...stat,
            category: categories.find((c) => c.id === stat.mainCategoryId),
          })),
          monthlyStats,
        };

        return result;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '支払い方法の使用統計取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * タイプ別支払い方法取得
   */
  getByType: publicProcedure
    .input(getPaymentMethodsByTypeSchema)
    .query(async ({ input, ctx }) => {
      try {
        const paymentMethods = await ctx.prisma.paymentMethod.findMany({
          where: {
            type: input.type,
            deletedAt: null,
          },
          orderBy: {
            name: 'asc',
          },
        });

        if (!input.includeStats) {
          return paymentMethods;
        }

        // 各支払い方法の使用統計を取得
        const paymentMethodsWithStats = await Promise.all(
          paymentMethods.map(async (pm) => {
            const stats = await ctx.prisma.transaction.groupBy({
              by: ['type'],
              where: {
                paymentMethodId: pm.id,
                deletedAt: null,
              },
              _sum: {
                amount: true,
              },
              _count: {
                id: true,
              },
            });

            const totalAmount = stats.reduce(
              (sum, stat) => sum + (stat._sum.amount || 0),
              0
            );
            const totalTransactions = stats.reduce(
              (sum, stat) => sum + stat._count.id,
              0
            );

            return {
              ...pm,
              stats: {
                totalAmount,
                totalTransactions,
                incomeAmount:
                  stats.find((s) => s.type === 'income')?._sum.amount || 0,
                expenseAmount:
                  stats.find((s) => s.type === 'expense')?._sum.amount || 0,
              },
            };
          })
        );

        return paymentMethodsWithStats;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'タイプ別支払い方法の取得に失敗しました',
          cause: error,
        });
      }
    }),
});
