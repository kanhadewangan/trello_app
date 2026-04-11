export const API_BASE_URL = 'http://10.210.128.39:3000';

type AuthToken = string | null | undefined;

export interface LoginResponse {
  token: string;
}

export interface ApiMessageResponse {
  message: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SeedOptions {
  usersCount?: number;
  boardsPerUser?: number;
  listsPerBoard?: number;
  cardsPerList?: number;
}

const withAuthHeaders = (headers: HeadersInit | undefined, token?: AuthToken): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(headers || {}),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const fetchWithFallback = async <T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: withAuthHeaders(options?.headers),
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

const requestJson = async <T>(endpoint: string, options?: RequestInit, token?: AuthToken): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: withAuthHeaders(options?.headers, token),
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
    login: (payload: { email: string; password: string }) =>
      requestJson<LoginResponse>('/users/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getByEmail: (email: string) => requestJson<UserResponse>(`/users/${encodeURIComponent(email)}`),
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
    create: (payload: { title: string; description?: string }, token?: AuthToken) =>
      requestJson('/boards/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token),
    getById: (boardId: string, token?: AuthToken) => requestJson(`/boards/${encodeURIComponent(boardId)}`, undefined, token),
    remove: (boardId: string, token?: AuthToken) =>
      requestJson(`/boards/${encodeURIComponent(boardId)}`, {
        method: 'DELETE',
      }, token),
    getAll: (token?: AuthToken) => requestJson('/boards', undefined, token),
  },
  lists: {
    create: (payload: { boardId: string; title: string }, token?: AuthToken) =>
      requestJson('/lists/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token),
    getAll: (token?: AuthToken) => requestJson('/lists/getall', undefined, token),
    getMany: (token?: AuthToken) => requestJson('/lists/get', undefined, token),
    getById: (listId: string, token?: AuthToken) => requestJson(`/lists/get/${encodeURIComponent(listId)}`, undefined, token),
    getByBoardId: (boardId: string, token?: AuthToken) => requestJson(`/lists/getbyboard/${encodeURIComponent(boardId)}`, undefined, token),
    remove: (listId: string, token?: AuthToken) =>
      requestJson(`/lists/delete/${encodeURIComponent(listId)}`, {
        method: 'DELETE',
      }, token),
  },
  cards: {
    create: (listId: string, payload: { title: string; description?: string }, token?: AuthToken) =>
      requestJson(`/cards/${encodeURIComponent(listId)}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }, token),
    getByListId: (listId: string, token?: AuthToken) => requestJson(`/cards/${encodeURIComponent(listId)}`, undefined, token),
    update: (cardId: string, payload: { newTitle: string; newDescription: string }, token?: AuthToken) =>
      requestJson(`/cards/${encodeURIComponent(cardId)}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }, token),
  },
  testData: {
    preview: (options?: SeedOptions) => {
      const query = options
        ? new URLSearchParams(
          Object.entries(options)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
        : '';

      const endpoint = query ? `/test-data/preview?${query}` : '/test-data/preview';
      return requestJson(endpoint);
    },
    seed: (options?: SeedOptions) =>
      requestJson('/test-data/seed', {
        method: 'POST',
        body: JSON.stringify(options ?? {}),
      }),
  },
};
