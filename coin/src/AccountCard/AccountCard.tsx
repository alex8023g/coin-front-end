import React from 'react';
import styles from './accountcard.module.css';
import { Button, Paper } from '@mui/material';
import { IAccount } from '../HomePage';

export function AccountCard({ account }: { account: IAccount }) {
  const LastTransDate = account.transactions[0]?.date
    .split('T')[0]
    .split('-')
    .reverse()
    .join('.');
  return (
    <Paper
      sx={{
        width: 380,
        // height: 150,

        mb: 7,
        p: 2.2,
        borderRadius: 3,
      }}
      elevation={9}
    >
      <div className={styles.accountNumber}>{account.account}</div>
      <div className={styles.accountBalance}>{account.balance + ' ₽'}</div>
      <div className={styles.bottomWrap}>
        <div>
          <div>Последняя транзакция</div>
          <div>{LastTransDate}</div>
        </div>
        <Button variant="contained">Открыть</Button>
      </div>
    </Paper>
  );
}
