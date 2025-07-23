/**
 * 各カレンダー日ごとの収入と支出の合計
 * ホームのカレンダーで使用
 */
export type DailyTransactionSummary = {
  date: number;
  income: number;
  expense: number;
  balance: number;
};

/**
 * ひと月の収支データ
 * ホームのカレンダーで使用
 */
export type MonthlyTransactionData = {
  dailySummaries: DailyTransactionSummary[];
  monthlyTotal: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
};

// 取引データの型
/**
 * 取引タイプ
 */
export type TransactionType = 'income' | 'expense';

/**
 * 支払い方法タイプ
 */
export type PaymentMethodType = 'cash' | 'credit' | 'e_money' | 'bank_transfer';

/**
 * カテゴリータイプ
 */
export type CategoryType = 'income' | 'expense';

/**
 * 親カテゴリー
 */
export interface MainCategory {
  id: number;
  name: string;
  type: CategoryType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 子カテゴリー
 */
export interface SubCategory {
  id: number;
  name: string;
  mainCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 支払い方法
 */
export interface PaymentMethod {
  id: number;
  name: string;
  type: PaymentMethodType;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 予算
 */
export interface Budget {
  id: number;
  name: string;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * 取引データ（関連データ含む）
 */
export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  mainCategoryId: number;
  subCategoryId: number | null;
  description: string | null;
  date: Date;
  budgetId: number | null;
  paymentMethodId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // 関連データ
  mainCategory: MainCategory;
  subCategory: SubCategory | null;
  paymentMethod: PaymentMethod;
  budget: Budget | null;
}

/**
 * 指定した日の取引データ
 */
export type TransactionDetailData = {
  income: {
    totalAmount: number;
    transactions: Transaction[];
  };
  expense: {
    totalAmount: number;
    transactions: Transaction[];
  };
};
