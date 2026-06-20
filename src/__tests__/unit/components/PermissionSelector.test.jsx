import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PermissionSelector } from '../../../components/features/PermissionSelector/PermissionSelector';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const samplePermissions = [
  { _id: 'p1', name: 'Ver eventos', key: 'event.view', module: 'event' },
  { _id: 'p2', name: 'Criar eventos', key: 'event.create', module: 'event' },
  { _id: 'p3', name: 'Ver usuários', key: 'user.view', module: 'user' },
];

function renderSelector(props = {}) {
  const onPermissionsChange = props.onPermissionsChange ?? vi.fn();
  return {
    onPermissionsChange,
    ...renderWithProviders(
      <PermissionSelector
        permissions={samplePermissions}
        selectedPermissions={[]}
        onPermissionsChange={onPermissionsChange}
        {...props}
      />,
    ),
  };
}

describe('PermissionSelector', () => {
  describe('rendering', () => {
    it('renders all permission names', () => {
      renderSelector();
      expect(screen.getByText('Ver eventos')).toBeInTheDocument();
      expect(screen.getByText('Criar eventos')).toBeInTheDocument();
      expect(screen.getByText('Ver usuários')).toBeInTheDocument();
    });

    it('shows loading text when isLoading is true', () => {
      renderSelector({ isLoading: true });
      expect(screen.getByText(/Carregando permissões/i)).toBeInTheDocument();
    });

    it('shows "Nenhuma permissão disponível" when permissions list is empty', () => {
      renderSelector({ permissions: [] });
      expect(
        screen.getByText('Nenhuma permissão disponível'),
      ).toBeInTheDocument();
    });

    it('renders permission keys', () => {
      renderSelector();
      expect(screen.getByText('event.view')).toBeInTheDocument();
    });

    it('renders the module label for each permission', () => {
      renderSelector();
      expect(screen.getAllByText(/Módulo: event/i).length).toBeGreaterThan(0);
    });
  });

  describe('search', () => {
    it('filters permissions by name', () => {
      renderSelector();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'usuários' },
      });
      expect(screen.queryByText('Ver eventos')).not.toBeInTheDocument();
      expect(screen.getByText('Ver usuários')).toBeInTheDocument();
    });

    it('filters permissions by key', () => {
      renderSelector();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'event.create' },
      });
      expect(screen.getByText('Criar eventos')).toBeInTheDocument();
      expect(screen.queryByText('Ver usuários')).not.toBeInTheDocument();
    });

    it('shows "Nenhuma permissão encontrada" when search has no results', () => {
      renderSelector();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'xyz-inexistente' },
      });
      expect(
        screen.getByText('Nenhuma permissão encontrada'),
      ).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('renders checkboxes checked for selected permissions', () => {
      renderSelector({ selectedPermissions: ['p1'] });
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
    });

    it('calls onPermissionsChange adding the id when an unselected item is clicked', () => {
      const { onPermissionsChange } = renderSelector({
        selectedPermissions: [],
      });
      // click the entire card (parent of the checkbox for "Ver eventos")
      fireEvent.click(
        screen.getByText('Ver eventos').closest('li') ??
          screen.getByText('Ver eventos').parentElement,
      );
      expect(onPermissionsChange).toHaveBeenCalledOnce();
      expect(onPermissionsChange.mock.calls[0][0]).toContain('p1');
    });

    it('calls onPermissionsChange removing the id when a selected item is clicked', () => {
      const { onPermissionsChange } = renderSelector({
        selectedPermissions: ['p1'],
      });
      fireEvent.click(
        screen.getByText('Ver eventos').closest('li') ??
          screen.getByText('Ver eventos').parentElement,
      );
      expect(onPermissionsChange).toHaveBeenCalledOnce();
      expect(onPermissionsChange.mock.calls[0][0]).not.toContain('p1');
    });
  });
});
