import React, { useEffect, useState } from 'react';
import styles from './homepage.module.css';
import { Navigate } from 'react-router-dom';
import { produce } from 'immer';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AccountCard } from '../AccountCard';

export interface IAccount {
  account: string;
  balance: number;
  mine: boolean;
  transactions: ITransaction[];
}

export interface ITransaction {
  amount: number;
  date: string;
  from: string;
  to: string;
}
export function HomePage() {
  const [accounts, setAccounts] = useState<IAccount[]>();
  const [sortType, setSortType] = useState<string>('');
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
      {token && (
        <div className={styles.firstLine}>
          <h1 className={styles.title}>Ваши счета</h1>
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="select-label">Сортировка</InputLabel>
            <Select
              labelId="select-label"
              // id="select-label"
              value={sortType}
              label="Сортировка"
              onChange={(e) => setSortType(e.target.value)}
            >
              <MenuItem value={'byNumber'}>По номеру</MenuItem>
              <MenuItem value={'byBalance'}>По балансу</MenuItem>
              <MenuItem value={'byLastTransDate'}>
                По последней транзакции
              </MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={createAccount}
            sx={{ p: '14px 24px 14px 18px', float: 'right', borderRadius: 2 }}
          >
            <AddIcon sx={{ mr: 1 }} /> cоздать новый счет
          </Button>
        </div>
      )}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: 3,
        }}
      >
        {accounts &&
          accounts.map((accountData) => {
            return <AccountCard accountData={accountData} />;
          })}
      </Box>
    </>
  );
}
