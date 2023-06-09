export async function loginApi(login: string, password: string) {
  const res = await fetch(process.env.REACT_APP_API_SERVER + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ login, password }),
  });

  return await res.json();
}
