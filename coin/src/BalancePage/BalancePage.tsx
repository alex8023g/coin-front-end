import React from 'react';
import styles from './balancepage.module.css';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export function BalancePage() {
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
            {/* <span style={{ float: 'right' }}>{accData.balance} ₽</span> */}
          </p>
        </div>
      </div>
    </>
  );
}
