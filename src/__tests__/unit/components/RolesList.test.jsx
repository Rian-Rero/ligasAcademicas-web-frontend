import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  RoleCard,
  RolesList,
} from '../../../components/features/RolesList/RolesList';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const sampleRoles = [
  {
    _id: 'r1',
    name: 'Administrador',
    key: 'admin',
    description: 'Acesso total ao sistema',
    permissions: ['p1', 'p2', 'p3'],
    isSystem: true,
    color: '#e53e3e',
  },
  {
    _id: 'r2',
    name: 'Membro',
    key: 'member',
    description: 'Acesso básico',
    permissions: ['p1'],
    isSystem: false,
    color: '#38a169',
  },
];

function renderList(props = {}) {
  const onEdit = props.onEdit ?? vi.fn();
  const onDelete = props.onDelete ?? vi.fn();
  return {
    onEdit,
    onDelete,
    ...renderWithProviders(
      <RolesList
        roles={sampleRoles}
        onEdit={onEdit}
        onDelete={onDelete}
        {...props}
      />,
    ),
  };
}

describe('RolesList', () => {
  describe('rendering', () => {
    it('renders all role names', () => {
      renderList();
      expect(screen.getByText('Administrador')).toBeInTheDocument();
      expect(screen.getByText('Membro')).toBeInTheDocument();
    });

    it('shows loading text when isLoading is true', () => {
      renderList({ isLoading: true });
      expect(screen.getByText(/Carregando papéis/i)).toBeInTheDocument();
    });

    it('shows "Nenhum papel disponível" when roles list is empty', () => {
      renderList({ roles: [] });
      expect(screen.getByText('Nenhum papel disponível')).toBeInTheDocument();
    });

    it('displays descriptions for each role', () => {
      renderList();
      expect(screen.getByText('Acesso total ao sistema')).toBeInTheDocument();
      expect(screen.getByText('Acesso básico')).toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('filters roles by name', () => {
      renderList();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Membro' },
      });
      expect(screen.queryByText('Administrador')).not.toBeInTheDocument();
      expect(screen.getByText('Membro')).toBeInTheDocument();
    });

    it('filters roles by key', () => {
      renderList();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'admin' },
      });
      expect(screen.getByText('Administrador')).toBeInTheDocument();
      expect(screen.queryByText('Membro')).not.toBeInTheDocument();
    });

    it('shows "Nenhum papel encontrado" when search yields no results', () => {
      renderList();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'xyz-inexistente' },
      });
      expect(screen.getByText('Nenhum papel encontrado')).toBeInTheDocument();
    });
  });
});

describe('RoleCard', () => {
  function renderCard(role = sampleRoles[1], props = {}) {
    const onEdit = props.onEdit ?? vi.fn();
    const onDelete = props.onDelete ?? vi.fn();
    return {
      onEdit,
      onDelete,
      ...renderWithProviders(
        <RoleCard
          role={role}
          onEdit={onEdit}
          onDelete={onDelete}
          isSystem={role.isSystem}
          {...props}
        />,
      ),
    };
  }

  it('calls onEdit with the role object when Editar is clicked', () => {
    const { onEdit } = renderCard();
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit.mock.calls[0][0]).toMatchObject({ _id: 'r2' });
  });

  it('calls onDelete with the role object when Deletar is clicked', () => {
    const { onDelete } = renderCard();
    fireEvent.click(screen.getByRole('button', { name: 'Deletar' }));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete.mock.calls[0][0]).toMatchObject({ _id: 'r2' });
  });

  it('shows a disabled "Sistema" button for system roles', () => {
    renderCard(sampleRoles[0]);
    const sistemaBtn = screen.getByRole('button', { name: 'Sistema' });
    expect(sistemaBtn).toBeDisabled();
  });

  it('renders the role name and key', () => {
    renderCard();
    expect(screen.getByText('Membro')).toBeInTheDocument();
    expect(screen.getByText('member')).toBeInTheDocument();
  });

  it('shows the permission count', () => {
    renderCard();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
