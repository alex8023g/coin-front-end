import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './accountpage.module.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, Button, Paper, Stack, TextField } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { IAccount, ITransaction } from '../HomePage';
import { IBalance2, useAccountData } from '../hooks/useAccountData';
import { BalanceChart1 } from '../BalanceChart1';
import { BalanceTable } from '../BalanceTable';
import { produce } from 'immer';
import { Message } from '../Message';
import { transferFundsApi } from '../api/transferFundsApi';

export interface IBalance {
  amount: number;
  monthStr: string;
  monthNum: number;
}

interface ITransfer {
  from: string;
  to: string;
  amount: string;
}

export type typeMsg = 'success' | 'error';

export function AccountPage() {
  const navigate = useNavigate();
  console.log('AccountPage()');
  const token = useMemo(() => {
    return sessionStorage.getItem('auth');
  }, []);

  const toAccArr = useMemo(() => {
    if (localStorage.getItem('coinToAccArr')) {
      return JSON.parse(localStorage.getItem('coinToAccArr')!);
    } else return [];
  }, []);

  const toAccArrRef = useRef<string[]>(toAccArr);
  console.log(toAccArrRef.current);

  const wasNewTransRef = useRef(1);

  const [accData, balanceArr, lastTrans] = useAccountData(
    6,
    wasNewTransRef.current
  ) as [IAccount, IBalance2[], ITransaction[]];
  const { account } = useParams();
  const [transferFunds, setTransferFunds] = useState<ITransfer>({
    from: account ?? '',
    to: '',
    amount: '',
  });
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [textMsg, setTextMsg] = useState('');
  const [typeMsg, setTypeMsg] = useState<typeMsg>('success');
  const [isInvalid, setIsInvalid] = useState(false);

  function handleTransfer() {
    if (!transferFunds.amount || !transferFunds.from || !transferFunds.to) {
      console.log(
        'return from handleTransfer',
        transferFunds.amount,
        transferFunds.from,
        transferFunds.to
      );
      return;
    }

    transferFundsApi(transferFunds).then(({ payload, error }) => {
      console.log(payload, error);
      setIsMsgOpen(true);
      if (payload) {
        console.log(payload);
        setTypeMsg('success');
        setTextMsg('Перевод успешно выполнен');
        setTransferFunds({ ...transferFunds, to: '', amount: '' });
        if (!toAccArrRef.current.includes(transferFunds.to)) {
          toAccArrRef.current.push(transferFunds.to);
          localStorage.setItem(
            'coinToAccArr',
            JSON.stringify(toAccArrRef.current)
          );
        }
        ++wasNewTransRef.current;
      } else {
        setTypeMsg('error');
        setTextMsg(error);
      }
    });
  }

  const autocompleteList = ['1', '2', '3', '4'];

  return (
    <>
      <div className={styles.firstLineContainer}>
        <div>
          <h1 className={styles.h1}>Просмотр счета</h1>
          <p>№ {accData.account}</p>
        </div>
        <div>
          <Link to={'/'}>
            <Button
              variant="contained"
              sx={{ p: '14px 24px 14px 18px', borderRadius: 2 }}
            >
              <KeyboardBackspaceIcon sx={{ mr: 1 }} />
              вернуться назад
            </Button>
          </Link>
          <p>
            <span className={styles.spanBalance}>Баланс</span>
            <span style={{ float: 'right' }}>
              {accData.balance.toLocaleString()} ₽
            </span>
          </p>
        </div>
      </div>
      <div className={styles.secondLineContainer}>
        <Paper
          elevation={7}
          sx={{
            padding: '25px 50px',
            borderRadius: 9,
            backgroundColor: '#F3F4F6',
          }}
        >
          <h2 className={styles.h2}>Новый перевод</h2>
          <div className={styles.newRemittanceCont}>
            <div className={styles.textFieldCont}>
              <Autocomplete
                freeSolo
                disablePortal
                id="combo-box-demo"
                options={toAccArrRef.current}
                sx={{ width: 300 }}
                value={transferFunds.to}
                onChange={(event: any, newValue: string | null) => {
                  setTransferFunds(
                    produce((draft) => {
                      draft.to = newValue || '';
                    })
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="outlined-basic3"
                    label="Номер счета получателя"
                    variant="outlined"
                    sx={{ marginBottom: '25px', width: 300 }}
                    value={transferFunds.to}
                    onChange={(e) => {
                      setTransferFunds(
                        produce((draft) => {
                          draft.to = e.target.value;
                        })
                      );
                    }}
                  />
                )}
              />

              <TextField
                error={isInvalid}
                helperText={isInvalid && 'Сумма указана некорректно'}
                id="outlined-basic2"
                label="Сумма перевода"
                variant="outlined"
                sx={{ width: 300 }}
                value={transferFunds.amount}
                onChange={(e) => {
                  setTransferFunds(
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
            <Button
              variant="contained"
              sx={{ padding: '14px 40px' }}
              onClick={handleTransfer}
            >
              <MailOutlineIcon sx={{ marginRight: '7px' }} />
              отправить
            </Button>
          </div>
        </Paper>

        <Paper
          onClick={() => {
            navigate(`/balance/${account}`);
          }}
          elevation={7}
          sx={{
            padding: '25px 50px',
            flexBasis: '720px',
            borderRadius: 9,
            cursor: 'pointer',
          }}
        >
          <h2 className={styles.h2}>Динамика баланса</h2>
          <BalanceChart1 balanceArr={balanceArr} tickCount={3} />
        </Paper>
      </div>
      <Link to={'/balance/' + account}>
        <Paper
          elevation={7}
          sx={{
            padding: '25px 50px',
            borderRadius: 9,
            backgroundColor: '#F3F4F6',
          }}
        >
          <h2 className={styles.h2}>История переводов</h2>
          <BalanceTable accData={accData} lastTrans={lastTrans.slice(0, 10)} />
        </Paper>
      </Link>
      <Message
        isMsgOpen={isMsgOpen}
        setIsMsgOpen={setIsMsgOpen}
        textMsg={textMsg}
        typeMsg={typeMsg}
      />
    </>
  );
}
