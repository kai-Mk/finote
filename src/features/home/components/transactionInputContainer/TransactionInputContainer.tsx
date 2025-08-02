import React from 'react';
import { type Dispatch, type SetStateAction } from 'react';
import s from './transactionInputContainer.module.scss';
import { CircleX } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TransactionFormInput,
  transactionFormSchema,
} from '@/lib/validations/transaction';
import { SelectedDate } from '../../types/calendar';
import InputField from '@/components/ui/inputField/InputField';
import FormField from '../formField/FormField';
import InputDateField from '../InputDateField/InputDateField';
import InputSelectBox from '@/components/ui/inputSelectBox/InputSelectBox';
import InputRadioButton from '@/components/ui/inputRadioButton/InputRadioButton';
import InputTextArea from '@/components/ui/inputTextArea/InputTextArea';
import PrimaryButton from '@/components/ui/primaryButton/PrimaryButton';
import { useTransactionFormData } from '../../hooks/useTransactionFormData';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import { trpc } from '@/lib/trpc';

type TransactionInputContainerProps = {
  inputType: 'income' | 'expense' | null;
  setInputType: Dispatch<SetStateAction<'income' | 'expense' | null>>;
  selectedDate: SelectedDate;
  TransactionDetailRefetch: () => void;
};

const TransactionInputContainer = ({
  inputType,
  setInputType,
  selectedDate,
  TransactionDetailRefetch,
}: TransactionInputContainerProps) => {
  const InputTypeLabel = inputType === 'income' ? '収入' : '支出';
  const inputTypeClass = inputType === 'income' ? s.income : s.expense;
  const { year, month, date } = selectedDate;

  // react-hook-formのセットアップ
  const methods = useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: '',
      type: inputType as 'income' | 'expense',
      date: `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`,
      mainCategoryId: '',
      subCategoryId: '',
      description: '',
      budgetId: '',
      paymentMethodId: '',
    },
  });

  const createTransactionMutation = trpc.transactions.create.useMutation({
    onSuccess: (data) => {
      methods.reset();
      setInputType(null);
      TransactionDetailRefetch();
    },
    onError: (error) => {
      console.error('取引作成エラー:', error);
      // エラーハンドリング
      alert(`エラーが発生しました: ${error.message}`);
    },
  });

  // フォーム送信処理
  const onSubmit = async (data: TransactionFormInput) => {
    try {
      // undefinedの値をnullまたは削除して整形
      const submitData = {
        amount: data.amount,
        type: data.type,
        mainCategoryId: data.mainCategoryId,
        subCategoryId: data.subCategoryId || undefined, // undefinedのままでOK
        description: data.description || undefined,
        date: data.date,
        budgetId: data.budgetId || undefined, // undefinedのままでOK
        paymentMethodId: data.paymentMethodId,
      };

      // tRPC mutationを実行
      await createTransactionMutation.mutateAsync(submitData);
    } catch (error) {
      console.error('送信エラー:', error);
    }
  };

  const currentMainCategoryId = methods.watch('mainCategoryId');

  const {
    mainCategoryData,
    subCategoryData,
    budgetData,
    paymentMethodData,
    loading,
  } = useTransactionFormData(
    inputType as 'income' | 'expense',
    currentMainCategoryId
  );

  return (
    <div className={s.transaction_input_container}>
      {loading ? (
        <div className={s.loading}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className={s.transaction_input_header}>
            <h2 className={`${s.transaction_input_title} ${inputTypeClass}`}>
              {InputTypeLabel}の入力
            </h2>
            <CircleX
              className={s.transaction_input_close_icon}
              size={32}
              onClick={() => setInputType(null)}
            />
          </div>
          <FormProvider {...methods}>
            <form
              className={s.transaction_input_form}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              {/* 金額入力フィールド */}
              <FormField
                id="amount"
                label="金額"
                required
                helperText={'数字を入力してください'}
                errorMsg={methods.formState.errors.amount?.message}
              >
                <InputField
                  type="text"
                  id="amount"
                  placeholder="例）1200"
                  width="50%"
                  name="amount"
                />
              </FormField>
              {/* 日付入力フィールド */}
              <FormField
                id="date"
                label="日付"
                required
                errorMsg={methods.formState.errors.date?.message}
              >
                <InputDateField selectedDate={selectedDate} name="date" />
              </FormField>
              {/* メインカテゴリー入力フィールド */}
              <FormField
                id="mainCategory"
                label="メインカテゴリー"
                required
                errorMsg={methods.formState.errors.mainCategoryId?.message}
              >
                <InputSelectBox
                  id="mainCategory"
                  optionData={mainCategoryData}
                  name="mainCategoryId"
                />
              </FormField>
              {/* サブカテゴリー入力フィールド */}
              <FormField
                id="subCategory"
                label="サブカテゴリー"
                errorMsg={methods.formState.errors.subCategoryId?.message}
              >
                <InputSelectBox
                  id="subCategory"
                  optionData={subCategoryData}
                  name="subCategoryId"
                />
              </FormField>
              {/* 紐づけ予算フィールド */}
              <FormField
                id="budget"
                label="紐づけ予算"
                errorMsg={methods.formState.errors.budgetId?.message}
              >
                <InputSelectBox
                  id="budget"
                  optionData={budgetData}
                  name="budgetId"
                />
              </FormField>
              {/* 支払い方法選択フィールド */}
              <FormField
                id="paymentMethod"
                label="支払い方法"
                required
                errorMsg={methods.formState.errors.paymentMethodId?.message}
              >
                <InputRadioButton
                  radioButtonData={paymentMethodData}
                  name="paymentMethodId"
                />
              </FormField>
              {/* 取引メモ入力フィールド */}
              <FormField
                id="description"
                label="取引メモ"
                helperText={'500文字以内で入力してください'}
                errorMsg={methods.formState.errors.description?.message}
              >
                <InputTextArea
                  id="description"
                  name="description"
                  placeholder="取引メモを入力してください"
                  maxLength={500}
                />
              </FormField>

              {/* 送信ボタン */}
              <div className={s.transaction_input_button_wrapper}>
                <PrimaryButton
                  type="submit"
                  label="送信する"
                  className={s.submit_button}
                />
              </div>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
};

export default TransactionInputContainer;
