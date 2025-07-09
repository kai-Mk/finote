import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import {
  createTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
  getTransactionsSchema,
  getMonthlyStatsSchema,
} from '@/lib/validations/transaction';

export const transactionRouter = router({
  /**
   * 取引一覧取得（フィルタリング・ソート・ページネーション対応）
   */
  getAll: publicProcedure
    .input(getTransactionsSchema)
    .query(async ({ input, ctx }) => {
      const {
        startDate,
        endDate,
        mainCategoryId,
        subCategoryId,
        type,
        budgetId,
        limit,
        offset,
        sortBy,
        sortOrder,
      } = input;

      try {
        const transactions = await ctx.prisma.transaction.findMany({
          where: {
            deletedAt: null, // 論理削除されていないもののみ
            ...(startDate &&
              endDate && {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              }),
            ...(type && { type }),
            ...(mainCategoryId && { mainCategoryId }),
            ...(subCategoryId && { subCategoryId }),
            ...(budgetId && { budgetId }),
          },
          include: {
            mainCategory: true,
            subCategory: true,
            paymentMethod: true,
            budget: true,
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          take: limit,
          skip: offset,
        });

        // 総件数も取得（ページネーション用）
        const totalCount = await ctx.prisma.transaction.count({
          where: {
            deletedAt: null,
            ...(startDate &&
              endDate && {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              }),
            ...(type && { type }),
            ...(mainCategoryId && { mainCategoryId }),
            ...(subCategoryId && { subCategoryId }),
            ...(budgetId && { budgetId }),
          },
        });

        return {
          transactions,
          totalCount,
          hasMore: totalCount > offset + limit,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '取引の取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 取引詳細取得
   */
  getById: publicProcedure
    .input(deleteTransactionSchema) // idのみなので流用
    .query(async ({ input, ctx }) => {
      try {
        const transaction = await ctx.prisma.transaction.findFirst({
          where: {
            id: input.id,
            deletedAt: null,
          },
          include: {
            mainCategory: true,
            subCategory: true,
            paymentMethod: true,
            budget: true,
          },
        });

        if (!transaction) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された取引が見つかりません',
          });
        }

        return transaction;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '取引の取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 取引作成
   */
  create: publicProcedure
    .input(createTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // 関連するカテゴリーと支払い方法の存在確認
        const [mainCategory, paymentMethod, subCategory] = await Promise.all([
          ctx.prisma.mainCategory.findFirst({
            where: { id: input.mainCategoryId, deletedAt: null },
          }),
          ctx.prisma.paymentMethod.findFirst({
            where: { id: input.paymentMethodId, deletedAt: null },
          }),
          input.subCategoryId
            ? ctx.prisma.subCategory.findFirst({
                where: { id: input.subCategoryId, deletedAt: null },
              })
            : null,
        ]);

        if (!mainCategory) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: '指定された親カテゴリーが存在しません',
          });
        }

        if (!paymentMethod) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: '指定された支払い方法が存在しません',
          });
        }

        if (input.subCategoryId && !subCategory) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: '指定された子カテゴリーが存在しません',
          });
        }

        // 予算IDが指定されている場合の存在確認
        if (input.budgetId) {
          const budget = await ctx.prisma.budget.findFirst({
            where: { id: input.budgetId, deletedAt: null },
          });
          if (!budget) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '指定された予算が存在しません',
            });
          }
        }

        const transaction = await ctx.prisma.transaction.create({
          data: input,
          include: {
            mainCategory: true,
            subCategory: true,
            paymentMethod: true,
            budget: true,
          },
        });

        return transaction;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '取引の作成に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 取引更新
   */
  update: publicProcedure
    .input(updateTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      try {
        // 既存の取引の存在確認
        const existingTransaction = await ctx.prisma.transaction.findFirst({
          where: { id, deletedAt: null },
        });

        if (!existingTransaction) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された取引が見つかりません',
          });
        }

        // 関連データの存在確認（更新データが含まれている場合のみ）
        if (updateData.mainCategoryId) {
          const mainCategory = await ctx.prisma.mainCategory.findFirst({
            where: { id: updateData.mainCategoryId, deletedAt: null },
          });
          if (!mainCategory) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '指定された親カテゴリーが存在しません',
            });
          }
        }

        if (updateData.paymentMethodId) {
          const paymentMethod = await ctx.prisma.paymentMethod.findFirst({
            where: { id: updateData.paymentMethodId, deletedAt: null },
          });
          if (!paymentMethod) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '指定された支払い方法が存在しません',
            });
          }
        }

        const transaction = await ctx.prisma.transaction.update({
          where: { id },
          data: updateData,
          include: {
            mainCategory: true,
            subCategory: true,
            paymentMethod: true,
            budget: true,
          },
        });

        return transaction;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '取引の更新に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 取引削除（論理削除）
   */
  delete: publicProcedure
    .input(deleteTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const transaction = await ctx.prisma.transaction.findFirst({
          where: { id: input.id, deletedAt: null },
        });

        if (!transaction) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定された取引が見つかりません',
          });
        }

        await ctx.prisma.transaction.update({
          where: { id: input.id },
          data: { deletedAt: new Date() },
        });

        return { success: true, message: '取引を削除しました' };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '取引の削除に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * 月次統計取得
   */
  getMonthlyStats: publicProcedure
    .input(getMonthlyStatsSchema)
    .query(async ({ input, ctx }) => {
      const { year, month, mainCategoryId } = input;

      try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // 収入・支出の合計取得
        const stats = await ctx.prisma.transaction.groupBy({
          by: ['type'],
          where: {
            deletedAt: null,
            date: {
              gte: startDate,
              lte: endDate,
            },
            ...(mainCategoryId && { mainCategoryId }),
          },
          _sum: {
            amount: true,
          },
        });

        // カテゴリー別の集計
        const categoryStats = await ctx.prisma.transaction.groupBy({
          by: ['mainCategoryId', 'type'],
          where: {
            deletedAt: null,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
          _count: {
            id: true,
          },
        });

        // カテゴリー情報を取得
        const categoriesWithStats = await ctx.prisma.mainCategory.findMany({
          where: {
            id: {
              in: categoryStats.map((stat) => stat.mainCategoryId),
            },
            deletedAt: null,
          },
        });

        const result = {
          totalIncome: stats.find((s) => s.type === 'income')?._sum.amount || 0,
          totalExpense:
            stats.find((s) => s.type === 'expense')?._sum.amount || 0,
          categoryBreakdown: categoryStats.map((stat) => ({
            ...stat,
            category: categoriesWithStats.find(
              (c) => c.id === stat.mainCategoryId
            ),
          })),
        };

        return result;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '月次統計の取得に失敗しました',
          cause: error,
        });
      }
    }),
});
