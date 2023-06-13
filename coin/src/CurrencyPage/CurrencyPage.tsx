import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './currencypage.module.css';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material';
import { produce } from 'immer';
import { ReactComponent as ArrowUp } from '../assets/arrowup.svg';
import { ReactComponent as ArrowDown } from '../assets/arrowdown.svg';
import { nanoid } from 'nanoid';
import { Navigate } from 'react-router-dom';
import { Message } from '../Message';
import { typeMsg } from '../AccountPage';
import { getCurrencies } from '../api/getCurrencies';
import { currencyBuy } from '../api/currencyBuy';

interface ICurrency {
  amount: number;
  code: string;
}
interface ICurrencyFeed {
  id: string;
  type: string;
  from: string;
  to: string;
  rate: number;
  change: number;
}

interface IExchange {
  from: string;
  to: string;
  amount: string;
}
export function CurrencyPage() {
  const token = sessionStorage.getItem('auth');
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [currencyFeed, setCurrencyFeed] = useState<ICurrencyFeed[]>([]);
  const [exchange, setExchange] = useState<IExchange>({
    from: '',
    to: '',
    amount: '',
  });
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [textMsg, setTextMsg] = useState('');
  const [typeMsg, setTypeMsg] = useState<typeMsg>('success');

  const [isInvalid, setIsInvalid] = useState(false);

  const updateCurrencies = useRef(0);

  useEffect(() => {
    let socket = new WebSocket(process.env.REACT_APP_API_WS + '/currency-feed');
    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      data.id = nanoid();
      setCurrencyFeed(
        produce((draft) => {
          const index = draft.findIndex(
            (item) => item.from === data.from && item.to === data.to
          );
          if (index > 0) {
            draft[index] = data;
          } else {
            draft.push(data);
          }
          if (draft.length > 21) {
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
        console.log('[close] Соединение прервано');
      }
    };

    socket.onerror = function (error) {
      alert(`[error]`);
    };
  }, []);

  useEffect(() => {
    getCurrencies().then(({ payload }) => {
      const currArr: ICurrency[] = Object.values(payload);
      setCurrencies(currArr);
      setExchange({ from: currArr[0].code, to: currArr[1].code, amount: '' });
      console.log(currArr, currencies);
    });
  }, [token, updateCurrencies.current]);

  function handleExchange() {
    console.log(exchange);
    if (isInvalid) return;

    currencyBuy(exchange).then(({ payload, error }) => {
      console.log(payload, error);
      setIsMsgOpen(true);
      if (payload) {
        console.log(payload);
        setTypeMsg('success');
        setTextMsg('Обмен успешно выполнен');
      } else {
        setTypeMsg('error');
        setTextMsg(error);
      }
      updateCurrencies.current++;
    });
  }

  return (
    <>
      {!token && <Navigate to="/login" />}
      <h1 className={styles.h1}>Валютный обмен</h1>
      <Box
        sx={{
          display: 'flex',
          flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' },
          justifyContent: { sm: 'center', md: 'space-between' },
          gap: 3,
        }}
      >
        <Box>
          <Paper
            elevation={7}
            sx={{ marginBottom: 4, padding: 5, borderRadius: 9 }}
          >
            <h2 className={styles.h2}>Ваши валюты</h2>
            <ul>
              {currencies.map((currency) => (
                <li key={nanoid()} className={styles.li}>
                  {currency.code}
                  <span className={styles.spanDotsBlack}></span>
                  {currency.amount.toLocaleString()}
                </li>
              ))}
            </ul>
          </Paper>

          <Paper
            elevation={7}
            sx={{ marginBottom: 0, width: 540, padding: 5, borderRadius: 9 }}
          >
            <h2 className={styles.h2}>Обмен валюты</h2>

            {currencies[0] && (
              <div className={styles.currChangeContainer}>
                <div className={styles.currChangeFormContainer}>
                  <div className={styles.currChangeFromTo}>
                    <span className={styles.spanCurrChange}> Из </span>
                    <FormControl sx={{ mr: 2, flexGrow: 1 }}>
                      <Select
                        labelId="select-label"
                        defaultValue={currencies[0].code}
                        onChange={(e) =>
                          setExchange(
                            produce((draft) => {
                              draft.from = e.target.value;
                            })
                          )
                        }
                      >
                        {currencies.map((curr) => (
                          <MenuItem value={curr.code} key={nanoid()}>
                            {curr.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <span className={styles.spanCurrChange}> в </span>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <Select
                        labelId="select-label"
                        defaultValue={currencies[1].code}
                        onChange={(e) =>
                          setExchange(
                            produce((draft) => {
                              draft.to = e.target.value;
                            })
                          )
                        }
                      >
                        {currencies.map((curr) => (
                          <MenuItem value={curr.code} key={nanoid()}>
                            {curr.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className={styles.currChangeSum}>
                    <span className={styles.spanCurrChange}> Сумма </span>
                    <TextField
                      error={isInvalid}
                      helperText={isInvalid && 'Сумма указана некорректно'}
                      id="outlined-controlled"
                      sx={{ flexGrow: 1 }}
                      value={exchange.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setExchange(
                          produce((draft) => {
                            draft.amount = e.target.value;
                          })
                        );
                        if (!e.target.value) {
                          setIsInvalid(false);
                        } else if (
                          !Number(e.target.value) ||
                          Number(e.target.value) < 0
                        ) {
                          setIsInvalid(true);
                        } else {
                          setIsInvalid(false);
                        }
                      }}
                    />
                  </div>
                </div>
                <Button variant="contained" onClick={handleExchange}>
                  Обменять
                </Button>
              </div>
            )}
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
          <h2 className={styles.h2}>Изменение курсов в реальном времени</h2>
          <ul>
            {currencyFeed?.map((curFeed) =>
              curFeed.change > 0 ? (
                <li className={styles.li} key={curFeed.id}>
                  {curFeed.from}/{curFeed.to}
                  <span className={styles.spanDotsGreen}></span>
                  {curFeed.rate}
                  <div className={styles.arrowDiv}>
                    <ArrowUp />
                  </div>
                </li>
              ) : (
                <li key={curFeed.id} className={styles.li}>
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
      <Message
        isMsgOpen={isMsgOpen}
        setIsMsgOpen={setIsMsgOpen}
        textMsg={textMsg}
        typeMsg={typeMsg}
      />
    </>
  );
}
