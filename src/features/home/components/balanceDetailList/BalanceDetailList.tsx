import React from 'react';
import s from './balanceDetailList.module.scss';
import { Pencil, Trash2 } from 'lucide-react';

const BalanceDetailList = () => {
  return (
    <ul className={s.balance_detail_list}>
      <li className={s.balance_detail_list_item}>
        <div className={s.category_container}>
          <h4 className={s.main_category}>食費</h4>
          <p className={s.sub_category}>ラーメン</p>
        </div>
        <div className={s.action_buttons}>
          <Pencil size={16} className={s.action_button_icon} />
          <Trash2 size={16} className={s.action_button_icon} />
        </div>
        <p className={s.amount}>
          <span className={s.yen_symbol}>¥</span>1,000
        </p>
      </li>
      <li className={s.balance_detail_list_item}>
        <div className={s.category_container}>
          <h4 className={s.main_category}>食費</h4>
          <p className={s.sub_category}>ラーメン</p>
        </div>
        <div className={s.action_buttons}>
          <Pencil size={16} className={s.action_button_icon} />
          <Trash2 size={16} className={s.action_button_icon} />
        </div>
        <p className={s.amount}>
          <span className={s.yen_symbol}>¥</span>1,000
        </p>
      </li>
      <li className={s.balance_detail_list_item}>
        <div className={s.category_container}>
          <h4 className={s.main_category}>食費</h4>
          <p className={s.sub_category}>ラーメン</p>
        </div>
        <div className={s.action_buttons}>
          <Pencil size={16} className={s.action_button_icon} />
          <Trash2 size={16} className={s.action_button_icon} />
        </div>
        <p className={s.amount}>
          <span className={s.yen_symbol}>¥</span>1,000
        </p>
      </li>
    </ul>
  );
};

export default BalanceDetailList;
