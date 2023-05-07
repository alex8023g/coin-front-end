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
import { useAccountData } from '../hooks/useAccountData';
import { BalanceChart1 } from '../BalanceChart1';

export interface IBalance {
  amount: number;
  monthStr: string;
  monthNum: number;
}

export function AccountPage() {
  const [accData, balanceArr, lastTrans] = useAccountData(6) as [
    IAccount,
    IBalance[],
    ITransaction[]
  ];

  const { account } = useParams();

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
            <BalanceChart1 balanceArr={balanceArr} />
            {/* <ResponsiveContainer width={'99%'} height={165}>
              <BarChart data={balanceArr}>
                <CartesianGrid verticalPoints={[5]} stroke="#000" />
                <XAxis dataKey="monthStr" tickLine={false} />
                <YAxis orientation="right" tickCount={2} tickLine={false} />
                <Bar dataKey="amount" fill="#116ACC" />
              </BarChart>
            </ResponsiveContainer> */}
          </Paper>
        </Link>
      </div>
      <Link to={'/balance/' + account}>
        <Paper
          elevation={7}
          sx={{
            padding: '25px 50px',
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
              {lastTrans.slice(0, 5).map((trans) => {
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
