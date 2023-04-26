import React from 'react';
import styles from './header.module.css';
import { Layout } from '../Layout';
import { Button, Link } from '@mui/material';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.title}>Coin.</span>
        <div>
          <button className={styles.navBtn}>Банкоматы</button>
          <button
            className={styles.navBtn}
            onClick={() => {
              window.location.replace('/');
            }}
          >
            Счета
          </button>
          <button
            className={styles.navBtn}
            onClick={() => {
              window.location.replace('/currency');
            }}
          >
            Валюта
          </button>
          <button className={styles.navBtn}>Выйти</button>
        </div>
      </div>
    </header>
  );
}
