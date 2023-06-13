import React from 'react';
import styles from './balancechart2.module.css';
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

export function BalanceChart2({ balanceArr }: { balanceArr: IBalance2[] }) {
  let min = 1000_000_000_000;
  let max = 0;
  let maxDiff = 0;
  let transMaxDiff = 0;
  balanceArr.forEach(({ inc, dec }) => {
    min = inc && inc < min ? inc : min;
    min = dec && dec < min ? dec : min;
    max = inc + dec > max ? inc + dec : max;
    let maxDiffMod =
      inc / dec > maxDiff
        ? inc / dec
        : dec / inc > maxDiff
        ? dec / inc
        : maxDiff;
    transMaxDiff = maxDiffMod > maxDiff ? inc + dec : transMaxDiff;
  });

  return (
    <ResponsiveContainer width={'99%'} height={165}>
      <BarChart data={balanceArr} margin={{ right: String(max).length * 3 }}>
        <CartesianGrid
          verticalPoints={[0]}
          horizontalPoints={[0]}
          stroke="#000"
        />
        <XAxis dataKey="monthStr" tickLine={false} />
        <YAxis
          orientation="right"
          tickLine={false}
          unit={'₽'}
          tick={{ fontSize: 16 }}
          ticks={[
            Math.round(min * 100) / 100,
            Math.round(transMaxDiff * 100) / 100,
            Math.round(max * 100) / 100,
          ]}
        />
        <Tooltip />
        <Bar dataKey="dec" stackId="a" fill="#FD4E5D" />
        <Bar dataKey="inc" stackId="a" fill="#76CA66" />
      </BarChart>
    </ResponsiveContainer>
  );
}
