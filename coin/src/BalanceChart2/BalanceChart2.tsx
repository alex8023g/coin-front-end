import React from 'react';
import styles from './balancechart2.module.css';
import Paper from '@mui/material/Paper';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { IBalance } from '../AccountPage';
import { IBalance2 } from '../hooks/useAccountData';

export function BalanceChart2({ balanceArr }: { balanceArr: IBalance2[] }) {
  return (
    <ResponsiveContainer width={'99%'} height={165}>
      <BarChart
        // width={600}
        // height={165}
        // data={data}
        data={balanceArr}
        margin={{ right: 60 }}
      >
        <CartesianGrid
          // vertical={false}
          verticalPoints={[0]}
          horizontalPoints={[0]}
          // x={1}
          // y={1}
          stroke="#000"
        />
        {/* <CartesianAxis /> */}
        <XAxis dataKey="monthStr" tickLine={false} />
        <YAxis
          orientation="right"
          // tickCount={3}
          tickLine={false}
          unit={'₽'}
          tick={{ fontSize: 16 }}
          // domain={[10000, 1500000, 12000000]}
          ticks={[1000000, 7000000, 12000000]}
        />
        <Tooltip />
        <Bar dataKey="dec" stackId="a" fill="#FD4E5D" />
        <Bar dataKey="inc" stackId="a" fill="#76CA66" />
      </BarChart>
    </ResponsiveContainer>
  );
}
