import React from 'react';
import s from './balanceDetailList.module.scss';
import { Pencil, Trash2 } from 'lucide-react';
import { Transaction } from '../../types/transaction';
import { formatNumber } from '../../utils/formatValue';

type BalanceDetailListProps = {
  transactionDetailMap: Transaction[] | undefined;
};

const BalanceDetailList = ({
  transactionDetailMap,
}: BalanceDetailListProps) => {
  return (
    <ul className={s.balance_detail_list}>
      {transactionDetailMap?.length !== 0 ? (
        transactionDetailMap?.map((transaction) => (
          <li key={transaction.id} className={s.balance_detail_list_item}>
            <div className={s.category_container}>
              <h4 className={s.main_category}>
                {transaction.mainCategory.name}
              </h4>
              <p className={s.sub_category}>{transaction.subCategory?.name}</p>
            </div>
            <div className={s.action_buttons}>
              <Pencil size={16} className={s.action_button_icon} />
              <Trash2 size={16} className={s.action_button_icon} />
            </div>
            <p
              className={`${s.amount} ${transaction.type === 'income' ? s.income : s.expense}`}
            >
              <span className={s.yen_symbol}>¥</span>
              {formatNumber(transaction.amount)}
            </p>
          </li>
        ))
      ) : (
        <p className={s.no_transaction}>取引がありません</p>
      )}
    </ul>
  );
};

export default BalanceDetailList;
