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
        <FormField
          id="date"
          label="日付"
          required
          // errorMsg={errors.date?.message}
          errorMsg={'日付で入力してください'}
        >
          <InputDateField selectedDate={selectedDate} />
        </FormField>
      </form>
    </div>
  );
};

export default TransactionInputContainer;
