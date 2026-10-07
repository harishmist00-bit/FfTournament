import { mock, TOKEN_KEYS } from './api';
import { users } from '@/data/db';
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '@/types';
import { ApiError } from '@/utils/errors';

const SESSION_USER = 'ffba_mock_user_id'; // mock only: Django derives the user from the JWT

const saveTokens = (t: AuthTokens) => {
  localStorage.setItem(TOKEN_KEYS.access, t.access);
  localStorage.setItem(TOKEN_KEYS.refresh, t.refresh);
};

// Django: POST /api/auth/login/  -> { access, refresh }
export const login = ({ email, password }: LoginPayload): Promise<User> =>
  mock(() => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || password.length < 6) throw new ApiError('Email or password is incorrect.', 401);
    saveTokens({ access: `mock-access-${user.id}`, refresh: `mock-refresh-${user.id}` });
    localStorage.setItem(SESSION_USER, String(user.id));
    return user;
  });

// Django: POST /api/auth/register/
export const register = ({ username, email, password }: RegisterPayload): Promise<User> =>
  mock(() => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw new ApiError('An account with this email already exists.');
    const user: User = { id: users.length + 1, username, email, role: 'user' };
    users.push(user);
    saveTokens({ access: `mock-access-${user.id}`, refresh: `mock-refresh-${user.id}` });
    localStorage.setItem(SESSION_USER, String(user.id));
    return user;
  });

// Django: POST /api/auth/refresh/  (handled automatically by the Axios interceptor)
export const refresh = (): Promise<string> => mock(() => localStorage.getItem(TOKEN_KEYS.access) ?? '');

// Django: GET /api/auth/me/
export const getMe = (): Promise<User | null> =>
  mock(() => {
    if (!localStorage.getItem(TOKEN_KEYS.access)) return null;
    return users.find(u => u.id === Number(localStorage.getItem(SESSION_USER))) ?? null;
  }, 150);

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
  localStorage.removeItem(SESSION_USER);
};
