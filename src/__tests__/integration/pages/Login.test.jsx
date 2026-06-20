import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authState, mockSetAuth, mockUseAuthStore } = vi.hoisted(() => {
  const authState = { current: null };

  const mockSetAuth = vi.fn();

  const mockUseAuthStore = Object.assign(
    vi.fn((selector) => selector({ auth: authState.current })),
    {
      getState: vi.fn(() => ({
        auth: authState.current,
        setAuth: mockSetAuth,
        clearAuth: vi.fn(() => {
          authState.current = null;
        }),
      })),
      setState: vi.fn(),
      subscribe: vi.fn(),
    },
  );

  return { authState, mockSetAuth, mockUseAuthStore };
});

vi.mock('../../../stores/auth.js', () => ({ default: mockUseAuthStore }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock('../../../utils/toast.js', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

import { useNavigate } from 'react-router-dom';

import Login from '../../../pages/Login/Login.jsx';
import { notifyError, notifySuccess } from '../../../utils/toast.js';
import { renderWithProviders } from '../../helpers/renderWithProviders.jsx';
import { server } from '../../mocks/server.js';

const BASE = 'http://localhost:3333/sgla-api';

function makeStudent() {
  authState.current = {
    user: {
      _id: 'u-1',
      name: 'Ana Lima',
      roleKeys: [],
      mustChangePassword: false,
    },
  };
}

function makeAdmin() {
  authState.current = {
    user: {
      _id: 'u-2',
      name: 'Carlos Admin',
      roleKeys: ['admin'],
      mustChangePassword: false,
    },
  };
}

function makeManager() {
  authState.current = {
    user: {
      _id: 'u-3',
      name: 'Maria Gestora',
      roleKeys: ['manager'],
      mustChangePassword: false,
    },
  };
}

function makeMustChangePassword() {
  authState.current = {
    user: {
      _id: 'u-4',
      name: 'Novo Usuário',
      roleKeys: [],
      mustChangePassword: true,
    },
  };
}

function renderPage() {
  const navigate = vi.fn();
  useNavigate.mockReturnValue(navigate);
  return { navigate, ...renderWithProviders(<Login />) };
}

async function submitLogin({
  email = 'user@test.com',
  password = 'Senha@123',
} = {}) {
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
}

describe('Login page', () => {
  beforeEach(() => {
    authState.current = null;
    vi.clearAllMocks();
    mockSetAuth.mockImplementation(makeStudent);
  });

  describe('layout', () => {
    it('renders the email input field', () => {
      renderPage();
      expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
    });

    it('renders the password input field', () => {
      renderPage();
      expect(
        document.querySelector('input[type="password"]'),
      ).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderPage();
      expect(
        screen.getByRole('button', { name: 'Entrar' }),
      ).toBeInTheDocument();
    });

    it('renders the "Esqueci minha senha" button', () => {
      renderPage();
      expect(
        screen.getByRole('button', { name: 'Esqueci minha senha' }),
      ).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to /forgot-password when "Esqueci minha senha" is clicked', () => {
      const { navigate } = renderPage();
      fireEvent.click(
        screen.getByRole('button', { name: 'Esqueci minha senha' }),
      );
      expect(navigate).toHaveBeenCalledWith('/forgot-password');
    });
  });

  describe('successful login', () => {
    it('calls notifySuccess after a successful login', async () => {
      renderPage();
      await submitLogin();
      await waitFor(() => {
        expect(notifySuccess).toHaveBeenCalledOnce();
      });
    });

    it('navigates to /student/dashboard for a regular student', async () => {
      mockSetAuth.mockImplementation(makeStudent);
      const { navigate } = renderPage();
      await submitLogin();
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(
          '/student/dashboard',
          expect.objectContaining({ replace: true }),
        );
      });
    });

    it('navigates to /admin/dashboard for an admin user', async () => {
      mockSetAuth.mockImplementation(makeAdmin);
      const { navigate } = renderPage();
      await submitLogin();
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(
          '/admin/dashboard',
          expect.objectContaining({ replace: true }),
        );
      });
    });

    it('navigates to /manager/dashboard for a manager user', async () => {
      mockSetAuth.mockImplementation(makeManager);
      const { navigate } = renderPage();
      await submitLogin();
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(
          '/manager/dashboard',
          expect.objectContaining({ replace: true }),
        );
      });
    });

    it('navigates to /change-password when mustChangePassword is true', async () => {
      mockSetAuth.mockImplementation(makeMustChangePassword);
      const { navigate } = renderPage();
      await submitLogin();
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(
          '/change-password',
          expect.objectContaining({ replace: true }),
        );
      });
    });
  });

  describe('failed login', () => {
    it('calls notifyError when the API returns a 401', async () => {
      server.use(
        http.post(
          `${BASE}/login`,
          () => new HttpResponse(null, { status: 401 }),
        ),
      );
      renderPage();
      await submitLogin({ email: 'wrong@test.com', password: 'WrongPass@1' });
      await waitFor(() => {
        expect(notifyError).toHaveBeenCalledOnce();
      });
    });

    it('does not navigate after a failed login', async () => {
      server.use(
        http.post(
          `${BASE}/login`,
          () => new HttpResponse(null, { status: 401 }),
        ),
      );
      const { navigate } = renderPage();
      await submitLogin({ email: 'wrong@test.com', password: 'WrongPass@1' });
      await waitFor(() => {
        expect(notifyError).toHaveBeenCalledOnce();
      });
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('disables the submit button while the login request is pending', async () => {
      let resolveRequest;
      server.use(
        http.post(
          `${BASE}/login`,
          () =>
            new Promise((resolve) => {
              resolveRequest = () =>
                resolve(HttpResponse.json({ accessToken: 'token' }));
            }),
        ),
      );
      renderPage();
      await submitLogin();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Entrando/i }),
        ).toBeDisabled();
      });
      resolveRequest();
    });
  });
});
