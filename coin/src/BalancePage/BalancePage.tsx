import React from 'react';
import styles from './balancepage.module.css';
import { Link, useParams } from 'react-router-dom';
import { Button, Paper } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAccountData } from '../hooks/useAccountData';
import { IAccount, ITransaction } from '../HomePage';
import { IBalance } from '../AccountPage';
import { BalanceChart1 } from '../BalanceChart1';
import { BalanceChart2 } from '../BalanceChart2';
import { ContactSupport } from '@mui/icons-material';
import { BalanceTable } from '../BalanceTable';

export function BalancePage() {
  const [accData, balanceArr, lastTrans] = useAccountData(12) as [
    IAccount,
    IBalance[],
    ITransaction[]
  ];
  const { account } = useParams();

  return (
    <>
      <div className={styles.firstLineContainer}>
        <div>
          <h1 className={styles.title}>История баланса</h1>
          <p>№ {account}</p>
        </div>
        <div>
          <Link to={'/account/' + account}>
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
      <Paper
        elevation={7}
        sx={{
          padding: '25px 50px',
          // width: '720px',
          // flexBasis: 720,
          borderRadius: 9,
          marginBottom: 5,
        }}
      >
        <h2>Динамика баланса</h2>
        <BalanceChart1 balanceArr={balanceArr} />
      </Paper>

      <Paper
        elevation={7}
        sx={{
          padding: '25px 50px',
          // width: '720px',
          // flexBasis: 720,
          borderRadius: 9,
          marginBottom: 5,
        }}
      >
        <h2>Соотношение входящих исходящих транзакций</h2>
        <BalanceChart2 balanceArr={balanceArr} />
      </Paper>

      <Paper
        elevation={7}
        sx={{
          padding: '25px 50px',
          borderRadius: 9,
          backgroundColor: '#F3F4F6',
        }}
      >
        <h2>История переводов</h2>
        <BalanceTable accData={accData} lastTrans={lastTrans} />
      </Paper>
    </>
  );
}
