import React, { useEffect, useState } from 'react';
import styles from './atmpage.module.css';
import {
  YMaps,
  Map,
  TrafficControl,
  TypeSelector,
  Placemark,
} from '@pbe/react-yandex-maps';
import { Navigate } from 'react-router-dom';
import { getBanks } from '../api/getBanks';

interface IPayloadItem {
  lat: number;
  log: number;
}

export function AtmPage() {
  const token = sessionStorage.getItem('auth');
  const [coordArr, setCoordArr] = useState<Array<number>[]>([[]]);

  useEffect(() => {
    getBanks().then(({ payload }: { payload: IPayloadItem[] }) => {
      setCoordArr(payload.map((item) => Object.values(item)));
    });
  }, [token]);
  return (
    <>
      {!token && <Navigate to="/login" />}
      <h1>Карта банкоматов</h1>
      <YMaps query={{ lang: 'en_RU' }}>
        <Map
          defaultState={{ center: [55.75, 37.57], zoom: 10 }}
          width={1440}
          height={700}
        >
          <TrafficControl />
          <TypeSelector />
          <Placemark defaultGeometry={[55.75, 37.57]} />
          {coordArr.map((item) => (
            <Placemark defaultGeometry={item} />
          ))}
        </Map>
      </YMaps>
    </>
  );
}
