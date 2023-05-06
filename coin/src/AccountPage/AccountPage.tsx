import React, { useEffect, useState } from 'react';
import styles from './accountpage.module.css';
import { Link, useParams } from 'react-router-dom';
import { Button, Paper, TextField } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { IAccount, ITransaction } from '../HomePage';
import {
  Bar,
  BarChart,
  CartesianAxis,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface IBalance {
  amount: number;
  monthStr: string;
  monthNum: number;
}

export function AccountPage() {
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
        setLastTrans(payload.transactions.slice(0, 5));
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
        } while (balance.length < 6);
        console.log(balance);
        setBalanceArr(balance.reverse());
      });
  }, [token]);

  return (
    <>
      <div className={styles.firstLineContainer}>
        <div>
          <h1 className={styles.title}>Просмотр счета</h1>
          <p>№ {accData.account}</p>
        </div>
        <div>
          <Link to={'/'}>
            <Button
              variant="contained"
              // onClick={createAccount}
              sx={{ p: '14px 24px 14px 18px', borderRadius: 2 }}
            >
              <KeyboardBackspaceIcon sx={{ mr: 1 }} />
              вернуться назад
            </Button>
          </Link>
          <p>
            <span className={styles.spanBalance}>Баланс</span>
            <span style={{ float: 'right' }}>{accData.balance} ₽</span>
          </p>
        </div>
      </div>
      <div className={styles.secondLineContainer}>
        <Paper
          elevation={7}
          sx={{
            padding: '25px 50px',
            // flexBasis: 500,
            borderRadius: 9,
            backgroundColor: '#F3F4F6',
          }}
        >
          <h2>Новый перевод</h2>
          <div className={styles.newRemittanceCont}>
            <div className={styles.textFieldCont}>
              <TextField
                id="outlined-basic2"
                label="Номер счета получателя"
                variant="outlined"
                sx={{ marginBottom: '25px', width: 300 }}
              />
              <TextField
                id="outlined-basic2"
                label="Сумма перевода"
                variant="outlined"
                sx={{ width: 300 }}
              />
            </div>
            <Button variant="contained" sx={{ padding: '14px 40px' }}>
              <MailOutlineIcon sx={{ marginRight: '7px' }} />
              отправить
            </Button>
          </div>
        </Paper>
        <Link to={'/balance/' + account}>
          <Paper
            elevation={7}
            sx={{
              padding: '25px 50px',
              width: '720px',
              // flexBasis: 720,
              borderRadius: 9,
            }}
          >
            <h2>Динамика баланса</h2>
            <ResponsiveContainer width={'99%'} height={165}>
              <BarChart
                // width={600}
                // height={165}
                // data={data}
                data={balanceArr}
              >
                <CartesianGrid
                  // vertical={false}
                  verticalPoints={[5]}
                  // x={1}
                  // y={1}
                  stroke="#000"
                />
                {/* <CartesianAxis /> */}
                <XAxis dataKey="monthStr" tickLine={false} />
                <YAxis orientation="right" tickCount={2} tickLine={false} />
                <Bar dataKey="amount" fill="#116ACC" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Link>
      </div>
      <Link to={'/balance/' + account}>
        <Paper
          elevation={7}
          sx={{
            // display: 'flex',
            padding: '25px 50px',
            // width: '99%',
            // flexBasis: 720,
            borderRadius: 9,
            backgroundColor: '#F3F4F6',
          }}
        >
          <h2>История переводов</h2>
          {/* <div>{accData.transactions[0].date.split('-')[1]}</div> */}
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th + ' ' + styles.brLeft}>
                  Счет отправителя
                </th>
                <th className={styles.th}>Счет получателя</th>
                <th className={styles.th}>Сумма</th>
                <th className={styles.th + ' ' + styles.brRight}>Дата</th>
              </tr>
            </thead>
            <tbody>
              {lastTrans.map((trans) => {
                if (trans.from === accData.account) {
                  return (
                    <tr className={styles.tr}>
                      <td>{trans.from}</td>
                      <td>{trans.to}</td>
                      <td className={styles.colorRed}>- {trans.amount} ₽</td>
                      <td>
                        {trans.date.slice(0, 10).split('-').reverse().join('.')}
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr className={styles.tr}>
                      <td>{trans.from}</td>
                      <td>{trans.to}</td>
                      <td className={styles.colorGreen}>+ {trans.amount} ₽</td>
                      <td>
                        {trans.date.slice(0, 10).split('-').reverse().join('.')}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </Paper>
      </Link>
    </>
  );
}
