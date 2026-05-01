import { useState } from 'react';

import { Plus } from 'lucide-react';
import styled from 'styled-components';

import AddToast from '../../../components/common/AddToast/AddToast';
import { EditRoleModal } from '../../../components/features/EditRoleModal/EditRoleModal';
import { RolesList } from '../../../components/features/RolesList/RolesList';
import {
  useGetRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useGetPermissions,
} from '../../../hooks/query/permissions';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 2rem 0;
  color: #1a1a1a;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
  overflow-x: auto;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #999;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #6366f1;
  }

  &.active {
    color: #6366f1;
    border-bottom-color: #6366f1;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4f46e5;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const InfoBox = styled.div`
  padding: 1.5rem;
  background: #f0f4ff;
  border: 1px solid #ddd;
  border-radius: 12px;
  color: #333;
  line-height: 1.6;

  h3 {
    margin-top: 0;
    color: #6366f1;
  }

  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

/**
 * Página de Gerenciamento de Permissões
 */
export default function PermissionsAdmin() {
  const [activeTab, setActiveTab] = useState('roles');
  const [editingRole, setEditingRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Queries
  const { data: roles = [], isLoading: rolesLoading } = useGetRoles({
    isGlobal: true,
  });
  const { data: permissions = [], isLoading: permissionsLoading } =
    useGetPermissions();

  // Mutations
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowEditModal(true);
  };

  const handleSaveRole = async (formData) => {
    try {
      if (editingRole) {
        await updateRole.mutateAsync({
          roleId: editingRole._id,
          data: formData,
        });
        AddToast({ type: 'success', message: 'Papel atualizado com sucesso!' });
      } else {
        await createRole.mutateAsync(formData);
        AddToast({ type: 'success', message: 'Papel criado com sucesso!' });
      }
      setShowEditModal(false);
      setEditingRole(null);
    } catch (error) {
      AddToast({
        type: 'error',
        message: error.response?.data?.message || 'Erro ao salvar papel',
      });
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Tem certeza que deseja deletar este papel?')) {
      try {
        await deleteRole.mutateAsync(roleId);
        AddToast({ type: 'success', message: 'Papel deletado com sucesso!' });
      } catch (error) {
        AddToast({
          type: 'error',
          message: error.response?.data?.message || 'Erro ao deletar papel',
        });
      }
    }
  };

  let permissionsContent;

  if (permissionsLoading) {
    permissionsContent = <p>Carregando permissões...</p>;
  } else if (permissions.length === 0) {
    permissionsContent = <p>Nenhuma permissão disponível</p>;
  } else {
    permissionsContent = (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {permissions.map((permission) => (
          <div
            key={permission._id}
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: 'white',
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a1a1a' }}>
              {permission.name}
            </h4>
            <p
              style={{
                margin: '0.25rem 0',
                color: '#6366f1',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}
            >
              {permission.key}
            </p>
            <p
              style={{
                margin: '0.25rem 0',
                color: '#999',
                fontSize: '0.85rem',
              }}
            >
              Módulo: {permission.module}
            </p>
            {permission.description && (
              <p
                style={{
                  margin: '0.75rem 0 0 0',
                  color: '#666',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                }}
              >
                {permission.description}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Container>
      <PageTitle>🔐 Gerenciamento de Permissões</PageTitle>

      <TabContainer>
        <Tab
          className={activeTab === 'roles' ? 'active' : ''}
          onClick={() => setActiveTab('roles')}
        >
          Papéis
        </Tab>
        <Tab
          className={activeTab === 'permissions' ? 'active' : ''}
          onClick={() => setActiveTab('permissions')}
        >
          Permissões
        </Tab>
        <Tab
          className={activeTab === 'info' ? 'active' : ''}
          onClick={() => setActiveTab('info')}
        >
          Informações
        </Tab>
      </TabContainer>

      <ContentArea>
        {activeTab === 'roles' && (
          <>
            <SectionHeader>
              <div>
                <h2 style={{ margin: 0, color: '#1a1a1a' }}>
                  Papéis do Sistema
                </h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#999' }}>
                  Gerencie os papéis e suas permissões
                </p>
              </div>
              <CreateButton
                onClick={() => {
                  setEditingRole(null);
                  setShowEditModal(true);
                }}
              >
                <Plus size={20} />
                Novo Papel
              </CreateButton>
            </SectionHeader>

            <RolesList
              roles={roles}
              isLoading={rolesLoading}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
            />
          </>
        )}

        {activeTab === 'permissions' && (
          <>
            <SectionHeader>
              <div>
                <h2 style={{ margin: 0, color: '#1a1a1a' }}>
                  Permissões Disponíveis
                </h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#999' }}>
                  Todas as permissões que podem ser atribuídas aos papéis
                </p>
              </div>
            </SectionHeader>

            {permissionsContent}
          </>
        )}

        {activeTab === 'info' && (
          <InfoBox>
            <h3>Como funciona o sistema de permissões?</h3>
            <p>
              O sistema foi redesenhado para gerenciar permissões de forma
              dinâmica e flexível:
            </p>
            <ul>
              <li>
                <strong>Papéis:</strong> Agrupamentos de permissões que definem
                o que um usuário pode fazer
              </li>
              <li>
                <strong>Permissões:</strong> Ações específicas como criar,
                editar ou deletar recursos
              </li>
              <li>
                <strong>Admin:</strong> Tem acesso irrestrito a todas as
                funcionalidades
              </li>
              <li>
                <strong>Customização:</strong> Admin pode conceder papéis a
                qualquer usuário dinamicamente
              </li>
            </ul>

            <h3>Papéis do Sistema (pré-configurados)</h3>
            <ul>
              <li>
                <strong>Administrador:</strong> Acesso total ao sistema e
                gerenciamento de permissões
              </li>
              <li>
                <strong>Gerenciador:</strong> Pode gerenciar eventos, presença,
                squads e membros da liga
              </li>
            </ul>

            <h3>Boas Práticas</h3>
            <ul>
              <li>Use permissões granulares para maior controle</li>
              <li>Agrupe permissões relacionadas em um único papel</li>
              <li>Revise regularmente quem tem acesso à quais recursos</li>
              <li>
                Mantenha o princípio do menor privilégio (least privilege)
              </li>
            </ul>
          </InfoBox>
        )}
      </ContentArea>

      {/* Modals */}
      <EditRoleModal
        role={editingRole}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingRole(null);
        }}
        onSave={handleSaveRole}
        isLoading={createRole.isPending || updateRole.isPending}
      />
    </Container>
  );
}
