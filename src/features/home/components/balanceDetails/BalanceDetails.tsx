import React from 'react';
import s from './balanceDetails.module.scss';
import BalanceDetailList from '../balanceDetailList/BalanceDetailList';

const BalanceDetails = () => {
  return (
    <div className={s.balance_details}>
      <h3 className={s.balance_details_title}>収支内容</h3>
      <div className={s.balance_details_grid}>
        <div className={s.balance_details_grid_item}>
          <p className={`${s.balance_details_label} ${s.income}`}>収入</p>
          <BalanceDetailList />
        </div>
        <div className={s.balance_details_grid_item}>
          <p className={`${s.balance_details_label} ${s.expense}`}>支出</p>
          <BalanceDetailList />
        </div>
      </div>
    </div>
  );
};

export default BalanceDetails;
