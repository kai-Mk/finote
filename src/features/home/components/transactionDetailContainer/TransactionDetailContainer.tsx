import React from 'react';
import { SelectedDate } from '@/features/home/types/calendar';
import s from './transactionDetailContainer.module.scss';
import { getTransactionDetailDate } from '../../utils/getTransactionDetailDate';
import PrimaryButton from '@/components/ui/primaryButton/PrimaryButton';
import TotalBalance from '../totalbalance/TotalBalance';
import BalanceDetails from '../balanceDetails/BalanceDetails';

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
            <PrimaryButton label="収入を追加" className={s.income} />
            <PrimaryButton label="支出を追加" className={s.expense} />
          </div>
          <TotalBalance />
          <BalanceDetails />
        </div>
      ) : (
        <p className={s.not_selected_text}>日付を選択してください</p>
      )}
    </div>
  );
};

export default TransactionDetailContainer;
