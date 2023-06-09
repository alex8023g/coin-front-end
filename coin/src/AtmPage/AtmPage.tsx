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
    // fetch(process.env.REACT_APP_API_SERVER + '/banks', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8',
    //     Authorization: `Basic ${token}`,
    //   },
    // })
    //   .then((res) => res.json())
    getBanks().then(({ payload }: { payload: IPayloadItem[] }) => {
      // const { payload }: { payload: IPayloadItem[] } = res;
      // const coordArr = payload.map((item) => Object.values(item));
      setCoordArr(payload.map((item) => Object.values(item)));
      // console.log(res, coordArr);
    });
  }, [token]);
  return (
    <>
      {!token && <Navigate to="/login" />}
      <h1>Карта банкоматов</h1>
      <YMaps query={{ lang: 'en_RU' }}>
        {/* <div> */}
        <Map
          defaultState={{ center: [55.75, 37.57], zoom: 10 }}
          width={1440}
          height={700}
        >
          <TrafficControl
          // options={{ float: 'right' }}
          />
          <TypeSelector
          // options={{ float: 'right' }}
          />
          <Placemark defaultGeometry={[55.75, 37.57]} />
          {coordArr.map((item) => (
            <Placemark defaultGeometry={item} />
          ))}
        </Map>
        {/* </div> */}
      </YMaps>
    </>
  );
}
