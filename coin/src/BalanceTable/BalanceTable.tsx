import React from 'react';
import styles from './balancetable.module.css';
import Paper from '@mui/material/Paper';
import { IAccount, ITransaction } from '../HomePage';

export function BalanceTable({
  accData,
  lastTrans,
}: {
  accData: IAccount;
  lastTrans: ITransaction[];
}) {
  return (
    <>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th + ' ' + styles.brLeft + ' ' + styles.pl}>
              Счет отправителя
            </th>
            <th className={styles.th}>Счет получателя</th>
            <th className={styles.th}>Сумма</th>
            <th className={styles.th + ' ' + styles.brRight}>Дата</th>
          </tr>
        </thead>
        <tbody>
          {lastTrans.map(
            // {lastTrans.slice(0, 100).map(
            (trans, i) => (
              // {
              // if (trans.from === accData.account) {
              // return
              <tr key={trans.date} className={styles.tr}>
                <td className={styles.pl}>{trans.from}</td>
                <td>{trans.to}</td>
                <td
                  className={
                    trans.from === accData.account
                      ? styles.colorRed
                      : styles.colorGreen
                  }
                >
                  {trans.from === accData.account ? '-' : ''}
                  {trans.amount.toLocaleString()} ₽
                </td>
                <td>
                  {trans.date.slice(0, 10).split('-').reverse().join('.')}
                </td>
              </tr>
            )
            // ;
            // } else {
            //   return (
            //     <tr className={styles.tr}>
            //       <td>{trans.from}</td>
            //       <td>{trans.to}</td>
            //       <td className={styles.colorGreen}>+ {trans.amount} ₽</td>
            //       <td>
            //         {trans.date.slice(0, 10).split('-').reverse().join('.')}
            //       </td>
            //     </tr>
            //   );
            // }
            // }
          )}
        </tbody>
      </table>
    </>
  );
}
