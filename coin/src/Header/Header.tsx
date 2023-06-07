import React from 'react';
import styles from './header.module.css';
import { Layout } from '../Layout';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* <span className={styles.title}>Coin.</span> */}
        <Link className={styles.title} to="/">
          Coin.
        </Link>
        <div>
          <Link className={styles.navBtn} to="/atm">
            Банкоматы
          </Link>

          <Link className={styles.navBtn} to="/">
            Счета
          </Link>
          <Link className={styles.navBtn} to="/currency">
            Валюта
          </Link>
          <button
            className={styles.navBtn}
            onClick={() => {
              sessionStorage.removeItem('auth');
              window.location.replace('/login');
            }}
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
