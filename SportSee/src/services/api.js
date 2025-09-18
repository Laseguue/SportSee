// Variables d'environnement
const APP_ENV = import.meta.env.VITE_APP_ENV || 'DEV';
const USER_ID = Number(import.meta.env.VITE_USER_ID) || 12;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchJson(path, { signal } = {}) {
  let url;

  if (APP_ENV === 'PROD') {
    url = `${API_URL}${path}`;
  } else {
    const pathParts = path.split('/').filter(part => part !== '');
    const endpoint = pathParts[pathParts.length - 1];
    let userId = pathParts[pathParts.length - 2];

    if (!userId || userId === 'user' || userId === undefined || userId === null) {
      userId = USER_ID;
    } else {
      const parsedId = parseInt(userId, 10);
      userId = isNaN(parsedId) ? USER_ID : parsedId;
    }

    if (endpoint === 'activity' || endpoint === 'average-sessions' || endpoint === 'performance') {
      url = `/data/user-${userId}-${endpoint}.json`;
    } else {
      url = `/data/user-${userId}.json`;
    }
  }

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} on ${path}`);
  }
  const json = await res.json();
  return json.data;
}

export async function getUser(userId, opts) {
  const validUserId = userId && !isNaN(Number(userId)) ? Number(userId) : USER_ID;
  const data = await fetchJson(`/user/${validUserId}`, opts);
  return data;
}

export async function getUserActivity(userId, opts) {
  const validUserId = userId && !isNaN(Number(userId)) ? Number(userId) : USER_ID;
  const data = await fetchJson(`/user/${validUserId}/activity`, opts);
  return {
    userId: data.userId ?? validUserId,
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
  };
}

export async function getUserAverageSessions(userId, opts) {
  const validUserId = userId && !isNaN(Number(userId)) ? Number(userId) : USER_ID;
  const data = await fetchJson(`/user/${validUserId}/average-sessions`, opts);
  return {
    userId: data.userId ?? validUserId,
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
  };
}

export async function getUserPerformance(userId, opts) {
  const validUserId = userId && !isNaN(Number(userId)) ? Number(userId) : USER_ID;
  const data = await fetchJson(`/user/${validUserId}/performance`, opts);
  return {
    userId: data.userId ?? validUserId,
    kind: data.kind ?? {},
    data: Array.isArray(data.data) ? data.data : [],
  };
}

export async function getCurrentUser(opts) {
  return await getUser(USER_ID, opts);
}

export async function getCurrentUserActivity(opts) {
  return await getUserActivity(USER_ID, opts);
}

export async function getCurrentUserAverageSessions(opts) {
  return await getUserAverageSessions(USER_ID, opts);
}

export async function getCurrentUserPerformance(opts) {
  return await getUserPerformance(USER_ID, opts);
}

export { APP_ENV, USER_ID };
