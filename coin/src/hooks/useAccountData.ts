import { useEffect, useState } from 'react';
import { IAccount, ITransaction } from '../HomePage';
import { useParams } from 'react-router-dom';

interface IBalance {
  balance: number;
  inc: number;
  dec: number;
  monthStr: string;
  monthNum: number;
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
  const balanceArrTemp: IBalance[] = [];

  for (let i = 0; i < monthAmount; i++) {
    let monthNum = monthNow - i < 0 ? monthNow - i + 12 : monthNow - i;

    balanceArrTemp.push({
      balance: 0,
      inc: 0,
      dec: 0,
      monthNum,
      monthStr: monthNameArr[monthNum],
    });
  }
  balanceArrTemp.reverse();

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

          balanceArrTemp[monthAmount - 1].balance = balance;
          let balanceIndex = monthAmount - 1;

          console.log(
            balanceArrTemp[balanceIndex].monthNum,
            getMonthNum(transactions[transactions.length - 1].date)
          );

          for (let i = transactions.length - 1; i >= 0; i--) {
            // (месяц транзакции = месяцу баланса) => {index баланса -= 1, balance = balance[index +1]}
            // (месяц транзакции = месяцу баланса + 1) => {баланс месяца +/- amount транзакции }
            if (
              balanceArrTemp[balanceIndex].monthNum ===
              getMonthNum(transactions[i].date)
            ) {
              console.log('if');
              balanceIndex--;
              if (balanceIndex >= 0) {
                balanceArrTemp[balanceIndex].balance = balance;
              } else {
                break;
              }
            } else if (
              balanceArrTemp[balanceIndex].monthNum ===
              getMonthNum(transactions[i].date) - 1
            ) {
              // console.log('else if', balanceIndex);
              if (transactions[i].from === account) {
                balance += transactions[i].amount;
                balanceArrTemp[balanceIndex].inc =
                  balanceArrTemp[balanceIndex].inc + transactions[i].amount;
              } else {
                balance -= transactions[i].amount;
                balanceArrTemp[balanceIndex].dec =
                  balanceArrTemp[balanceIndex].dec + transactions[i].amount;
              }
              balanceArrTemp[balanceIndex].balance = balance;
            } else {
              console.log('else');
              balanceIndex--;
              if (balanceIndex >= 0) {
                balanceArrTemp[balanceIndex].balance = balance;
              } else break;
            }
          }

          setBalanceArr(balanceArrTemp);
        }
      );
  }, [token]);
  console.log(accData, balanceArr, lastTrans);
  return [accData, balanceArr, lastTrans];
}
