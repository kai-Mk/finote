import React, { useEffect, useState } from 'react';
import { SelectedDate } from '@/features/home/types/calendar';
import s from './transactionDetailContainer.module.scss';
import { getTransactionDetailDate } from '../../utils/getTransactionDetailDate';
import PrimaryButton from '@/components/ui/primaryButton/PrimaryButton';
import TotalBalance from '../totalBalance/TotalBalance';
import BalanceDetails from '../balanceDetails/BalanceDetails';
import { useTransitionByDate } from '../../hooks/useTransactionByDate';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner';
import TransactionInputContainer from '../transactionInputContainer/TransactionInputContainer';
import { getIsDisplayButton } from '../../utils/getIsDisplayButton';
import { trpc } from '@/lib/trpc';

type TransactionDetailContainerProps = {
  selectedDate: SelectedDate | null;
};

const TransactionDetailContainer = ({
  selectedDate,
}: TransactionDetailContainerProps) => {
  const transactionDetailDate =
    selectedDate && getTransactionDetailDate(selectedDate);

  const {
    transactionDetailData,
    loading,
    refetch: transactionDetailRefetch,
  } = useTransitionByDate(selectedDate);

  // 収支入力管理
  const [inputType, setInputType] = useState<'income' | 'expense' | null>(null);
  const [isDisplayButton, setIsDisplayButton] = useState(false);
  useEffect(() => {
    // 選択された日付が変更されたときに収支入力をリセット
    setInputType(null);
    if (selectedDate) {
      setIsDisplayButton(getIsDisplayButton(selectedDate));
    }
  }, [selectedDate]);

  const deleteTransaction = trpc.transactions.delete.useMutation({
    onSuccess: (data) => {
      console.log('削除成功:', data.message);
      alert(data.message);
      // 必要に応じて一覧を再取得
      transactionDetailRefetch();
    },
    onError: (error) => {
      console.error('削除エラー:', error);
      alert(`削除に失敗しました: ${error.message}`);
    },
  });

  // トランサクションデータの削除
  const handleDeleteTransaction = async (transactionId: number) => {
    const confirmed = window.confirm('この取引を削除してもよろしいですか？');
    if (!confirmed) return;

    try {
      await deleteTransaction.mutateAsync({ id: transactionId });
    } catch (error) {
      // エラーはonErrorで処理される
    }
  };

  return (
    <div className={s.transaction_detail_container}>
      {loading ? (
        <div className={s.loading}>
          <LoadingSpinner />
        </div>
      ) : inputType && selectedDate ? (
        <TransactionInputContainer
          inputType={inputType}
          setInputType={setInputType}
          selectedDate={selectedDate}
          transactionDetailRefetch={transactionDetailRefetch}
        />
      ) : selectedDate ? (
        <div className={s.transaction_detail_main}>
          <h2 className={s.transaction_detail_date}>{transactionDetailDate}</h2>
          {isDisplayButton && (
            <div className={s.transaction_add_buttons}>
              <PrimaryButton
                label="収入を追加"
                className={s.income}
                onButtonClick={() => setInputType('income')}
              />
              <PrimaryButton
                label="支出を追加"
                className={s.expense}
                onButtonClick={() => setInputType('expense')}
              />
            </div>
          )}
          <TotalBalance transactionDetailData={transactionDetailData} />
          <BalanceDetails
            transactionDetailData={transactionDetailData}
            handleDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      ) : (
        <p className={s.not_selected_text}>日付を選択してください</p>
      )}
    </div>
  );
};

export default TransactionDetailContainer;
