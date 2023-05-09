import React from 'react';
import styles from './balancechart1.module.css';
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

export function BalanceChart1({ balanceArr }: { balanceArr: IBalance[] }) {
  return (
    <ResponsiveContainer width={'99%'} height={165}>
      <BarChart
        // width={600}
        // height={165}
        // data={data}
        data={balanceArr}
        margin={{ right: 30 }}
      >
        <CartesianGrid
          // vertical={false}
          verticalPoints={[0]}
          // x={1}
          // y={1}
          stroke="#000"
        />
        {/* <CartesianAxis /> */}
        <XAxis dataKey="monthStr" tickLine={false} />
        <YAxis
          orientation="right"
          tickCount={2}
          tickLine={false}
          unit={'₽'}
          tick={{ fontSize: 16 }}
        />
        <Tooltip />
        <Bar dataKey="balance" fill="#116ACC" />
      </BarChart>
    </ResponsiveContainer>
  );
}
