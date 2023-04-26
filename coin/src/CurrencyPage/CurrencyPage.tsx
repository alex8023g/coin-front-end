import React, { useEffect } from 'react';
import styles from './currencypage.module.css';

export function CurrencyPage() {
  useEffect(() => {
    // if (!process.env.REACT_APP_API_WS) return;
    console.log('socket', process.env.REACT_APP_API_WS);
    let socket = new WebSocket(process.env.REACT_APP_API_WS + '/currency-feed');
    socket.onmessage = function (e) {
      // console.log(`[message] Данные получены с сервера: ${e.data}`);
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
        );
      } else {
        // например, сервер убил процесс или сеть недоступна
        // обычно в этом случае event.code 1006
        console.log('[close] Соединение прервано');
      }
    };

    socket.onerror = function (error) {
      alert(`[error]`);
    };
  }, []);
  return <div>CurrencyPage</div>;
}
