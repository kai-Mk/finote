import { trpcClient } from '@/lib/trpc';

/**
 * 取引入力時の支払い方法を取得
 */
export const getPaymentMethodDataUsedInForm = async () => {
  const response = await trpcClient.paymentMethods.getAll.query({});
  const processedData = response.paymentMethods.map((paymentMethod) => {
    return {
      id: paymentMethod.id,
      label: paymentMethod.name,
    };
  });
  return processedData;
};
