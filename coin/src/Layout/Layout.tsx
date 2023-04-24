import React, { ReactNode } from 'react';
import styles from './layout.module.css';

export function Layout({ children }: { children: ReactNode }) {
  return <div className={styles.layout}>{children}</div>;
}
