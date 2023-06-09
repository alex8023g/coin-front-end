interface IExchange2 {
  from: string;
  to: string;
  amount: string;
}

export async function currencyBuy(exchange: IExchange2) {
  const token = sessionStorage.getItem('auth');

  const res = await fetch(process.env.REACT_APP_API_SERVER + '/currency-buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify(exchange),
  });
  return await res.json();
}
