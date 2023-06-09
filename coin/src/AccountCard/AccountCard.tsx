import React from 'react';
import styles from './accountcard.module.css';
import { Button, Paper } from '@mui/material';
import { IAccount } from '../HomePage';
import { Link } from 'react-router-dom';

export function AccountCard({ accountData }: { accountData: IAccount }) {
  const LastTransDate =
    accountData.transactions[0]?.date
      .split('T')[0]
      .split('-')
      .reverse()
      .join('.') || '-';
  return (
    <Paper
      className="accCard"
      sx={{
        // width: 380,
        maxWidth: 480,
        // mb: 7,
        p: 2.2,
        borderRadius: 3,
      }}
      elevation={9}
    >
      <div className={styles.accountNumber + ' accNumber'}>
        {accountData.account}
      </div>
      <div className={styles.accountBalance + ' accBalance'}>
        {accountData.balance.toLocaleString() + ' ₽'}
      </div>
      <div className={styles.bottomWrap}>
        <div className={styles.lastTransCont}>
          <div className={styles.lastTransText}>Последняя транзакция</div>
          <div className={styles.lastTransDate}>{LastTransDate}</div>
        </div>
        <Link to={'account/' + accountData.account}>
          <Button variant="contained" sx={{ height: 52, borderRadius: 2 }}>
            Открыть
          </Button>
        </Link>
      </div>
    </Paper>
  );
}
