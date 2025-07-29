import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import {
  createBudgetSchema,
  updateBudgetSchema,
  deleteBudgetSchema,
  getBudgetsSchema,
  getBudgetByIdSchema,
  getBudgetProgressSchema,
  getActiveBudgetsSchema,
} from '@/lib/validations/budget';

export const budgetRouter = router({
  /**
   * 予算一覧取得（フィルタリング・ソート・ページネーション対応）
   */
  getAll: publicProcedure
    .input(getBudgetsSchema)
    .query(async ({ input, ctx }) => {
      const {
        searchName,
        filterStartDate,
        filterEndDate,
        activeOnly,
        includeTransactions,
        limit,
        offset,
        sortBy,
        sortOrder,
      } = input;

      try {
        const currentDate = new Date();

        const budgets = await ctx.prisma.budget.findMany({
          where: {
            deletedAt: null, // 論理削除されていないもののみ
            ...(searchName && {
              name: {
                contains: searchName,
                mode: 'insensitive', // 大文字小文字を区別しない
              },
            }),
            ...(filterStartDate && {
              startDate: {
                gte: filterStartDate,
              },
            }),
            ...(filterEndDate && {
              endDate: {
                lte: filterEndDate,
              },
            }),
            ...(activeOnly && {
              startDate: {
                lte: currentDate,
              },
              endDate: {
                gte: currentDate,
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
        const totalCount = await ctx.prisma.budget.count({
          where: {
            deletedAt: null,
            ...(searchName && {
              name: {
                contains: searchName,
                mode: 'insensitive',
              },
            }),
            ...(filterStartDate && {
              startDate: {
                gte: filterStartDate,
              },
            }),
            ...(filterEndDate && {
              endDate: {
                lte: filterEndDate,
              },
            }),
            ...(activeOnly && {
              startDate: {
                lte: currentDate,
              },
              endDate: {
                gte: currentDate,
              },
            }),
          },
        });

        return {
          budgets,
          totalCount,
          hasMore: totalCount > offset + limit,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '予算の取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 予算詳細取得
   */
  getById: publicProcedure
    .input(getBudgetByIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const budget = await ctx.prisma.budget.findFirst({
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
                  paymentMethod: true,
                },
                orderBy: {
                  date: 'desc',
                },
              },
            }),
          },
        });

        if (!budget) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された予算が見つかりません',
          });
        }

        // 進捗情報を含める場合
        if (input.includeProgress) {
          const totalUsed = await ctx.prisma.transaction.aggregate({
            where: {
              budgetId: input.id,
              type: 'expense',
              deletedAt: null,
            },
            _sum: {
              amount: true,
            },
          });

          const transactionCount = await ctx.prisma.transaction.count({
            where: {
              budgetId: input.id,
              deletedAt: null,
            },
          });

          const usedAmount = totalUsed._sum.amount || 0;
          const remainingAmount = budget.totalAmount - usedAmount;
          const usagePercentage = Math.round(
            (usedAmount / budget.totalAmount) * 100
          );

          return {
            ...budget,
            progress: {
              usedAmount,
              remainingAmount,
              usagePercentage,
              transactionCount,
              isOverBudget: usedAmount > budget.totalAmount,
            },
          };
        }

        return budget;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '予算の取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 予算作成
   */
  create: publicProcedure
    .input(createBudgetSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // 同期間・同名の予算が既に存在するかチェック
        const existingBudget = await ctx.prisma.budget.findFirst({
          where: {
            name: input.name,
            deletedAt: null,
            OR: [
              // 新しい予算の開始日が既存予算の期間内
              {
                startDate: { lte: input.startDate },
                endDate: { gte: input.startDate },
              },
              // 新しい予算の終了日が既存予算の期間内
              {
                startDate: { lte: input.endDate },
                endDate: { gte: input.endDate },
              },
              // 新しい予算が既存予算を完全に包含
              {
                startDate: { gte: input.startDate },
                endDate: { lte: input.endDate },
              },
            ],
          },
        });

        if (existingBudget) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '同名で期間が重複する予算が既に存在します',
          });
        }

        const budget = await ctx.prisma.budget.create({
          data: input,
          include: {
            transactions: {
              where: {
                deletedAt: null,
              },
              include: {
                mainCategory: true,
                subCategory: true,
              },
            },
          },
        });

        return budget;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '予算の作成に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 予算更新
   */
  update: publicProcedure
    .input(updateBudgetSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      try {
        // 既存の予算の存在確認
        const existingBudget = await ctx.prisma.budget.findFirst({
          where: { id, deletedAt: null },
        });

        if (!existingBudget) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された予算が見つかりません',
          });
        }

        // 名前または期間が更新される場合、重複チェック
        if (updateData.name || updateData.startDate || updateData.endDate) {
          const newName = updateData.name || existingBudget.name;
          const newStartDate = updateData.startDate || existingBudget.startDate;
          const newEndDate = updateData.endDate || existingBudget.endDate;

          const duplicateBudget = await ctx.prisma.budget.findFirst({
            where: {
              name: newName,
              deletedAt: null,
              id: { not: id }, // 自分自身は除外
              OR: [
                {
                  startDate: { lte: newStartDate },
                  endDate: { gte: newStartDate },
                },
                {
                  startDate: { lte: newEndDate },
                  endDate: { gte: newEndDate },
                },
                {
                  startDate: { gte: newStartDate },
                  endDate: { lte: newEndDate },
                },
              ],
            },
          });

          if (duplicateBudget) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: '同名で期間が重複する予算が既に存在します',
            });
          }
        }

        const budget = await ctx.prisma.budget.update({
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
            },
          },
        });

        return budget;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '予算の更新に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 予算削除（論理削除）
   */
  delete: publicProcedure
    .input(deleteBudgetSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const budget = await ctx.prisma.budget.findFirst({
          where: { id: input.id, deletedAt: null },
        });

        if (!budget) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された予算が見つかりません',
          });
        }

        // 関連する取引の数を確認
        const relatedTransactions = await ctx.prisma.transaction.count({
          where: {
            budgetId: input.id,
            deletedAt: null,
          },
        });

        // 関連する取引がある場合は警告メッセージを含める
        const warningMessage =
          relatedTransactions > 0
            ? `この予算に関連する${relatedTransactions}件の取引は予算の関連付けが解除されます。`
            : null;

        // 関連する取引の予算IDをnullに更新
        if (relatedTransactions > 0) {
          await ctx.prisma.transaction.updateMany({
            where: {
              budgetId: input.id,
              deletedAt: null,
            },
            data: {
              budgetId: null,
              updatedAt: new Date(),
            },
          });
        }

        // 予算を論理削除
        await ctx.prisma.budget.update({
          where: { id: input.id },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          message: '予算を削除しました',
          warning: warningMessage,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '予算の削除に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 予算進捗取得
   */
  getProgress: publicProcedure
    .input(getBudgetProgressSchema)
    .query(async ({ input, ctx }) => {
      try {
        const budget = await ctx.prisma.budget.findFirst({
          where: { id: input.id, deletedAt: null },
        });

        if (!budget) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された予算が見つかりません',
          });
        }

        // 使用済み金額を取得
        const totalUsed = await ctx.prisma.transaction.aggregate({
          where: {
            budgetId: input.id,
            type: 'expense',
            deletedAt: null,
          },
          _sum: {
            amount: true,
          },
        });

        const usedAmount = totalUsed._sum.amount || 0;
        const remainingAmount = budget.totalAmount - usedAmount;
        const usagePercentage = Math.round(
          (usedAmount / budget.totalAmount) * 100
        );

        // カテゴリー別の内訳を取得する場合
        let categoryBreakdown = null;
        if (input.groupByCategory) {
          const categoryStats = await ctx.prisma.transaction.groupBy({
            by: ['mainCategoryId'],
            where: {
              budgetId: input.id,
              type: 'expense',
              deletedAt: null,
            },
            _sum: {
              amount: true,
            },
            _count: {
              id: true,
            },
          });

          const categories = await ctx.prisma.mainCategory.findMany({
            where: {
              id: {
                in: categoryStats.map((stat) => stat.mainCategoryId),
              },
              deletedAt: null,
            },
          });

          categoryBreakdown = categoryStats.map((stat) => ({
            category: categories.find((c) => c.id === stat.mainCategoryId),
            amount: stat._sum.amount || 0,
            transactionCount: stat._count.id,
            percentage: Math.round(
              ((stat._sum.amount || 0) / usedAmount) * 100
            ),
          }));
        }

        return {
          budget,
          usedAmount,
          remainingAmount,
          usagePercentage,
          isOverBudget: usedAmount > budget.totalAmount,
          daysRemaining: Math.max(
            0,
            Math.ceil(
              (budget.endDate.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          ),
          categoryBreakdown,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '予算進捗の取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * アクティブな予算一覧取得
   */
  getActive: publicProcedure
    .input(getActiveBudgetsSchema)
    .query(async ({ input, ctx }) => {
      try {
        const activeBudgets = await ctx.prisma.budget.findMany({
          where: {
            deletedAt: null,
            startDate: { lte: input.date },
            endDate: { gte: input.date },
          },
          orderBy: {
            endDate: 'asc', // 終了日が近い順
          },
        });

        if (!input.includeProgress) {
          return activeBudgets;
        }

        // 各予算の進捗情報を取得
        const budgetsWithProgress = await Promise.all(
          activeBudgets.map(async (budget) => {
            const totalUsed = await ctx.prisma.transaction.aggregate({
              where: {
                budgetId: budget.id,
                type: 'expense',
                deletedAt: null,
              },
              _sum: {
                amount: true,
              },
            });

            const usedAmount = totalUsed._sum.amount || 0;
            const remainingAmount = budget.totalAmount - usedAmount;
            const usagePercentage = Math.round(
              (usedAmount / budget.totalAmount) * 100
            );

            return {
              ...budget,
              progress: {
                usedAmount,
                remainingAmount,
                usagePercentage,
                isOverBudget: usedAmount > budget.totalAmount,
                daysRemaining: Math.max(
                  0,
                  Math.ceil(
                    (budget.endDate.getTime() - input.date.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                ),
              },
            };
          })
        );

        return budgetsWithProgress;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'アクティブな予算の取得に失敗しました',
          cause: error,
        });
      }
    }),
});
