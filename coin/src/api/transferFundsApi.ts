interface ITransfer2 {
  from: string;
  to: string;
  amount: string;
}

export async function transferFundsApi(transferFunds: ITransfer2) {
  const token = sessionStorage.getItem('auth');
  const res = await fetch(
    process.env.REACT_APP_API_SERVER + '/transfer-funds',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify(transferFunds),
    }
  );

  return await res.json();
}
