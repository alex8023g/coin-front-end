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
    main: true,
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
      .then(({ payload }: { payload: IAccount }) => {
        console.log(payload);
        setAccData(payload);
        setLastTrans(payload.transactions);
        let indexTr = payload.transactions.length - 1;
        let indexBal = 1;

        const balance: IBalance[] = [];
        if (payload.transactions[indexTr].date) {
          balance.push({
            amount: payload.transactions[indexTr].amount,
            monthStr:
              monthNameArr[
              Number(payload.transactions[indexTr].date.split('-')[1])
              ],
            monthNum: Number(payload.transactions[indexTr].date.split('-')[1]),
          });
        } else return;

        do {
          const monthNum = Number(
            payload.transactions[indexTr].date.split('-')[1]
          );
          // console.log(balance, { indexBal }, balance[indexBal]);
          if (balance[indexBal - 1].monthStr === monthNameArr[monthNum]) {
            // console.log('if');
            balance[indexBal - 1].amount +=
              payload.transactions[indexTr].amount;
            indexTr--;
          } else if (
            [1, -11].includes(balance[indexBal - 1].monthNum - monthNum)
          ) {
            console.log('else if');
            balance.push({
              amount: payload.transactions[indexTr].amount,
              monthStr: monthNameArr[monthNum],
              monthNum,
            });
            indexBal++;
            indexTr--;
          } else {
            console.log('else', { indexBal }, balance);
            const monthNum2 =
              balance[indexBal - 1].monthNum > 1
                ? balance[indexBal - 1].monthNum - 1
                : 12;
            balance.push({
              amount: 0,
              monthStr: monthNameArr[monthNum2],
              monthNum: monthNum2,
            });
            indexBal++;
            // indexTr--;
          }
        } while (balance.length < monthAmount);
        console.log(balance);
        setBalanceArr(balance.reverse());
      });
  }, [token]);

  return [accData, balanceArr, lastTrans]

}


