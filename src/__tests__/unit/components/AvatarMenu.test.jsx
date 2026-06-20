import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: vi.fn() };
});

import { useNavigate } from 'react-router-dom';

import AvatarMenu from '../../../components/common/Header/AvatarMenu/AvatarMenu';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const defaultProps = {
  initials: 'JS',
  profileTo: '/student/profile',
  onLogout: vi.fn(),
};

function renderMenu(props = {}) {
  const navigate = vi.fn();
  useNavigate.mockReturnValue(navigate);
  return {
    navigate,
    ...renderWithProviders(<AvatarMenu {...defaultProps} {...props} />),
  };
}

describe('AvatarMenu', () => {
  describe('avatar button', () => {
    it('renders the avatar toggle button', () => {
      renderMenu();
      expect(
        screen.getByRole('button', { name: 'Menu do usuário' }),
      ).toBeInTheDocument();
    });

    it('shows initials when no imageUrl is provided', () => {
      renderMenu({ initials: 'AB', imageUrl: null });
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('has aria-expanded="false" when menu is closed', () => {
      renderMenu();
      expect(
        screen.getByRole('button', { name: 'Menu do usuário' }),
      ).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-expanded="true" after clicking the button', () => {
      renderMenu();
      fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
      expect(
        screen.getByRole('button', { name: 'Menu do usuário' }),
      ).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('dropdown menu', () => {
    it('does not render the dropdown before the button is clicked', () => {
      renderMenu();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('renders the dropdown with both menu items after clicking the button', () => {
      renderMenu();
      fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /Meu perfil/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /Sair/i }),
      ).toBeInTheDocument();
    });

    it('navigates to profileTo when "Meu perfil" is clicked', () => {
      const { navigate } = renderMenu({ profileTo: '/admin/profile' });
      fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
      fireEvent.click(screen.getByRole('menuitem', { name: /Meu perfil/i }));
      expect(navigate).toHaveBeenCalledWith('/admin/profile');
    });

    it('calls onLogout when "Sair" is clicked', () => {
      const onLogout = vi.fn();
      renderMenu({ onLogout });
      fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
      fireEvent.click(screen.getByRole('menuitem', { name: /Sair/i }));
      expect(onLogout).toHaveBeenCalledOnce();
    });

    it('closes the menu when Escape is pressed', async () => {
      renderMenu();
      fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      fireEvent.keyDown(window, { key: 'Escape' });
      await waitFor(() =>
        expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
      );
    });

    it('closes the menu when clicking outside the component', async () => {
      renderMenu();
      fireEvent.click(screen.getByRole('button', { name: 'Menu do usuário' }));
      fireEvent.mouseDown(document.body);
      await waitFor(() =>
        expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
      );
    });
  });
});
