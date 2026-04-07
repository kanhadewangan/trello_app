export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export const fetchWithFallback = async <T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`⚠️ [API] Fetch failed for ${endpoint}. Using fallback data.`);
    if (fallbackData !== undefined) return fallbackData;
    throw error;
  }
};

const requestJson = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(errorBody || `API Error: ${response.status}`);
  }

  return response.json();
};

export const api = {
  users: {
    create: (payload: { name: string; email: string; password: string }) =>
      requestJson('/users/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getByEmail: (email: string) => requestJson(`/users/${encodeURIComponent(email)}`),
    forgetPassword: (email: string, newPassword: string) =>
      requestJson(`/users/forget-password/${encodeURIComponent(email)}`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword }),
      }),
    changeName: (id: string, newName: string) =>
      requestJson(`/users/change-name/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify({ newName }),
      }),
  },
  boards: {
    create: (payload: { title: string; description?: string }) =>
      requestJson('/boards', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getById: (boardId: string) => requestJson(`/boards/${encodeURIComponent(boardId)}`),
    remove: (boardId: string) =>
      requestJson(`/boards/${encodeURIComponent(boardId)}`, {
        method: 'DELETE',
      }),
    getAll: () => requestJson('/boards'),
  },
  cards: {
    create: (listId: string, payload: { title: string; description?: string }) =>
      requestJson(`/cards/${encodeURIComponent(listId)}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getByListId: (listId: string) => requestJson(`/cards/${encodeURIComponent(listId)}`),
    update: (cardId: string, payload: { newTitle: string; newDescription: string }) =>
      requestJson(`/cards/${encodeURIComponent(cardId)}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
  },
  testData: {
    preview: () => requestJson('/test-data/preview'),
    seed: () => requestJson('/test-data/seed', { method: 'POST' }),
  },
};
