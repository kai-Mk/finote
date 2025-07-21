import React from 'react';
import { SelectedDate } from '@/features/home/types/calendar';
import s from './transactionDetailContainer.module.scss';
import { getTransactionDetailDate } from '../../utils/getTransactionDetailDate';

type TransactionDetailContainerProps = {
  selectedDate: SelectedDate | null;
};

const TransactionDetailContainer = ({
  selectedDate,
}: TransactionDetailContainerProps) => {
  const transactionDetailDate =
    selectedDate && getTransactionDetailDate(selectedDate);

  return (
    <div className={s.transaction_detail_container}>
      {selectedDate ? (
        <div className={s.transaction_detail_main}>
          <h2 className={s.transaction_detail_date}>{transactionDetailDate}</h2>
          <div className={s.transaction_add_buttons}>
            <button className={`${s.transaction_add_button} ${s.income}`}>
              収入
            </button>
            <button className={`${s.transaction_add_button} ${s.expense}`}>
              支出
            </button>
          </div>
        </div>
      ) : (
        <p className={s.not_selected_text}>日付を選択してください</p>
      )}
    </div>
  );
};

export default TransactionDetailContainer;
