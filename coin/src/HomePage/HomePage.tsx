import React, { useEffect } from 'react';
import styles from './homepage.module.css';
import { Navigate } from 'react-router-dom';

export function HomePage() {
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
      .then((res) => console.log(res));
  }, [token]);

  return (
    <>
      {!token && <Navigate to="login" />}
      <div>HomePage</div>
    </>
  );
}
