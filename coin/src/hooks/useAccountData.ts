import { useEffect, useState } from 'react';
import { IAccount, ITransaction } from '../HomePage';
import { useParams } from 'react-router-dom';


interface IBalance {
  amount: number;
  monthStr: string;
  monthNum: number;
}
export function useAccountData(monthAmount: number) {
  const [accData, setAccData] = useState<IAccount>({
    account: '',
    balance: 0,
    mine: true,
    transactions: [{ amount: 0, date: '', from: '', to: '' }],
  });
  const [balanceArr, setBalanceArr] = useState<IBalance[]>([]);
  const [lastTrans, setLastTrans] = useState<ITransaction[]>([]);
  const { account } = useParams();
  // console.log(window.location.href.split('/').at(-1));

  const token = sessionStorage.getItem('auth');

  const monthNameArr = [
    '',
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];

  // console.log(monthNameArr);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + '/account/' + account, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then(({ payload: { account, balance, mine, transactions } }: { payload: IAccount }) => {
        console.log(account, balance, mine, transactions);
        setAccData({ account, balance, mine, transactions });
        setLastTrans(transactions);
        let indexTr = transactions.length - 1;
        let indexBal = 1;

        const balanceDyn: IBalance[] = [];
        if (transactions[indexTr].date) {

          balanceDyn.push({
            amount: transactions[indexTr].amount,
            monthStr:
              monthNameArr[
              Number(transactions[indexTr].date.split('-')[1])
              ],
            monthNum: Number(transactions[indexTr].date.split('-')[1]),
          });
        } else return;

        do {
          const monthNum = Number(
            transactions[indexTr].date.split('-')[1]
          );
          // если месяц транзакции совпадает с месяцем динамики баланса
          if (balanceDyn[indexBal - 1].monthStr === monthNameArr[monthNum]) {

            if (account === transactions[indexTr].from) { }
            balanceDyn[indexBal - 1].amount +=
              transactions[indexTr].amount;
            indexTr--;
          } else if (
            [1, -11].includes(balanceDyn[indexBal - 1].monthNum - monthNum)
          ) {
            console.log('else if');
            balanceDyn.push({
              amount: transactions[indexTr].amount,
              monthStr: monthNameArr[monthNum],
              monthNum,
            });
            indexBal++;
            indexTr--;
          } else {
            console.log('else', { indexBal }, balanceDyn);
            const monthNum2 =
              balanceDyn[indexBal - 1].monthNum > 1
                ? balanceDyn[indexBal - 1].monthNum - 1
                : 12;
            balanceDyn.push({
              amount: 0,
              monthStr: monthNameArr[monthNum2],
              monthNum: monthNum2,
            });
            indexBal++;
            // indexTr--;
          }
        } while (balanceDyn.length < monthAmount);
        console.log(balanceDyn);
        setBalanceArr(balanceDyn.reverse());
      });
  }, [token]);

  return [accData, balanceArr, lastTrans]

}


