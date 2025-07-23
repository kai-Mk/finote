import React from 'react';
import s from './totalBalance.module.scss';
import { TransactionDetailData } from '../../types/transaction';
import { formatNumber } from '../../utils/formatValue';

type TotalBalanceProps = {
  transactionDetailData: TransactionDetailData | null;
};

const TotalBalance = ({ transactionDetailData }: TotalBalanceProps) => {
  const incomeAmount = transactionDetailData?.income.totalAmount || 0;
  const expenseAmount = transactionDetailData?.expense.totalAmount || 0;

  return (
    <div className={s.total_balance}>
      <h3 className={s.total_balance_title}>総収支</h3>
      <div className={s.total_balance_grid}>
        <div className={s.total_balance_grid_item}>
          <p className={s.total_balance_label}>収入</p>
          <p className={`${s.total_balance_value} ${s.income}`}>
            <span className={s.yen_symbol}>¥</span>
            {formatNumber(incomeAmount)}
          </p>
        </div>
        <div className={s.total_balance_grid_item}>
          <p className={s.total_balance_label}>支出</p>
          <p className={`${s.total_balance_value} ${s.expense}`}>
            <span className={s.yen_symbol}>¥</span>
            {formatNumber(expenseAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalBalance;
