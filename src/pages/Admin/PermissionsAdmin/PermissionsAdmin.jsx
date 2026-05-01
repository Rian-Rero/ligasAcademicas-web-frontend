import { useMemo, useState } from 'react';

import { Plus } from 'lucide-react';

import {
  Container,
  ContentArea,
  CreateButton,
  InfoBox,
  PageTitle,
  PermissionCard,
  PermissionDescription,
  PermissionKey,
  PermissionsGrid,
  PermissionModule,
  PermissionTitle,
  SectionHeader,
  Tab,
  TabContainer,
} from './Styles';
import { ConfirmDialog } from '../../../components/common';
import { EditRoleModal } from '../../../components/features/EditRoleModal/EditRoleModal';
import { RolesList } from '../../../components/features/RolesList/RolesList';
import { useGetPermissions } from '../../../hooks/query/permissions';
import {
  useDeleteRole,
  useCreateRole,
  useGetRoles,
  useUpdateRole,
} from '../../../hooks/query/roles';
import { notifyError, notifySuccess } from '../../../utils/toast';

export default function PermissionsAdmin() {
  const [activeTab, setActiveTab] = useState('roles');
  const [editingRole, setEditingRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: roles = [], isLoading: rolesLoading } = useGetRoles({
    filters: { isGlobal: true },
  });
  const { data: permissions = [], isLoading: permissionsLoading } =
    useGetPermissions();

  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const permissionsByModule = useMemo(() => {
    return permissions.reduce((accumulator, permission) => {
      const key = permission.module || 'outros';
      if (!accumulator[key]) accumulator[key] = [];
      accumulator[key].push(permission);
      return accumulator;
    }, {});
  }, [permissions]);

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
        notifySuccess('Papel atualizado com sucesso!');
      } else {
        await createRole.mutateAsync(formData);
        notifySuccess('Papel criado com sucesso!');
      }
      setShowEditModal(false);
      setEditingRole(null);
    } catch (error) {
      notifyError(error.response?.data?.message || 'Erro ao salvar papel');
    }
  };

  const handleRequestDeleteRole = (role) => {
    setRoleToDelete(role);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeleteRole = async () => {
    if (!roleToDelete?._id) return;

    try {
      await deleteRole.mutateAsync(roleToDelete._id);
      notifySuccess('Papel deletado com sucesso!');
    } catch (error) {
      notifyError(error.response?.data?.message || 'Erro ao deletar papel');
    } finally {
      setShowDeleteConfirm(false);
      setRoleToDelete(null);
    }
  };

  const deleteRoleDescription = roleToDelete
    ? `Tem certeza que deseja deletar o papel ${roleToDelete.name}?`
    : 'Tem certeza que deseja deletar este papel?';

  let permissionsContent;

  if (permissionsLoading) {
    permissionsContent = <p>Carregando permissões...</p>;
  } else if (permissions.length === 0) {
    permissionsContent = <p>Nenhuma permissão disponível</p>;
  } else {
    permissionsContent = (
      <PermissionsGrid>
        {Object.entries(permissionsByModule).map(([module, list]) => (
          <PermissionCard key={module}>
            <PermissionTitle>{module}</PermissionTitle>
            {list.map((permission) => (
              <div key={permission._id}>
                <PermissionKey>{permission.key}</PermissionKey>
                {permission.description && (
                  <PermissionDescription>
                    {permission.description}
                  </PermissionDescription>
                )}
                <PermissionModule>{permission.name}</PermissionModule>
              </div>
            ))}
          </PermissionCard>
        ))}
      </PermissionsGrid>
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
              onDelete={handleRequestDeleteRole}
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
                <strong>Papéis:</strong> agrupamentos de permissões que definem
                o que um usuário pode fazer
              </li>
              <li>
                <strong>Permissões:</strong> ações específicas como criar,
                editar ou deletar recursos
              </li>
              <li>
                <strong>Admin:</strong> tem acesso irrestrito a todas as
                funcionalidades
              </li>
              <li>
                <strong>Customização:</strong> admin pode conceder papéis a
                qualquer usuário dinamicamente
              </li>
            </ul>

            <h3>Papéis do Sistema (pré-configurados)</h3>
            <ul>
              <li>
                <strong>Administrador:</strong> acesso total ao sistema e
                gerenciamento de permissões
              </li>
              <li>
                <strong>Gerenciador:</strong> pode gerenciar eventos, presença,
                squads e membros da liga
              </li>
            </ul>

            <h3>Boas Práticas</h3>
            <ul>
              <li>Use permissões granulares para maior controle</li>
              <li>Agrupe permissões relacionadas em um único papel</li>
              <li>Revise regularmente quem tem acesso a quais recursos</li>
              <li>
                Mantenha o princípio do menor privilégio (least privilege)
              </li>
            </ul>
          </InfoBox>
        )}
      </ContentArea>

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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Remover papel"
        description={deleteRoleDescription}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteRole}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setRoleToDelete(null);
        }}
        isLoading={deleteRole.isPending}
      />
    </Container>
  );
}
