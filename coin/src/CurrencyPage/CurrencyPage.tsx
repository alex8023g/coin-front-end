import React, { useEffect, useRef, useState } from 'react';
import styles from './currencypage.module.css';
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  dividerClasses,
} from '@mui/material';
import { produce } from 'immer';
import { ReactComponent as ArrowUp } from '../assets/arrowup.svg';
import { ReactComponent as ArrowDown } from '../assets/arrowdown.svg';
import { nanoid } from 'nanoid';
import { Navigate } from 'react-router-dom';
import { Message } from '../Message';
import { typeMsg } from '../AccountPage';

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

interface IExchange {
  from: string;
  to: string;
  amount: string;
}
export function CurrencyPage() {
  const token = sessionStorage.getItem('auth');
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [currencyFeed, setCurrencyFeed] = useState<ICurrencyFeed[]>([]);
  // const [sum, setSum] = useState('0');
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
          if (draft.length > 22) {
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
        setExchange({ from: currArr[0].code, to: currArr[1].code, amount: '' });
        console.log(currArr, currencies);
      });
  }, [token, updateCurrencies.current]);

  function handleExchange() {
    console.log(exchange);
    if (isInvalid) return;
    fetch(process.env.REACT_APP_API_SERVER + '/currency-buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify(exchange),
    })
      .then((res) => res.json())
      .then(({ payload, error }) => {
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
            sx={{ marginBottom: 4, padding: 5, borderRadius: 9 }}
          >
            <h2>Ваши валюты</h2>
            <ul>
              {currencies.map((currency) => (
                <li key={nanoid()}>
                  {currency.code}
                  <span className={styles.spanDotsBlack}></span>
                  {currency.amount}
                </li>
              ))}
            </ul>
          </Paper>

          <Paper
            elevation={7}
            sx={{ marginBottom: 4, width: 540, padding: 5, borderRadius: 9 }}
          >
            <h2>Обмен валюты</h2>

            {currencies[0] && (
              <div className={styles.currChangeContainer}>
                <div className={styles.currChangeFormContainer}>
                  <div className={styles.currChangeFromTo}>
                    <span className={styles.spanCurrChange}> Из </span>
                    <FormControl sx={{ mr: 2, flexGrow: 1 }}>
                      {/* <InputLabel id="select-label">Сортировка</InputLabel> */}

                      <Select
                        labelId="select-label"
                        defaultValue={currencies[0].code}
                        // id="select-label"
                        // value={sortType}
                        // label="Сортировка"
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
                      {/* <InputLabel id="select-label">Сортировка</InputLabel> */}

                      <Select
                        labelId="select-label"
                        defaultValue={currencies[1].code}
                        // id="select-label"
                        // value={sortType}
                        // label="Сортировка"
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
                      // label="Controlled"
                      sx={{ flexGrow: 1 }}
                      value={exchange.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // if (!/[\d?\.?]/.test(e.target.value.slice(-1))) return;
                        // setSum(e.target.value);
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
          <h2>Изменение курсов в реальном времени</h2>
          <ul>
            {currencyFeed?.map((curFeed) =>
              curFeed.change > 0 ? (
                <li key={nanoid()}>
                  {curFeed.from}/{curFeed.to}
                  <span className={styles.spanDotsGreen}></span>
                  {curFeed.rate}
                  <div className={styles.arrowDiv}>
                    <ArrowUp />
                  </div>
                </li>
              ) : (
                <li key={nanoid()} className={styles.liCurFlow}>
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
