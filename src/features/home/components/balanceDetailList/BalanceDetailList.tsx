import React from 'react';
import s from './balanceDetailList.module.scss';

const BalanceDetailList = () => {
  return (
    <ul className={s.balance_detail_list}>
      <li className={s.balance_detail_list_item}>リスト1</li>
      <li className={s.balance_detail_list_item}>リスト2</li>
      <li className={s.balance_detail_list_item}>リスト2</li>
      <li className={s.balance_detail_list_item}>リスト2</li>
      <li className={s.balance_detail_list_item}>リスト2</li>
      <li className={s.balance_detail_list_item}>リスト2</li>
      <li className={s.balance_detail_list_item}>リスト2</li>
    </ul>
  );
};

export default BalanceDetailList;
