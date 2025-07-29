import { z } from 'zod';

/**
 * 支払い方法タイプの定義
 */
export const paymentMethodTypes = [
  'cash',
  'credit',
  'e_money',
  'bank_transfer',
] as const;

/**
 * 支払い方法の基本オブジェクトスキーマ
 */
const basePaymentMethodObjectSchema = z.object({
  name: z
    .string()
    .min(1, '支払い方法名を入力してください')
    .max(50, '支払い方法名は50文字以内で入力してください'),
  type: z.enum(paymentMethodTypes, {
    errorMap: () => ({ message: '有効な支払い方法タイプを選択してください' }),
  }),
  description: z
    .string()
    .max(500, '説明は500文字以内で入力してください')
    .optional(),
});

/**
 * 支払い方法の基本バリデーションスキーマ
 */
export const basePaymentMethodSchema = basePaymentMethodObjectSchema;

/**
 * 支払い方法作成用のバリデーションスキーマ
 * API（tRPC）で使用
 */
export const createPaymentMethodSchema = basePaymentMethodSchema;

/**
 * 支払い方法更新用のバリデーションスキーマ
 * API（tRPC）で使用
 */
export const updatePaymentMethodSchema = basePaymentMethodObjectSchema
  .partial()
  .extend({
    id: z.number().positive('有効な支払い方法IDが必要です'),
  });

/**
 * 支払い方法削除用のバリデーションスキーマ
 */
export const deletePaymentMethodSchema = z.object({
  id: z.number().positive('有効な支払い方法IDが必要です'),
});

/**
 * 支払い方法取得用のバリデーションスキーマ
 */
export const getPaymentMethodsSchema = z.object({
  // タイプフィルター
  type: z.enum(paymentMethodTypes).optional(),

  // 名前での検索
  searchName: z.string().optional(),

  // 関連する取引も含めて取得するか
  includeTransactions: z.boolean().default(false),

  // ページネーション
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),

  // ソート
  sortBy: z.enum(['name', 'type', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * 支払い方法詳細取得用のバリデーションスキーマ
 */
export const getPaymentMethodByIdSchema = z.object({
  id: z.number().positive('有効な支払い方法IDが必要です'),
  includeTransactions: z.boolean().default(true),
  includeStats: z.boolean().default(true), // 使用統計も含めるか
});

/**
 * 支払い方法使用統計用のバリデーションスキーマ
 */
export const getPaymentMethodUsageStatsSchema = z.object({
  id: z.number().positive('有効な支払い方法IDが必要です'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  groupByMonth: z.boolean().default(false), // 月別の統計も取得するか
});

/**
 * タイプ別支払い方法取得用のバリデーションスキーマ
 */
export const getPaymentMethodsByTypeSchema = z.object({
  type: z.enum(paymentMethodTypes),
  includeStats: z.boolean().default(false),
});

/**
 * フロントエンド（フォーム）用のバリデーションスキーマ
 */
export const paymentMethodFormSchema = z.object({
  name: z
    .string()
    .min(1, '支払い方法名を入力してください')
    .max(50, '支払い方法名は50文字以内で入力してください'),
  type: z.enum(paymentMethodTypes, {
    errorMap: () => ({ message: '有効な支払い方法タイプを選択してください' }),
  }),
  description: z
    .string()
    .max(500, '説明は500文字以内で入力してください')
    .optional(),
});

/**
 * TypeScript型の生成
 */
export type PaymentMethodType = (typeof paymentMethodTypes)[number];
export type CreatePaymentMethodInput = z.infer<
  typeof createPaymentMethodSchema
>;
export type UpdatePaymentMethodInput = z.infer<
  typeof updatePaymentMethodSchema
>;
export type DeletePaymentMethodInput = z.infer<
  typeof deletePaymentMethodSchema
>;
export type GetPaymentMethodsInput = z.infer<typeof getPaymentMethodsSchema>;
export type GetPaymentMethodByIdInput = z.infer<
  typeof getPaymentMethodByIdSchema
>;
export type GetPaymentMethodUsageStatsInput = z.infer<
  typeof getPaymentMethodUsageStatsSchema
>;
export type GetPaymentMethodsByTypeInput = z.infer<
  typeof getPaymentMethodsByTypeSchema
>;
export type PaymentMethodFormInput = z.infer<typeof paymentMethodFormSchema>;

/**
 * 支払い方法タイプの日本語名マッピング
 */
export const paymentMethodTypeLabels = {
  cash: '現金',
  credit: 'クレジットカード',
  e_money: '電子マネー',
  bank_transfer: '銀行振込',
} as const;
