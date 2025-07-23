import React from 'react';
import s from './balanceDetails.module.scss';
import BalanceDetailList from '../balanceDetailList/BalanceDetailList';
import { TransactionDetailData } from '../../types/transaction';

type BalanceDetailsProps = {
  transactionDetailData: TransactionDetailData | null;
};

const BalanceDetails = ({ transactionDetailData }: BalanceDetailsProps) => {
  const { income, expense } = transactionDetailData || {};
  return (
    <div className={s.balance_details}>
      <h3 className={s.balance_details_title}>収支内容</h3>
      <div className={s.balance_details_grid}>
        <div className={s.balance_details_grid_item}>
          <p className={s.balance_details_label}>収入</p>
          <BalanceDetailList transactionDetailMap={income?.transactions} />
        </div>
        <div className={s.balance_details_grid_item}>
          <p className={s.balance_details_label}>支出</p>
          <BalanceDetailList transactionDetailMap={expense?.transactions} />
        </div>
      </div>
    </div>
  );
};

export default BalanceDetails;
