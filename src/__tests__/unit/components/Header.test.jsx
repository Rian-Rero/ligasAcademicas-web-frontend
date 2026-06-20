import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { mockUseAuthStore } = vi.hoisted(() => ({
  mockUseAuthStore: vi.fn(),
}));

vi.mock('../../../stores/auth.js', () => ({ default: mockUseAuthStore }));

vi.mock('../../../hooks/query/leagueMembership.js', () => ({
  useGetLeagueMemberships: vi.fn(() => ({ data: [] })),
}));

vi.mock('../../../hooks/query/sessions.js', () => ({
  useLogout: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn(() => vi.fn()) };
});

import Header from '../../../components/common/Header/Header';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const unauthState = { auth: null };
const studentState = {
  auth: {
    user: { _id: 'u1', name: 'Ana Lima', roleKeys: [], image: null },
  },
};
const adminState = {
  auth: {
    user: { _id: 'u2', name: 'Carlos Admin', roleKeys: ['admin'], image: null },
  },
};
const managerState = {
  auth: {
    user: {
      _id: 'u3',
      name: 'Maria Gestora',
      roleKeys: ['manager'],
      image: null,
    },
  },
};

function renderHeader(initialPath = '/') {
  return renderWithProviders(<Header />, { initialPath });
}

describe('Header — unauthenticated', () => {
  beforeEach(() => {
    mockUseAuthStore.mockImplementation((selector) => selector(unauthState));
  });

  it('renders the SGLA brand title', () => {
    renderHeader();
    expect(screen.getByText('SGLA')).toBeInTheDocument();
  });

  it('shows "Sistema de Ligas Acadêmicas" subtitle when unauthenticated', () => {
    renderHeader();
    expect(screen.getByText('Sistema de Ligas Acadêmicas')).toBeInTheDocument();
  });

  it('renders the SGLA logo image', () => {
    renderHeader();
    expect(screen.getByAltText('Logo da SGLA')).toBeInTheDocument();
  });

  it('renders public navigation links in the desktop nav', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Recuperar senha' }),
    ).toBeInTheDocument();
  });

  it('renders the mobile menu toggle button in the DOM', () => {
    const { container } = renderHeader();
    // MenuButton is display:none on desktop viewports — query by aria-label directly
    const menuBtn = container.querySelector(
      'button[aria-label="Abrir menu de navegação"]',
    );
    expect(menuBtn).toBeInTheDocument();
  });

  it('opens the mobile navigation when the toggle button is clicked', () => {
    const { container } = renderHeader();
    const menuBtn = container.querySelector(
      'button[aria-label="Abrir menu de navegação"]',
    );
    fireEvent.click(menuBtn);
    expect(container.querySelector('#mobile-navigation')).toBeInTheDocument();
  });
});

describe('Header — authenticated student', () => {
  beforeEach(() => {
    mockUseAuthStore.mockImplementation((selector) => selector(studentState));
  });

  it('shows "Painel do estudante" badge', () => {
    renderHeader('/student/dashboard');
    expect(screen.getAllByText('Painel do estudante').length).toBeGreaterThan(
      0,
    );
  });

  it('renders the avatar menu button', () => {
    renderHeader('/student/dashboard');
    expect(
      screen.getByRole('button', { name: 'Menu do usuário' }),
    ).toBeInTheDocument();
  });

  it('does not render unauthenticated-only link "Entrar"', () => {
    renderHeader('/student/dashboard');
    expect(
      screen.queryByRole('link', { name: 'Entrar' }),
    ).not.toBeInTheDocument();
  });
});

describe('Header — authenticated admin', () => {
  beforeEach(() => {
    mockUseAuthStore.mockImplementation((selector) => selector(adminState));
  });

  it('shows "Painel administrativo" badge', () => {
    renderHeader('/admin/dashboard');
    expect(screen.getAllByText('Painel administrativo').length).toBeGreaterThan(
      0,
    );
  });
});

describe('Header — authenticated manager', () => {
  beforeEach(() => {
    mockUseAuthStore.mockImplementation((selector) => selector(managerState));
  });

  it('shows "Painel de gestão" badge', () => {
    renderHeader('/manager/dashboard');
    expect(screen.getAllByText('Painel de gestão').length).toBeGreaterThan(0);
  });
});
