import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '../../mocks/server.js';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useParams: vi.fn(), useNavigate: vi.fn() };
});

import { useNavigate, useParams } from 'react-router-dom';

import EmailConfirmation from '../../../pages/EmailConfirmation/EmailConfirmation.jsx';
import { renderWithProviders } from '../../helpers/renderWithProviders.jsx';

const BASE = 'http://localhost:3333/sgla-api';

function renderPage({ token = 'valid-token' } = {}) {
  const navigate = vi.fn();
  useNavigate.mockReturnValue(navigate);
  useParams.mockReturnValue({ token });
  return { navigate, ...renderWithProviders(<EmailConfirmation />) };
}

describe('EmailConfirmation page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('renders the loading screen while the verification request is in flight', () => {
      server.use(
        http.put(
          `${BASE}/users/confirm-email/:token`,
          () => new Promise(() => {}),
        ),
      );
      renderPage();
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Confirmando seu e-mail')).toBeInTheDocument();
    });
  });

  describe('success state', () => {
    beforeEach(() => {
      server.use(
        http.put(`${BASE}/users/confirm-email/:token`, () =>
          HttpResponse.json('João Silva'),
        ),
      );
    });

    it('shows the "Conta confirmada" title after successful verification', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Conta confirmada, João!')).toBeInTheDocument();
      });
    });

    it('displays the full user name in the badge', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument();
      });
    });

    it('renders the redirect progress bar', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByRole('progressbar', {
            name: 'Progresso de redirecionamento',
          }),
        ).toBeInTheDocument();
      });
    });

    it('renders the "Entrar no login agora" button', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Entrar no login agora' }),
        ).toBeInTheDocument();
      });
    });

    it('navigates to /login when the "Entrar no login agora" button is clicked', async () => {
      const { navigate } = renderPage();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Entrar no login agora' }),
        ).toBeInTheDocument();
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'Entrar no login agora' }),
      );
      expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
    });

    it('shows the generic title when the user name is not a string', async () => {
      server.use(
        http.put(`${BASE}/users/confirm-email/:token`, () =>
          HttpResponse.json(null),
        ),
      );
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Conta confirmada!')).toBeInTheDocument();
      });
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      server.use(
        http.put(
          `${BASE}/users/confirm-email/:token`,
          () => new HttpResponse(null, { status: 400 }),
        ),
      );
    });

    it('shows the "Não foi possível confirmar" title on error', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByText('Não foi possível confirmar'),
        ).toBeInTheDocument();
      });
    });

    it('renders the "Voltar para login" button on error', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Voltar para login' }),
        ).toBeInTheDocument();
      });
    });

    it('navigates to /login when the error back button is clicked', async () => {
      const { navigate } = renderPage();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Voltar para login' }),
        ).toBeInTheDocument();
      });
      fireEvent.click(
        screen.getByRole('button', { name: 'Voltar para login' }),
      );
      expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  describe('no-token state', () => {
    it('shows a loading screen when no token is present in the URL', () => {
      useParams.mockReturnValue({ token: undefined });
      renderPage({ token: undefined });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
