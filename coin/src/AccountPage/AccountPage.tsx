import React, { useEffect, useState } from 'react';
import styles from './accountpage.module.css';
import { Link, useParams } from 'react-router-dom';
import { Button, Paper, TextField } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { IAccount, ITransaction } from '../HomePage';
import {
  Bar,
  BarChart,
  CartesianAxis,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { useAccountData } from '../hooks/useAccountData';
import { BalanceChart1 } from '../BalanceChart1';
import { BalanceTable } from '../BalanceTable';
import { produce } from 'immer';
import { Message } from '../Message';

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
  const token = sessionStorage.getItem('auth');

  const [accData, balanceArr, lastTrans] = useAccountData(6) as [
    IAccount,
    IBalance[],
    ITransaction[]
  ];
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
    console.log(transferFunds);
    if (!transferFunds.amount || !transferFunds.from || !transferFunds.to) {
      return;
    }
    fetch(process.env.REACT_APP_API_SERVER + '/transfer-funds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify(transferFunds),
    })
      .then((res) => res.json())
      .then(({ payload, error }) => {
        console.log(payload, error);
        setIsMsgOpen(true);
        if (payload) {
          console.log(payload);
          setTypeMsg('success');
          setTextMsg('Перевод успешно выполнен');
        } else {
          setTypeMsg('error');
          setTextMsg(error);
        }
      });
  }

  return (
    <>
      <div className={styles.firstLineContainer}>
        <div>
          <h1 className={styles.title}>Просмотр счета</h1>
          <p>№ {accData.account}</p>
        </div>
        <div>
          <Link to={'/'}>
            <Button
              variant="contained"
              // onClick={createAccount}
              sx={{ p: '14px 24px 14px 18px', borderRadius: 2 }}
            >
              <KeyboardBackspaceIcon sx={{ mr: 1 }} />
              вернуться назад
            </Button>
          </Link>
          <p>
            <span className={styles.spanBalance}>Баланс</span>
            <span style={{ float: 'right' }}>{accData.balance} ₽</span>
          </p>
        </div>
      </div>
      <div className={styles.secondLineContainer}>
        <Paper
          elevation={7}
          sx={{
            padding: '25px 50px',
            // flexBasis: 500,
            borderRadius: 9,
            backgroundColor: '#F3F4F6',
          }}
        >
          <h2>Новый перевод</h2>
          <div className={styles.newRemittanceCont}>
            <div className={styles.textFieldCont}>
              <TextField
                id="outlined-basic2"
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
        {/* <Link to={'/balance/' + account}> */}
        <Paper
          onClick={() => {
            window.location.replace(`/balance/${account}`);
          }}
          // onCkick={() => {}}
          elevation={7}
          sx={{
            padding: '25px 50px',
            // width: '720px',
            flexBasis: '720px',
            borderRadius: 9,
            cursor: 'pointer',
          }}
        >
          <h2>Динамика баланса</h2>
          <BalanceChart1 balanceArr={balanceArr} tickCount={3} />
        </Paper>
        {/* </Link> */}
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
          <h2>История переводов</h2>
          {/* <div>{accData.transactions[0].date.split('-')[1]}</div> */}
          <BalanceTable accData={accData} lastTrans={lastTrans.slice(-10)} />
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
