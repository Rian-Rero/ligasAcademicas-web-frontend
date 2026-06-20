import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '../../mocks/server.js';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock('../../../utils/toast.js', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

import { useNavigate } from 'react-router-dom';

import ForgotPassword from '../../../pages/ForgotPassword/ForgotPassword.jsx';
import { notifyError, notifySuccess } from '../../../utils/toast.js';
import { renderWithProviders } from '../../helpers/renderWithProviders.jsx';

const BASE = 'http://localhost:3333/sgla-api';

function renderPage() {
  const navigate = vi.fn();
  useNavigate.mockReturnValue(navigate);
  return { navigate, ...renderWithProviders(<ForgotPassword />) };
}

describe('ForgotPassword page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('layout', () => {
    it('renders the page title', () => {
      renderPage();
      expect(screen.getByText('Recuperar senha')).toBeInTheDocument();
    });

    it('renders the description text', () => {
      renderPage();
      expect(
        screen.getByText(/Digite o e-mail da sua conta/i),
      ).toBeInTheDocument();
    });

    it('renders the email input field', () => {
      renderPage();
      expect(
        screen.getByPlaceholderText('Digite aqui seu email'),
      ).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderPage();
      expect(
        screen.getByRole('button', { name: 'Enviar link de redefinição' }),
      ).toBeInTheDocument();
    });

    it('renders the "Voltar para login" button', () => {
      renderPage();
      expect(
        screen.getByRole('button', { name: /Voltar para login/i }),
      ).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to /login when the back button is clicked', () => {
      const { navigate } = renderPage();
      fireEvent.click(
        screen.getByRole('button', { name: /Voltar para login/i }),
      );
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('form validation', () => {
    it('marks the email field invalid when submitted empty', async () => {
      renderPage();
      fireEvent.click(
        screen.getByRole('button', { name: 'Enviar link de redefinição' }),
      );
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveAttribute(
          'aria-invalid',
          'true',
        );
      });
    });

    it('does not call the API when the email field is empty', async () => {
      renderPage();
      fireEvent.click(
        screen.getByRole('button', { name: 'Enviar link de redefinição' }),
      );
      await waitFor(() => {
        expect(notifySuccess).not.toHaveBeenCalled();
        expect(notifyError).not.toHaveBeenCalled();
      });
    });
  });

  describe('API interaction', () => {
    it('calls notifySuccess after the API responds with 200', async () => {
      server.use(
        http.post(`${BASE}/users/forgot-password`, () =>
          HttpResponse.json({ message: 'Email enviado' }),
        ),
      );
      renderPage();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'usuario@test.com' },
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'Enviar link de redefinição' }),
      );
      await waitFor(() => {
        expect(notifySuccess).toHaveBeenCalledOnce();
      });
    });

    it('resets the form after a successful submission', async () => {
      server.use(
        http.post(`${BASE}/users/forgot-password`, () =>
          HttpResponse.json({ message: 'Email enviado' }),
        ),
      );
      renderPage();
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'usuario@test.com' } });
      fireEvent.click(
        screen.getByRole('button', { name: 'Enviar link de redefinição' }),
      );
      await waitFor(() => {
        expect(notifySuccess).toHaveBeenCalledOnce();
      });
      expect(input.value).toBe('');
    });

    it('calls notifyError when the API returns a 404', async () => {
      server.use(
        http.post(
          `${BASE}/users/forgot-password`,
          () => new HttpResponse(null, { status: 404 }),
        ),
      );
      renderPage();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'naoexiste@test.com' },
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'Enviar link de redefinição' }),
      );
      await waitFor(() => {
        expect(notifyError).toHaveBeenCalledOnce();
      });
    });

    it('disables the submit button while the request is pending', async () => {
      let resolveRequest;
      server.use(
        http.post(
          `${BASE}/users/forgot-password`,
          () =>
            new Promise((resolve) => {
              resolveRequest = () =>
                resolve(HttpResponse.json({ message: 'ok' }));
            }),
        ),
      );
      renderPage();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'usuario@test.com' },
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'Enviar link de redefinição' }),
      );
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Enviando/i }),
        ).toBeDisabled();
      });
      resolveRequest();
    });
  });
});
