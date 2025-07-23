import React from 'react';
import { type Dispatch, type SetStateAction } from 'react';
import s from './transactionInputContainer.module.scss';
import { CircleX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionFormSchema } from '@/lib/validations/transaction';
import { SelectedDate } from '../../types/calendar';

type TransactionInputContainerProps = {
  inputType: 'income' | 'expense' | null;
  setInputType: Dispatch<SetStateAction<'income' | 'expense' | null>>;
  selectedDate: SelectedDate | null;
};

const TransactionInputContainer = ({
  inputType,
  setInputType,
  selectedDate,
}: TransactionInputContainerProps) => {
  const InputTypeLabel = inputType === 'income' ? '収入' : '支出';
  const { year, month, date } = selectedDate || {};
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
      date: selectedDate ? `${year}-${month}-${date}` : '',
    },
  });

  return (
    <div className={s.transaction_input_container}>
      <h2>{InputTypeLabel}の入力</h2>
      <CircleX size={32} onClick={() => setInputType(null)} />
    </div>
  );
};

export default TransactionInputContainer;
