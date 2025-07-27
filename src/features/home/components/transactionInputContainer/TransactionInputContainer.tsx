import React from 'react';
import { type Dispatch, type SetStateAction } from 'react';
import s from './transactionInputContainer.module.scss';
import { CircleX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionFormSchema } from '@/lib/validations/transaction';
import { SelectedDate } from '../../types/calendar';
import InputField from '@/components/ui/inputField/InputField';
import FormField from '../formField/FormField';
import InputDateField from '../InputDateField/InputDateField';
import InputSelectBox from '@/components/ui/inputSelectBox/InputSelectBox';
import InputRadioButton from '@/components/ui/inputRadioButton/InputRadioButton';
import InputTextArea from '@/components/ui/inputTextArea/InputTextArea';
import PrimaryButton from '@/components/ui/primaryButton/PrimaryButton';

type TransactionInputContainerProps = {
  inputType: 'income' | 'expense' | null;
  setInputType: Dispatch<SetStateAction<'income' | 'expense' | null>>;
  selectedDate: SelectedDate;
};

const TransactionInputContainer = ({
  inputType,
  setInputType,
  selectedDate,
}: TransactionInputContainerProps) => {
  const InputTypeLabel = inputType === 'income' ? '収入' : '支出';
  const { year, month, date } = selectedDate;
  // react-hook-formのセットアップ
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: '',
      type: inputType as 'income' | 'expense',
      date: `${year}-${month}-${date}`,
    },
  });

  return (
    <div className={s.transaction_input_container}>
      <div className={s.transaction_input_header}>
        <h2 className={s.transaction_input_title}>{InputTypeLabel}の入力</h2>
        <CircleX
          className={s.transaction_input_close_icon}
          size={32}
          onClick={() => setInputType(null)}
        />
      </div>
      <form className={s.transaction_input_form}>
        {/* 金額入力フィールド */}
        <FormField
          id="amount"
          label="金額"
          required
          helperText={'数字を入力してください'}
          // errorMsg={errors.amount?.message}
          errorMsg={'数字で入力してください'}
        >
          <InputField
            type="text"
            id="amount"
            placeholder="例）1200"
            width="50%"
            {...register('amount')}
          />
        </FormField>
        {/* 日付入力フィールド */}
        <FormField
          id="date"
          label="日付"
          required
          // errorMsg={errors.date?.message}
          errorMsg={'日付で入力してください'}
        >
          <InputDateField selectedDate={selectedDate} />
        </FormField>
        {/* メインカテゴリー入力フィールド */}
        <FormField
          id="mainCategory"
          label="メインカテゴリー"
          required
          errorMsg={'メインカテゴリーを選択してください'}
        >
          <InputSelectBox id="mainCategory" optionData={[]} />
        </FormField>
        {/* サブカテゴリー入力フィールド */}
        <FormField id="subCategory" label="サブカテゴリー">
          <InputSelectBox id="subCategory" optionData={[]} />
        </FormField>
        {/* 紐づけ予算フィールド */}
        <FormField id="budget" label="紐づけ予算">
          <InputSelectBox id="budget" optionData={[]} />
        </FormField>
        {/* 支払い方法選択フィールド */}
        <FormField
          id="paymentMethod"
          label="支払い方法"
          required
          errorMsg={'支払い方法を選択してください'}
        >
          <InputRadioButton
            radioButtonData={[
              { id: 'creditCard', label: 'クレジットカード' },
              { id: 'bankTransfer', label: '銀行振込' },
            ]}
            radioButtonName="paymentMethod"
          />
        </FormField>
        {/* 取引メモ入力フィールド */}
        <FormField id="description" label="取引メモ" errorMsg={undefined}>
          <InputTextArea id="description" />
        </FormField>

        {/* 送信ボタン */}
        <div className={s.transaction_input_button_wrapper}>
          <PrimaryButton label="送信する" className={s.submit_button} />
        </div>
      </form>
    </div>
  );
};

export default TransactionInputContainer;
