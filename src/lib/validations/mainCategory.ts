import { z } from 'zod';

/**
 * メインカテゴリーの基本バリデーションスキーマ
 */
export const baseMainCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリー名を入力してください')
    .max(100, 'カテゴリー名は100文字以内で入力してください'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: '収入または支出を選択してください' }),
  }),
});

/**
 * メインカテゴリー作成用のバリデーションスキーマ
 * API（tRPC）で使用
 */
export const createMainCategorySchema = baseMainCategorySchema;

/**
 * メインカテゴリー更新用のバリデーションスキーマ
 * API（tRPC）で使用
 */
export const updateMainCategorySchema = baseMainCategorySchema
  .partial()
  .extend({
    id: z.number().positive('有効なカテゴリーIDが必要です'),
  });

/**
 * メインカテゴリー削除用のバリデーションスキーマ
 */
export const deleteMainCategorySchema = z.object({
  id: z.number().positive('有効なカテゴリーIDが必要です'),
});

/**
 * メインカテゴリー取得用のバリデーションスキーマ
 */
export const getMainCategoriesSchema = z.object({
  // タイプフィルター
  type: z.enum(['income', 'expense']).optional(),

  // 名前での検索
  searchName: z.string().optional(),

  // ページネーション
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),

  // ソート
  sortBy: z.enum(['name', 'type', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),

  // 子カテゴリーも含めて取得するか
  includeSubCategories: z.boolean().default(false),
});

/**
 * メインカテゴリー詳細取得用のバリデーションスキーマ
 */
export const getMainCategoryByIdSchema = z.object({
  id: z.number().positive('有効なカテゴリーIDが必要です'),
  includeSubCategories: z.boolean().default(true),
});

/**
 * フロントエンド（フォーム）用のバリデーションスキーマ
 */
export const mainCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリー名を入力してください')
    .max(100, 'カテゴリー名は100文字以内で入力してください'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: '収入または支出を選択してください' }),
  }),
});

/**
 * TypeScript型の生成
 */
export type CreateMainCategoryInput = z.infer<typeof createMainCategorySchema>;
export type UpdateMainCategoryInput = z.infer<typeof updateMainCategorySchema>;
export type DeleteMainCategoryInput = z.infer<typeof deleteMainCategorySchema>;
export type GetMainCategoriesInput = z.infer<typeof getMainCategoriesSchema>;
export type GetMainCategoryByIdInput = z.infer<
  typeof getMainCategoryByIdSchema
>;
export type MainCategoryFormInput = z.infer<typeof mainCategoryFormSchema>;
