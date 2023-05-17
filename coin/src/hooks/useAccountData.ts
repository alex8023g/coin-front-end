import { useEffect, useState } from 'react';
import { IAccount, ITransaction } from '../HomePage';
import { useParams } from 'react-router-dom';

interface IBalance {
  balanceMonth: number;
  inc: number;
  dec: number;
  monthStr: string;
  monthNum: number;
  year: number;
}

function getMonthNum(str: string) {
  return Number(str.split('-')[1]) - 1;
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

  const monthNow = new Date().getMonth();
  const yearNow = new Date().getFullYear();
  const balanceArrTemp: IBalance[] = [];

  for (let i = 0; i < monthAmount; i++) {
    let monthNum = monthNow - i < 0 ? monthNow - i + 12 : monthNow - i;
    let year = monthNow - i < 0 ? yearNow - 1 : yearNow;

    balanceArrTemp.push({
      balanceMonth: 0,
      inc: 0,
      dec: 0,
      monthNum,
      monthStr: monthNameArr[monthNum],
      year,
    });
  }
  // balanceArrTemp.reverse();

  console.log(balanceArrTemp);
  // setBalanceArr(balanceArr2);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + '/account/' + account, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then(
        ({
          payload: { account, balance, mine, transactions },
        }: {
          payload: IAccount;
        }) => {
          console.log(account, balance, mine, transactions);
          setAccData({ account, balance, mine, transactions });
          setLastTrans(transactions.slice().reverse());

          // тестовые транзакции начало
          /*/
          transactions = [
            {
              amount: 1000000,
              date: '2022-11-28T09:46:54.884Z',
              from: '71370733101553022523146507',
              to: '74213041477477406320783754',
            },
            {
              amount: 500000,
              date: '2022-12-28T09:46:57.884Z',
              from: '74213041477477406320783754',
              to: '46010282515715723857833486',
            },
            {
              amount: 200000,
              date: '2022-12-28T09:46:57.884Z',
              from: '46010282515715723857833486',
              to: '74213041477477406320783754',
            },
            {
              amount: 1000000,
              date: '2023-01-28T09:47:00.887Z',
              from: '86430573006880753056512315',
              to: '74213041477477406320783754',
            },
            {
              amount: 1000000,
              date: '2023-02-28T09:47:11.900Z',
              from: '74213041477477406320783754',
              to: '41372555032600447245844105',
            },
            {
              amount: 1000000,
              date: '2023-03-28T09:47:22.911Z',
              from: '47386101747050212355223566',
              to: '74213041477477406320783754',
            },
            {
              amount: 1000000,
              date: '2023-04-28T09:47:25.914Z',
              from: '14167513382811856257558661',
              to: '74213041477477406320783754',
            },
            {
              amount: 1000000,
              date: '2023-05-27T09:47:27.914Z',
              from: '28464001178338455251027723',
              to: '74213041477477406320783754',
            },
            {
              amount: 500000,
              date: '2023-05-28T09:47:27.914Z',
              from: '74213041477477406320783754',
              to: '28464001178338455251027723',
            },
          ];
          setLastTrans(transactions.slice().reverse());
          // конец тестовые транзакции
          //*/
          balanceArrTemp.forEach((item, index) => {
            item.balanceMonth = balance;

            const monthTransInc = transactions
              .filter(
                (trans) =>
                  new Date(trans.date).getFullYear() === item.year &&
                  new Date(trans.date).getMonth() === item.monthNum &&
                  trans.to === account
              )
              .reduce((sum, current) => sum + current.amount, 0);

            console.log(monthTransInc);
            item.inc = monthTransInc;
            balance -= monthTransInc;
            const monthTransDec = transactions
              .filter(
                (trans) =>
                  new Date(trans.date).getFullYear() === item.year &&
                  new Date(trans.date).getMonth() === item.monthNum &&
                  trans.from === account
              )
              .reduce((sum, current) => sum + current.amount, 0);

            console.log(monthTransDec);
            item.dec = monthTransDec;
            balance += monthTransDec;
          });

          // const balanceArrTempCopy = structuredClone(balanceArrTemp).reverse();
          // setBalanceArr(balanceArrTempCopy);
          setBalanceArr(balanceArrTemp.slice().reverse());
        }
      );
  }, [token]);
  console.log(accData, balanceArr, lastTrans);
  return [accData, balanceArr, lastTrans];
}
