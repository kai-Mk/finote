import { trpcClient } from '@/lib/trpc';

/**
 * 取引入力時の紐づけ予算を取得
 */
export const getBudgetDataUsedInForm = async () => {
  const response = await trpcClient.budgets.getAll.query({});

  const processedData = response.budgets.map((budget) => {
    return {
      id: budget.id,
      name: budget.name,
    };
  });

  return processedData;
};
