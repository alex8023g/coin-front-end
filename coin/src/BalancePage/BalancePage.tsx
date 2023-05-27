import React, { useEffect, useLayoutEffect, useState } from 'react';
import styles from './balancepage.module.css';
import { Link, useParams } from 'react-router-dom';
import { Button, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAccountData } from '../hooks/useAccountData';
import { IAccount, ITransaction } from '../HomePage';
import { IBalance } from '../AccountPage';
import { BalanceChart1 } from '../BalanceChart1';
import { BalanceChart2 } from '../BalanceChart2';
import { ContactSupport } from '@mui/icons-material';
import { BalanceTable } from '../BalanceTable';

export function BalancePage() {
  const [accData, balanceArr, lastTrans] = useAccountData(12) as [
    IAccount,
    IBalance[],
    ITransaction[]
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [displayedTrans, setDisplayedTrans] = useState<ITransaction[]>([]);
  const { account } = useParams();

  useLayoutEffect(() => {
    setDisplayedTrans(lastTrans.slice(page, page + rowsPerPage));
  }, [lastTrans, page, rowsPerPage]);

  function handlePagChange(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) {
    setDisplayedTrans((st) =>
      st.slice(newPage * rowsPerPage, newPage + rowsPerPage)
    );
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className={styles.firstLineContainer}>
        <div>
          <h1 className={styles.title}>История баланса</h1>
          <p>№ {account}</p>
        </div>
        <div>
          <Link to={'/account/' + account}>
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
      <Paper
        elevation={7}
        sx={{
          padding: '25px 50px',
          // width: '720px',
          // flexBasis: 720,
          borderRadius: 9,
          marginBottom: 5,
        }}
      >
        <h2>Динамика баланса</h2>
        <BalanceChart1 balanceArr={balanceArr} tickCount={4} />
      </Paper>

      <Paper
        elevation={7}
        sx={{
          padding: '25px 50px',
          // width: '720px',
          // flexBasis: 720,
          borderRadius: 9,
          marginBottom: 5,
        }}
      >
        <h2>Соотношение входящих исходящих транзакций</h2>
        <BalanceChart2 balanceArr={balanceArr} />
      </Paper>

      <Paper
        elevation={7}
        sx={{
          padding: '25px 50px',
          borderRadius: 9,
          backgroundColor: '#F3F4F6',
        }}
      >
        <h2>История переводов</h2>
        <BalanceTable accData={accData} lastTrans={displayedTrans} />
        <TablePagination
          component="div"
          count={98}
          page={page}
          onPageChange={handlePagChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
