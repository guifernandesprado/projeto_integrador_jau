window.API_BASE = 'http://localhost:3000/api';

async function apiGet(path) {
  const response = await fetch(`${window.API_BASE}${path}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || 'Falha na requisição');
  return data;
}

async function apiSend(path, method, payload) {
  const response = await fetch(`${window.API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || data.detalhe || 'Falha na requisição');
  return data;
}
