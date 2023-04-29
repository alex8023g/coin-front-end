import React, { useEffect, useState } from 'react';
import styles from './currencypage.module.css';
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  dividerClasses,
} from '@mui/material';
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
      <h1>Валютный обмен</h1>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: 3,
        }}
      >
        <Box>
          <Paper
            elevation={7}
            sx={{ width: 540, marginBottom: 4, padding: 5, borderRadius: 9 }}
          >
            <h2>Ваши валюты</h2>
            <ul>
              {currencies.map((currency) => (
                <li>
                  {currency.code}
                  <span className={styles.spanDotsBlack}></span>
                  {currency.amount}
                </li>
              ))}
            </ul>
          </Paper>
          <Paper elevation={7} sx={{ width: 540, padding: 5, borderRadius: 9 }}>
            <h2>Обмен валюты</h2>
            <Box>
              Из
              <FormControl sx={{ width: 134 }}>
                {/* <InputLabel id="select-label">Сортировка</InputLabel> */}
                <Select
                  labelId="select-label"
                  defaultValue={'byNumber'}
                  // id="select-label"
                  // value={sortType}
                  // label="Сортировка"
                  // onChange={(e) => setSortType(e.target.value)}
                >
                  <MenuItem value={'byNumber'} selected={true}>
                    По номеру
                  </MenuItem>
                  <MenuItem value={'byBalance'}>По балансу</MenuItem>
                  <MenuItem value={'byLastTransDate'}>
                    По последней транзакции
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Box>
        <Paper
          elevation={7}
          sx={{
            width: 703,
            padding: 5,
            borderRadius: 9,
            backgroundColor: '#E5E5E5',
          }}
        >
          <h2>Изменение курсов в реальном времени</h2>
          <ul>
            {currencyFeed?.map((curFeed) =>
              curFeed.change > 0 ? (
                <li>
                  {curFeed.from}/{curFeed.to}
                  <span className={styles.spanDotsGreen}></span>
                  {curFeed.rate}
                  <div className={styles.arrowDiv}>
                    <ArrowUp />
                  </div>
                </li>
              ) : (
                <li className={styles.liCurFlow}>
                  {curFeed.from}/{curFeed.to}
                  <span className={styles.spanDotsRed}></span>
                  {curFeed.rate}
                  <div className={styles.arrowDiv}>
                    <ArrowDown />
                  </div>
                </li>
              )
            )}
          </ul>
        </Paper>
      </Box>
    </>
  );
}
