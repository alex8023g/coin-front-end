export async function getAccountData(account: string) {
  const token = sessionStorage.getItem('auth');

  const res = await fetch(
    process.env.REACT_APP_API_SERVER + '/account/' + account,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
    }
  );

  return await res.json();
}
