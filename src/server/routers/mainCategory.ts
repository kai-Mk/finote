import {
  createMainCategorySchema,
  deleteMainCategorySchema,
  getMainCategoriesSchema,
  getMainCategoryByIdSchema,
  updateMainCategorySchema,
} from '@/lib/validations/mainCategory';
import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { create } from 'domain';

export const MainCategoryRouter = router({
  /**
   * メインカテゴリの一覧を取得する
   */
  getAll: publicProcedure
    .input(getMainCategoriesSchema)
    .query(async ({ input, ctx }) => {
      const {
        type,
        searchName,
        includeSubCategories,
        limit,
        offset,
        sortBy,
        sortOrder,
      } = input;

      try {
        const mainCategories = await ctx.prisma.mainCategory.findMany({
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
            ...(includeSubCategories && {
              subCategories: {
                where: {
                  deletedAt: null,
                },
                orderBy: {
                  name: 'asc',
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

        return mainCategories;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メインカテゴリーの取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * メインカテゴリー詳細取得
   */
  getById: publicProcedure
    .input(getMainCategoryByIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const mainCategory = await ctx.prisma.mainCategory.findFirst({
          where: {
            id: input.id,
            deletedAt: null,
          },
        });

        if (!mainCategory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定されたメインカテゴリーが見つかりません',
          });
        }

        return mainCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メインカテゴリーの取得に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * メインカテゴリーを作成する
   */
  create: publicProcedure
    .input(createMainCategorySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // 同名・同タイプのカテゴリーが既に存在するかチェック
        const existingCategory = await ctx.prisma.mainCategory.findFirst({
          where: {
            name: input.name,
            type: input.type,
            deletedAt: null,
          },
        });

        if (existingCategory) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '同じ名前・同じタイプのメインカテゴリーが既に存在します',
          });
        }

        const mainCategory = await ctx.prisma.mainCategory.create({
          data: {
            name: input.name,
            type: input.type,
          },
        });

        return mainCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メインカテゴリーの作成に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * メインカテゴリー更新
   */
  update: publicProcedure
    .input(updateMainCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      try {
        // 既存のメインカテゴリーの存在確認
        const existingCategory = await ctx.prisma.mainCategory.findFirst({
          where: { id, deletedAt: null },
        });

        if (!existingCategory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定されたメインカテゴリーが見つかりません',
          });
        }

        // 名前またはタイプが更新される場合、重複チェック
        if (updateData.name || updateData.type) {
          const duplicateCategory = await ctx.prisma.mainCategory.findFirst({
            where: {
              name: updateData.name || existingCategory.name,
              type: updateData.type || existingCategory.type,
              deletedAt: null,
              id: { not: id }, // 自分自身は除外
            },
          });

          if (duplicateCategory) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: '同じ名前・同じタイプのメインカテゴリーが既に存在します',
            });
          }
        }

        const mainCategory = await ctx.prisma.mainCategory.update({
          where: { id },
          data: {
            ...updateData,
            updatedAt: new Date(),
          },
        });

        return mainCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メインカテゴリーの更新に失敗しました',
          cause: error,
        });
      }
    }),

  /**
   * メインカテゴリー削除（論理削除）
   */
  delete: publicProcedure
    .input(deleteMainCategorySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const mainCategory = await ctx.prisma.mainCategory.findFirst({
          where: { id: input.id, deletedAt: null },
        });

        if (!mainCategory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定されたメインカテゴリーが見つかりません',
          });
        }

        // 関連する取引が存在するかチェック
        const relatedTransactions = await ctx.prisma.transaction.count({
          where: {
            mainCategoryId: input.id,
            deletedAt: null,
          },
        });

        if (relatedTransactions > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'このメインカテゴリーは取引で使用されているため削除できません',
          });
        }

        // 関連する子カテゴリーも論理削除
        await ctx.prisma.subCategory.updateMany({
          where: {
            mainCategoryId: input.id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // メインカテゴリーを論理削除
        await ctx.prisma.mainCategory.update({
          where: { id: input.id },
          data: {
            deletedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          message: 'メインカテゴリーとその子カテゴリーを削除しました',
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'メインカテゴリーの削除に失敗しました',
          cause: error,
        });
      }
    }),
});
