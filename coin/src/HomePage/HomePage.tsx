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
  Select,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AccountCard } from '../AccountCard';
import { getAccounts } from '../api/getAccounts';
import { createAccountApi } from '../api/createAccountApi';

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
  const [sortType, setSortType] = useState('');
  const token = sessionStorage.getItem('auth');

  useEffect(() => {
    // fetch(process.env.REACT_APP_API_SERVER + '/accounts', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8',
    //     Authorization: `Basic ${token}`,
    //   },
    // })
    //   .then((res) => res.json())
    getAccounts().then(({ payload }) => {
      setAccounts(payload);
    });
  }, [token]);

  function createAccount() {
    // fetch(process.env.REACT_APP_API_SERVER + '/create-account', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8',
    //     Authorization: `Basic ${token}`,
    //   },
    // })
    //   .then((res) => res.json())
    createAccountApi().then(({ payload, error }) => {
      if (payload)
        setAccounts(
          produce((draft) => {
            draft?.push(payload);
          })
        );
    });
  }

  function sortBy({ target: { value } }: SelectChangeEvent) {
    console.log(value);
    setSortType(value);
    setAccounts((accounts) => {
      const accountsMod = structuredClone(accounts);
      switch (value) {
        case 'account':
          return [...accountsMod]?.sort((a, b) =>
            a.account.localeCompare(b.account)
          );
        case 'balance':
          return [...accountsMod]?.sort((a, b) => b.balance - a.balance);
        case 'lastTransDate':
          return [...accountsMod]?.sort(
            (a, b) =>
              (new Date(b.transactions[0]?.date).getTime() || 0) -
              (new Date(a.transactions[0]?.date).getTime() || 0)
          );
      }
    });
  }

  return (
    <>
      {!token && <Navigate to="login" />}
      {token && (
        <div className={styles.firstLine}>
          <h1 className={styles.title}>Ваши счета</h1>
          <FormControl sx={{ width: 270 }}>
            <InputLabel id="select-label" size="small">
              Сортировка
            </InputLabel>
            <Select
              size="small"
              labelId="select-label"
              value={sortType}
              label="Сортировка"
              onChange={sortBy}
            >
              <MenuItem value={'account'}>По номеру</MenuItem>
              <MenuItem value={'balance'}>По балансу</MenuItem>
              <MenuItem value={'lastTransDate'}>
                По последней транзакции
              </MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={createAccount}
            sx={{
              p: '14px 24px 14px 18px',
              // float: 'right',
              ml: { xs: 0, sm: 'auto' },
              borderRadius: 2,
            }}
          >
            <AddIcon sx={{ mr: 1 }} /> создать новый счет
          </Button>
        </div>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))',
          gridColumnGap: '2vw',
          gridRowGap: '50px',
          justifyItems: 'normal',
          // flexWrap: 'wrap',
          // justifyContent: 'space-around',
        }}
      >
        {accounts &&
          accounts.map((accountData) => {
            return (
              <AccountCard
                accountData={accountData}
                key={accountData.account}
              />
            );
          })}
      </Box>
    </>
  );
}
