export async function getCurrencies() {
  const token = sessionStorage.getItem('auth');

  let res = await fetch(process.env.REACT_APP_API_SERVER + '/currencies', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Basic ${token}`,
    },
  });

  return await res.json();
}
