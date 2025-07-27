import { trpcClient } from '@/lib/trpc';

/**
 * 取引入力時のメインカテゴリーを取得
 */
export const getMainCategoryDataUsedInForm = async (
  type: 'income' | 'expense'
) => {
  const response = await trpcClient.mainCategories.getAll.query({
    type,
    includeSubCategories: true,
  });
  const processedData = response.map((category) => {
    return {
      id: category.id,
      name: category.name,
      subCategories: category.subCategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
      })),
    };
  });
  return processedData;
};
