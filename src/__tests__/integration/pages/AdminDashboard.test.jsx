import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '../../mocks/server.js';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

import { useNavigate } from 'react-router-dom';

import AdminDashboard from '../../../pages/Admin/AdminDashboard/AdminDashboard.jsx';
import { renderWithProviders } from '../../helpers/renderWithProviders.jsx';

const BASE = 'http://localhost:3333/sgla-api';

function renderPage() {
  const navigate = vi.fn();
  useNavigate.mockReturnValue(navigate);
  return { navigate, ...renderWithProviders(<AdminDashboard />) };
}

describe('AdminDashboard page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('static content', () => {
    it('renders the dashboard header', () => {
      renderPage();
      expect(
        screen.getByText('PAINEL DE ADMINISTRAÇÃO ABSOLUTA'),
      ).toBeInTheDocument();
    });

    it('renders the "Visão Geral da Operação" section', () => {
      renderPage();
      expect(screen.getByText('Visão Geral da Operação')).toBeInTheDocument();
    });

    it('renders the "Acessos Rápidos" section', () => {
      renderPage();
      expect(screen.getByText('Acessos Rápidos')).toBeInTheDocument();
    });

    it('renders the "Próximas Ações" section', () => {
      renderPage();
      expect(screen.getByText('Próximas Ações')).toBeInTheDocument();
    });
  });

  describe('summary cards', () => {
    it('renders all five summary card labels', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByText('UNIVERSIDADES CADASTRADAS'),
        ).toBeInTheDocument();
        expect(screen.getByText('LIGAS ACADÊMICAS')).toBeInTheDocument();
        expect(screen.getByText('USUÁRIOS NA BASE')).toBeInTheDocument();
        expect(screen.getByText('SUBEQUIPES ATIVAS')).toBeInTheDocument();
        expect(screen.getByText('VÍNCULOS ATIVOS')).toBeInTheDocument();
      });
    });

    it('shows 0 for all counts when the API returns empty arrays', async () => {
      renderPage();
      await waitFor(() => {
        const zeroValues = screen.getAllByText('0');
        expect(zeroValues.length).toBeGreaterThanOrEqual(5);
      });
    });

    it('reflects the actual count from the API', async () => {
      server.use(
        http.get(`${BASE}/universities`, () =>
          HttpResponse.json([
            { _id: 'u1', name: 'UFMG' },
            { _id: 'u2', name: 'USP' },
          ]),
        ),
        http.get(`${BASE}/users`, () =>
          HttpResponse.json([
            { _id: 'usr1', name: 'Alice' },
            { _id: 'usr2', name: 'Bob' },
            { _id: 'usr3', name: 'Carlos' },
          ]),
        ),
      );
      renderPage();
      await waitFor(() => {
        const twos = screen.getAllByText('2');
        expect(twos.length).toBeGreaterThanOrEqual(1);
        const threes = screen.getAllByText('3');
        expect(threes.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('counts only active memberships for the "Vínculos ativos" card', async () => {
      server.use(
        http.get(`${BASE}/league-memberships`, () =>
          HttpResponse.json([
            { _id: 'm1', isActive: true },
            { _id: 'm2', isActive: false },
            { _id: 'm3', isActive: true },
          ]),
        ),
      );
      renderPage();
      await waitFor(() => {
        const twos = screen.getAllByText('2');
        expect(twos.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('shortcut navigation', () => {
    it('navigates to /admin/universidades when the Universidades shortcut is clicked', async () => {
      const { navigate } = renderPage();
      const buttons = await screen.findAllByRole('button', {
        name: 'Universidades',
      });
      fireEvent.click(buttons[0]);
      expect(navigate).toHaveBeenCalledWith('/admin/universidades');
    });

    it('navigates to /admin/eventos when the Eventos shortcut is clicked', async () => {
      const { navigate } = renderPage();
      const buttons = await screen.findAllByRole('button', { name: 'Eventos' });
      fireEvent.click(buttons[0]);
      expect(navigate).toHaveBeenCalledWith('/admin/eventos');
    });
  });
});
