import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '../../mocks/server.js';

const { mockUseAuthStore } = vi.hoisted(() => ({
  mockUseAuthStore: Object.assign(vi.fn(), {
    getState: vi.fn(() => ({
      auth: { accessToken: 'mock-token' },
      setAuth: vi.fn(),
      clearAuth: vi.fn(),
    })),
    setState: vi.fn(),
    subscribe: vi.fn(),
  }),
}));

vi.mock('../../../stores/auth.js', () => ({ default: mockUseAuthStore }));

vi.mock('../../../utils/toast.js', () => ({
  notifySuccess: vi.fn(),
  notifyError: vi.fn(),
}));

import StudentTasks from '../../../pages/Student/StudentTasks/StudentTasks.jsx';
import { notifySuccess } from '../../../utils/toast.js';
import { renderWithProviders } from '../../helpers/renderWithProviders.jsx';

const BASE = 'http://localhost:3333/sgla-api';

const authState = {
  auth: { user: { _id: 'u-1', name: 'Ana Lima', roleKeys: [] } },
};

const pendingTask = {
  _id: 't-1',
  title: 'Escrever relatório',
  description: 'Descreva as atividades do mês',
  priority: 'high',
  dueDate: new Date(Date.now() + 86_400_000).toISOString(),
  completed: false,
};

const completedTask = {
  _id: 't-2',
  title: 'Revisar documentação',
  description: 'Revise o manual de uso',
  priority: 'medium',
  dueDate: new Date(Date.now() - 86_400_000).toISOString(),
  completedAt: new Date(Date.now() - 3600_000).toISOString(),
  completed: true,
};

function renderPage() {
  mockUseAuthStore.mockImplementation((selector) => selector(authState));
  return renderWithProviders(<StudentTasks />);
}

describe('StudentTasks page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('empty state', () => {
    it('shows the empty state message when there are no tasks', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByText('Nenhuma tarefa no momento'),
        ).toBeInTheDocument();
      });
    });

    it('shows the empty state subtitle', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByText(/Você não tem tarefas pendentes/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('with pending tasks', () => {
    beforeEach(() => {
      server.use(
        http.get(`${BASE}/tasks`, ({ request }) => {
          const url = new URL(request.url);
          const completed = url.searchParams.get('completed');
          if (completed === 'false') {
            return HttpResponse.json([pendingTask]);
          }
          return HttpResponse.json([]);
        }),
      );
    });

    it('renders the pending tasks section header', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByText(/Tarefas Pendentes \(1\)/i),
        ).toBeInTheDocument();
      });
    });

    it('renders the task title', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Escrever relatório')).toBeInTheDocument();
      });
    });

    it('renders the task description', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByText('Descreva as atividades do mês'),
        ).toBeInTheDocument();
      });
    });

    it('renders a "Marcar como concluída" button for each pending task', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Marcar como concluída/i }),
        ).toBeInTheDocument();
      });
    });

    it('calls the complete endpoint and shows success toast when completing a task', async () => {
      server.use(
        http.patch(`${BASE}/tasks/:id/complete`, () =>
          HttpResponse.json({ _id: 't-1', completed: true }),
        ),
      );
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Marcar como concluída/i }),
        ).toBeInTheDocument();
      });
      fireEvent.click(
        screen.getByRole('button', { name: /Marcar como concluída/i }),
      );
      await waitFor(() => {
        expect(notifySuccess).toHaveBeenCalledOnce();
      });
    });
  });

  describe('with completed tasks', () => {
    beforeEach(() => {
      server.use(
        http.get(`${BASE}/tasks`, ({ request }) => {
          const url = new URL(request.url);
          const completed = url.searchParams.get('completed');
          if (completed === 'true') {
            return HttpResponse.json([completedTask]);
          }
          return HttpResponse.json([]);
        }),
      );
    });

    it('renders the completed tasks section header', async () => {
      renderPage();
      await waitFor(() => {
        expect(
          screen.getByText(/Tarefas Concluídas \(1\)/i),
        ).toBeInTheDocument();
      });
    });

    it('renders the completed task title', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Revisar documentação')).toBeInTheDocument();
      });
    });

    it('renders a "Concluída" badge for each completed task', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Concluída')).toBeInTheDocument();
      });
    });
  });

  describe('page header', () => {
    it('renders the main page title', () => {
      renderPage();
      expect(screen.getByText(/Minhas Tarefas/i)).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      renderPage();
      expect(
        screen.getByText(/Acompanhe as tarefas delegadas a você/i),
      ).toBeInTheDocument();
    });
  });
});
