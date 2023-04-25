import React from 'react';
import styles from './homepage.module.css';
import { Navigate } from 'react-router-dom';

export function HomePage() {
  const token = sessionStorage.getItem('auth');

  return (
    <>
      {!token && <Navigate to="login" />}
      <div>HomePage</div>
    </>
  );
}
