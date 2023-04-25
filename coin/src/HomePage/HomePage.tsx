import React, { useEffect, useState } from 'react';
import styles from './homepage.module.css';
import { Navigate } from 'react-router-dom';
import { produce } from 'immer';
import { Box, Button, Paper } from '@mui/material';
import { AccountCard } from '../AccountCard';

export interface IAccount {
  account: string;
  balance: number;
  main: boolean;
  transactions: ITransaction[];
}

interface ITransaction {
  amount: number;
  date: string;
  from: string;
  to: string;
}
export function HomePage() {
  const [accounts, setAccounts] = useState<IAccount[]>();
  const token = sessionStorage.getItem('auth');

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + '/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setAccounts(res.payload);
      });
  }, [token]);

  function createAccount() {
    fetch(process.env.REACT_APP_API_SERVER + '/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
      // body: JSON.stringify({ login, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.payload)
          setAccounts(
            produce((draft) => {
              draft?.push(res.payload);
            })
          );
      });
  }

  return (
    <>
      {!token && <Navigate to="login" />}
      <div>Ваши счета</div>
      <button onClick={createAccount}>Создать счет</button>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {accounts &&
          accounts.map((account) => {
            return <AccountCard account={account} />;
          })}
      </Box>
    </>
  );
}
