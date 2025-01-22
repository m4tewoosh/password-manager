import { refreshToken } from 'api';

const apiUrl = 'http://localhost:8000';

type RequestConfig = {
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
};

const sendRequest = async ({ endpoint, method, body }: RequestConfig) => {
  const response = await fetch(`${apiUrl}/${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': body ? 'application/json' : 'plain/text',
    },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include',
  });

  if (!response.ok) {
    if (
      endpoint !== 'login' &&
      endpoint !== 'refreshToken' &&
      endpoint !== 'auth' &&
      response.status === 401
    ) {
      try {
        await refreshToken();
        return sendRequest({ endpoint, method, body });
      } catch (error) {
        console.error(error);
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
      }
    }

    const { error } = await response.json();
    throw error;
  }

  if (response.headers.get('content-type')?.includes('application/json')) {
    return await response.json();
  }
};

export default sendRequest;
