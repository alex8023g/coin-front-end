import React from 'react';
import styles from './balancechart1.module.css';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { IBalance2 } from '../hooks/useAccountData';

export function BalanceChart1({
  balanceArr,
  tickCount,
}: {
  balanceArr: IBalance2[];
  tickCount: number;
}) {
  const balanceArrMod = balanceArr.map((item) => ({
    ...item,
    balanceMonth: Math.round(item.balanceMonth * 100) / 100,
  }));
  let min = 1000_000_000_000;
  let max = 0;
  balanceArrMod.forEach(({ balanceMonth }) => {
    min = balanceMonth < min ? balanceMonth : min;
    max = balanceMonth > max ? balanceMonth : max;
  });
  console.log(String(max).length, min);
  return (
    <ResponsiveContainer width={'99%'} height={165}>
      <BarChart data={balanceArrMod} margin={{ right: String(max).length * 5 }}>
        <CartesianGrid
          verticalPoints={[0]}
          horizontalPoints={[0]}
          stroke="#000"
        />
        <XAxis dataKey="monthStr" tickLine={false} />
        <YAxis
          orientation="right"
          tickCount={tickCount}
          tickLine={false}
          unit={'₽'}
          tick={{ fontSize: 16 }}
          type="number"
          domain={['dataMin', 'dataMax']}
        />
        <Tooltip />
        <Bar dataKey="balanceMonth" fill="#116ACC" />
      </BarChart>
    </ResponsiveContainer>
  );
}
