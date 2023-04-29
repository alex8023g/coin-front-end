import React, { useEffect, useState } from 'react';
import styles from './currencypage.module.css';
import { Box, Paper, dividerClasses } from '@mui/material';
import { produce } from 'immer';
import { ReactComponent as ArrowUp } from '../assets/arrowup.svg';
import { ReactComponent as ArrowDown } from '../assets/arrowdown.svg';

interface ICurrency {
  amount: number;
  code: string;
}
interface ICurrencyFeed {
  type: string;
  from: string;
  to: string;
  rate: number;
  change: number;
}
export function CurrencyPage() {
  const token = sessionStorage.getItem('auth');
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [currencyFeed, setCurrencyFeed] = useState<ICurrencyFeed[]>([]);

  useEffect(() => {
    // if (!process.env.REACT_APP_API_WS) return;
    console.log('socket', process.env.REACT_APP_API_WS);
    let socket = new WebSocket(process.env.REACT_APP_API_WS + '/currency-feed');
    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      setCurrencyFeed(
        produce((draft) => {
          // console.log(`[message] Данные получены с сервера: ${e.data}`);
          const index = draft.findIndex(
            (item) => item.from === data.from && item.to === data.to
          );
          if (index > 0) {
            draft[index] = data;
          } else {
            draft.push(data);
          }
          if (draft.length > 15) {
            draft.shift();
          }
        })
      );
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
        );
      } else {
        // например, сервер убил процесс или сеть недоступна
        // обычно в этом случае event.code 1006
        console.log('[close] Соединение прервано');
      }
    };

    socket.onerror = function (error) {
      alert(`[error]`);
    };
  }, []);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + '/currencies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const { payload } = res;
        const currArr: ICurrency[] = Object.values(payload);
        setCurrencies(currArr);
        console.log(payload, currencies);
      });
  }, [token]);

  return (
    <>
      <h2>CurrencyPage</h2>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: 3,
        }}
      >
        <Paper elevation={7} sx={{ width: 588 }}>
          <ul>
            {currencies.map((currency) => (
              <li>
                {currency.code} ... {currency.amount}
              </li>
            ))}
          </ul>
        </Paper>
        <Paper elevation={7} sx={{ width: 703 }}>
          <ul>
            {currencyFeed?.map((curFeed) =>
              curFeed.change > 0 ? (
                <li
                  style={{
                    display: 'flex',
                  }}
                >
                  {curFeed.from}/{curFeed.to}
                  <span style={{ flexGrow: 1 }}>fff</span>
                  {curFeed.rate}
                  <ArrowUp />
                </li>
              ) : (
                <li>
                  {curFeed.from}/{curFeed.to}........{curFeed.rate}
                  <ArrowDown />
                </li>
              )
            )}
          </ul>
        </Paper>
      </Box>
    </>
  );
}
