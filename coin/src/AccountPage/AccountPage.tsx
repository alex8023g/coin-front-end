import React, { useEffect, useState } from 'react';
import styles from './accountpage.module.css';
import { Link, useParams } from 'react-router-dom';
import { Button, Paper, TextField } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { IAccount } from '../HomePage';
import {
  Bar,
  BarChart,
  CartesianAxis,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

export function AccountPage() {
  const [accData, setAccData] = useState<IAccount>({
    account: '',
    balance: 0,
    main: true,
    transactions: [{ amount: 0, date: '', from: '', to: '' }],
  });
  const { account } = useParams();
  // console.log(window.location.href.split('/').at(-1));

  const token = sessionStorage.getItem('auth');
  const monthName = {
    '01': 'янв',
    '02': 'фев',
    '03': 'мар',
    '04': 'апр',
    '05': 'май',
    '06': 'июн',
    '07': 'июл',
    '08': 'авг',
    '09': 'сен',
    '10': 'окт',
    '11': 'ноя',
    '12': 'дек',
  };
  console.log(monthName);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + '/account/' + account, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.payload);
        setAccData(res.payload);
      });
  }, [token]);

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
  ];

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
              data={data}
            >
              <CartesianGrid
                // vertical={false}
                verticalPoints={[5]}
                // x={1}
                // y={1}
                stroke="#000"
              />
              {/* <CartesianAxis /> */}
              <XAxis dataKey="name" tickLine={false} />
              <YAxis orientation="right" tickCount={2} tickLine={false} />
              <Bar dataKey="uv" fill="#116ACC" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </div>
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
        <div>{accData.transactions[0].date.split('-')[1]}</div>
      </Paper>
    </>
  );
}
