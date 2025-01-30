import { refreshToken } from 'api';

const apiUrl = 'http://localhost:8000';

type RequestConfig = {
  endpoint: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: object;
  contentType?: string;
};

const bodyParser = (body: object) => {
  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
};

const sendRequest = async ({
  endpoint,
  method,
  body,
  contentType,
}: RequestConfig) => {
  const response = await fetch(`${apiUrl}/${endpoint}`, {
    method: method,
    headers: {
      ...(contentType && { 'Content-Type': contentType }),
    },
    body: body ? bodyParser(body) : null,
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

  const responseData = await response.json();

  if (responseData.redirectUrl) {
    window.location.href = responseData.redirectUrl;
    return;
  }

  return responseData;
};

export default sendRequest;
