import { useEffect, useState } from 'react';
import { MainCategoryDataUsedInForm } from '../types/mainCategory';
import { RadioButtonData, SelectBoxData } from '../types/input';
import { getMainCategoryDataUsedInForm } from '../services/mainCategoryService';
import { getBudgetDataUsedInForm } from '../services/budgetService';
import { getPaymentMethodDataUsedInForm } from '../services/paymentMethodService';

export const useTransactionFormData = (
  inputType: 'income' | 'expense',
  currentMainCategoryId: string
) => {
  const [mainCategoryData, setMainCategoryData] = useState<
    MainCategoryDataUsedInForm[]
  >([]);
  const [subCategoryData, setSubCategoryData] = useState<SelectBoxData[]>([]);
  const [budgetData, setBudgetData] = useState<SelectBoxData[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<RadioButtonData[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Promise.allの正しい使い方
        const [categories, budgets, paymentMethods] = await Promise.all([
          getMainCategoryDataUsedInForm(inputType),
          getBudgetDataUsedInForm(),
          getPaymentMethodDataUsedInForm(),
        ]);

        setMainCategoryData(categories);
        setBudgetData(budgets);
        setPaymentMethodData(paymentMethods);
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error('フォームデータの取得に失敗しました');
        setError(errorObj);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [inputType]);

  useEffect(() => {
    const fetchSubCategories = () => {
      if (!currentMainCategoryId || mainCategoryData.length === 0) {
        setSubCategoryData([]);
        return;
      }

      try {
        const selectedMainCategory = mainCategoryData.find(
          (cat) => String(cat.id) === currentMainCategoryId
        );

        if (selectedMainCategory) {
          setSubCategoryData(selectedMainCategory.subCategories);
        } else {
          setSubCategoryData([]);
        }
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error('サブカテゴリーの取得に失敗しました');
        setError(errorObj);
      }
    };

    fetchSubCategories();
  }, [currentMainCategoryId, mainCategoryData]);

  return {
    mainCategoryData,
    subCategoryData,
    budgetData,
    paymentMethodData,
    loading,
    error,
  };
};
