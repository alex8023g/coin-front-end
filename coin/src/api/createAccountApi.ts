export async function createAccountApi() {
  const token = sessionStorage.getItem('auth');

  const res = await fetch(
    process.env.REACT_APP_API_SERVER + '/create-account',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
    }
  );
  return await res.json();
}
