// ========== Configuration ==========
const APP_ENV = import.meta.env.VITE_APP_ENV || 'DEV';
const USER_ID = Number(import.meta.env.VITE_USER_ID) || 12;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ========== Environnement / Construction d'URL ==========
function validateUserId(userId) {
  if (!userId || isNaN(Number(userId))) {
    return USER_ID;
  }
  return Number(userId);
}

function buildDevUrl(path) {
  const pathParts = String(path).split('/').filter(part => part !== '');
  const endpoint = pathParts[pathParts.length - 1];
  const userIdFromPath = pathParts[pathParts.length - 2];

  const userId = validateUserId(userIdFromPath);

  const isSpecialEndpoint =
    endpoint === 'activity' ||
    endpoint === 'average-sessions' ||
    endpoint === 'performance';

  if (isSpecialEndpoint) {
    return `/data/user-${userId}-${endpoint}.json`;
  }

  return `/data/user-${userId}.json`;
}

function buildUrl(path) {
  if (APP_ENV === 'PROD') {
    return `${API_URL}${path}`;
  }
  return buildDevUrl(path);
}

// ========== Fetch centralisé ==========
async function fetchJson(path, { signal } = {}) {
  if (!path || typeof path !== 'string') {
    throw new Error('fetchJson: path must be a non-empty string');
  }

  const url = buildUrl(path);
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} pour ${path}`);
  }

  const json = await response.json();
  return json.data;
}

// ========== Normalisation / Helpers données ==========
function normalizeSessions(sessions) {
  return Array.isArray(sessions) ? sessions : [];
}

function normalizeUser(raw) {
  const src = raw && raw.user ? raw.user : raw || {};

  const userInfos = src.userInfos || {};
  const keyData = src.keyData || {};

  const todayScore = typeof src.todayScore === 'number' ? src.todayScore : undefined;
  const score = typeof src.score === 'number' ? src.score : undefined;
  const finalScore = todayScore !== undefined ? todayScore : (score !== undefined ? score : 0);

  return {
    id: Number(src.id) || null,
    userInfos: {
      firstName: typeof userInfos.firstName === 'string' ? userInfos.firstName : '',
      lastName: typeof userInfos.lastName === 'string' ? userInfos.lastName : '',
      age: Number(userInfos.age) || 0,
    },
    keyData: {
      calorieCount: Number(keyData.calorieCount) || 0,
      proteinCount: Number(keyData.proteinCount) || 0,
      carbohydrateCount: Number(keyData.carbohydrateCount) || 0,
      lipidCount: Number(keyData.lipidCount) || 0,
    },
    score: finalScore,
    raw: src,
  };
}

function normalizeActivity(raw) {
  const data = raw || {};
  return {
    userId: data.userId || null,
    sessions: normalizeSessions(data.sessions).map(s => ({
      day: s.day !== undefined ? s.day : s.date || null,
      kilogram: Number(s.kilogram) || 0,
      calories: Number(s.calories) || 0,
      raw: s,
    })),
  };
}

function normalizeAverageSessions(raw) {
  const data = raw || {};
  return {
    userId: data.userId || null,
    sessions: normalizeSessions(data.sessions).map(s => ({
      day: s.day !== undefined ? s.day : null,
      sessionLength: Number(s.sessionLength ?? s.length) || 0,
      raw: s,
    })),
  };
}

function normalizePerformance(raw) {
  const data = raw || {};
  return {
    userId: data.userId || null,
    kind: data.kind || {},
    data: Array.isArray(data.data) ? data.data : [],
  };
}

// ========== Fonctions API publiques (fetch + normalisation) ==========
export async function getUser(userId, opts) {
  const validUserId = validateUserId(userId);
  const data = await fetchJson(`/user/${validUserId}`, opts);
  return normalizeUser(data);
}

export async function getUserActivity(userId, opts) {
  const validUserId = validateUserId(userId);
  const data = await fetchJson(`/user/${validUserId}/activity`, opts);
  return normalizeActivity(data);
}

export async function getUserAverageSessions(userId, opts) {
  const validUserId = validateUserId(userId);
  const data = await fetchJson(`/user/${validUserId}/average-sessions`, opts);
  return normalizeAverageSessions(data);
}

export async function getUserPerformance(userId, opts) {
  const validUserId = validateUserId(userId);
  const data = await fetchJson(`/user/${validUserId}/performance`, opts);
  return normalizePerformance(data);
}


// ========== Wrappers pour l'utilisateur courant ==========
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

// ========== Exports ==========
export { APP_ENV, USER_ID };