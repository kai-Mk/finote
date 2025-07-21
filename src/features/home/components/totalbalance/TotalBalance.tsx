import React from 'react';
import s from './totalBalance.module.scss';

const TotalBalance = () => {
  return (
    <div className={s.total_balance}>
      <h3 className={s.total_balance_title}>総収支</h3>
      <div className={s.total_balance_grid}>
        <div className={s.total_balance_grid_item}>
          <p className={s.total_balance_label}>収入</p>
          <p className={s.total_balance_value}>
            <span className={s.yen_symbol}>¥</span>20,000
          </p>
        </div>
        <div className={s.total_balance_grid_item}>
          <p className={s.total_balance_label}>支出</p>
          <p className={s.total_balance_value}>
            <span className={s.yen_symbol}>¥</span>35,000
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalBalance;
