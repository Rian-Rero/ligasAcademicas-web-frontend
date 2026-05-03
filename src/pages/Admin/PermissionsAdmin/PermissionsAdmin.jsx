import { useEffect, useMemo, useState } from 'react';

import { Plus } from 'lucide-react';

import {
  Container,
  ContentArea,
  CreateButton,
  EmptySelection,
  InfoBox,
  PageTitle,
  PermissionCard,
  PermissionDescription,
  PermissionKey,
  PermissionActions,
  PermissionHelper,
  PermissionsGrid,
  PermissionModule,
  PermissionTitle,
  SectionHeader,
  SectionDescription,
  SectionTitle,
  SecondaryButton,
  StatBadge,
  Tab,
  TabContainer,
  UserCard,
  UserCardBadge,
  UserCardMeta,
  UserCardName,
  UserCardTitle,
  UserChips,
  UserDetailsHeader,
  UserDetailsPanel,
  UserList,
  UserPanel,
  UserPanelHeader,
  UserSearchBox,
  UserStats,
  UserWorkspace,
  UserChip,
} from './Styles';
import { ConfirmDialog } from '../../../components/common';
import { EditRoleModal } from '../../../components/features/EditRoleModal/EditRoleModal';
import { PermissionSelector } from '../../../components/features/PermissionSelector/PermissionSelector';
import { RolesList } from '../../../components/features/RolesList/RolesList';
import { useGetPermissions } from '../../../hooks/query/permissions';
import {
  useCreateRole,
  useDeleteRole,
  useGetRoles,
  useUpdateRole,
} from '../../../hooks/query/roles';
import { useGetUsers } from '../../../hooks/query/user';
import {
  useGetUserPermissionDetails,
  useGetUserPermissions,
  useUpdateUserPermissions,
} from '../../../hooks/query/userPermissions';
import { hasAdminRole } from '../../../utils/roles';
import { notifyError, notifySuccess } from '../../../utils/toast';

const moduleLabels = {
  user: 'Usuários',
  role: 'Papéis',
  permission: 'Permissões',
  event: 'Eventos',
  attendance: 'Presenças',
  certificate: 'Certificados',
  squad: 'Squads',
  academicLeague: 'Ligas Acadêmicas',
  leagueMembership: 'Associações à Liga',
  university: 'Universidades',
  task: 'Tarefas',
  system: 'Sistema',
};

const moduleDescriptions = {
  task: 'Permissões disponíveis: task.create, task.view, task.edit e task.delete.',
};

export default function PermissionsAdmin() {
  const [activeTab, setActiveTab] = useState('roles');
  const [editingRole, setEditingRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedDirectPermissionIds, setSelectedDirectPermissionIds] =
    useState([]);

  const { data: roles = [], isLoading: rolesLoading } = useGetRoles({
    filters: { isGlobal: true },
  });
  const { data: permissions = [], isLoading: permissionsLoading } =
    useGetPermissions();
  const { data: users = [], isLoading: usersLoading } = useGetUsers();
  const {
    data: userPermissionDetails,
    isLoading: userPermissionDetailsLoading,
  } = useGetUserPermissionDetails({
    userId: selectedUserId,
  });
  const {
    data: effectiveUserPermissions = [],
    isLoading: effectivePermissionsLoading,
  } = useGetUserPermissions({
    userId: selectedUserId,
    enabled: Boolean(selectedUserId),
  });

  const { mutateAsync: createRole } = useCreateRole({
    onSuccess: () => {
      notifySuccess('Papel criado com sucesso!');
    },
  });
  const { mutateAsync: updateRole } = useUpdateRole({
    onSuccess: () => {
      notifySuccess('Papel atualizado com sucesso!');
    },
  });
  const { mutateAsync: deleteRole } = useDeleteRole({
    onSuccess: () => {
      notifySuccess('Papel deletado com sucesso!');
    },
  });
  const { mutateAsync: updateUserPermissions } = useUpdateUserPermissions({});

  const permissionsByModule = useMemo(() => {
    return permissions.reduce((accumulator, permission) => {
      const key = permission.module || 'outros';
      if (!accumulator[key]) accumulator[key] = [];
      accumulator[key].push(permission);
      return accumulator;
    }, {});
  }, [permissions]);

  const filteredUsers = useMemo(() => {
    const search = userSearchTerm.trim().toLowerCase();

    return users.filter((user) => {
      if (!search) return true;

      return [user.name, user.email, ...(user.roleKeys || [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search));
    });
  }, [userSearchTerm, users]);

  const selectedUser = useMemo(
    () => users.find((user) => user._id === selectedUserId) || null,
    [selectedUserId, users],
  );

  const selectedUserRoles = useMemo(
    () => userPermissionDetails?.roles || [],
    [userPermissionDetails],
  );
  const selectedUserDirectPermissions = useMemo(
    () => userPermissionDetails?.permissions || [],
    [userPermissionDetails],
  );

  useEffect(() => {
    if (filteredUsers.length === 0) {
      if (selectedUserId) {
        setSelectedUserId('');
      }

      return;
    }

    const hasSelectedUser = filteredUsers.some(
      (user) => user._id === selectedUserId,
    );

    if (!hasSelectedUser) {
      setSelectedUserId(filteredUsers[0]._id);
    }
  }, [filteredUsers, selectedUserId]);

  useEffect(() => {
    setSelectedDirectPermissionIds(
      selectedUserDirectPermissions.map((permission) => permission._id),
    );
  }, [selectedUserDirectPermissions]);

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowEditModal(true);
  };

  const handleSaveRole = async (formData) => {
    try {
      if (editingRole) {
        await updateRole({
          roleId: editingRole._id,
          data: formData,
        });
      } else {
        await createRole(formData);
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
      await deleteRole(roleToDelete._id);
    } catch (error) {
      notifyError(error.response?.data?.message || 'Erro ao deletar papel');
    } finally {
      setShowDeleteConfirm(false);
      setRoleToDelete(null);
    }
  };

  async function handleSaveDirectPermissions() {
    if (!selectedUserId || hasAdminRole(selectedUser?.roleKeys)) {
      return;
    }

    try {
      await updateUserPermissions({
        userId: selectedUserId,
        data: {
          roles: selectedUserRoles.map((role) => role._id),
          permissions: selectedDirectPermissionIds,
          academicLeague: null,
        },
      });

      notifySuccess('Permissões diretas atualizadas com sucesso!');
    } catch (error) {
      notifyError(
        error.response?.data?.message || 'Erro ao salvar permissões do usuário',
      );
    }
  }

  const deleteRoleDescription = roleToDelete
    ? `Tem certeza que deseja deletar o papel ${roleToDelete.name}?`
    : 'Tem certeza que deseja deletar este papel?';

  let userListContent;

  if (usersLoading) {
    userListContent = <p>Carregando usuários...</p>;
  } else if (filteredUsers.length === 0) {
    userListContent = (
      <EmptySelection>
        <p>Nenhum usuário encontrado.</p>
      </EmptySelection>
    );
  } else {
    userListContent = (
      <UserList>
        {filteredUsers.map((user) => (
          <UserCard
            key={user._id}
            type="button"
            className={selectedUserId === user._id ? 'selected' : ''}
            onClick={() => setSelectedUserId(user._id)}
          >
            <UserCardTitle>
              <UserCardName>{user.name}</UserCardName>
              <UserCardBadge>{user.roleKeys?.[0] || 'membro'}</UserCardBadge>
            </UserCardTitle>
            <UserCardMeta>{user.email}</UserCardMeta>
          </UserCard>
        ))}
      </UserList>
    );
  }

  let selectedUserContent;

  if (!selectedUser) {
    selectedUserContent = (
      <EmptySelection>
        <p>Selecione um usuário para editar as permissões.</p>
      </EmptySelection>
    );
  } else if (hasAdminRole(selectedUser?.roleKeys)) {
    selectedUserContent = (
      <>
        <UserDetailsHeader>
          <div>
            <SectionTitle>{selectedUser.name}</SectionTitle>
            <SectionDescription>{selectedUser.email}</SectionDescription>

            <UserChips>
              <UserChip>{selectedUser.roleKeys?.[0] || 'membro'}</UserChip>
              <UserChip>
                {selectedUserDirectPermissions.length} permissões diretas
              </UserChip>
            </UserChips>
          </div>

          <UserStats>
            <StatBadge>
              <strong>{effectiveUserPermissions.length}</strong>
              permissões efetivas
            </StatBadge>
            <StatBadge>
              <strong>{selectedUserRoles.length}</strong>
              papéis vinculados
            </StatBadge>
          </UserStats>
        </UserDetailsHeader>

        <InfoBox>
          <h3>Usuário administrador</h3>
          <p>
            Administradores já possuem acesso global. As permissões diretas não
            precisam ser editadas aqui.
          </p>
        </InfoBox>
      </>
    );
  } else {
    selectedUserContent = (
      <>
        <UserDetailsHeader>
          <div>
            <SectionTitle>{selectedUser.name}</SectionTitle>
            <SectionDescription>{selectedUser.email}</SectionDescription>

            <UserChips>
              <UserChip>{selectedUser.roleKeys?.[0] || 'membro'}</UserChip>
              <UserChip>
                {selectedUserDirectPermissions.length} permissões diretas
              </UserChip>
            </UserChips>
          </div>

          <UserStats>
            <StatBadge>
              <strong>{effectiveUserPermissions.length}</strong>
              permissões efetivas
            </StatBadge>
            <StatBadge>
              <strong>{selectedUserRoles.length}</strong>
              papéis vinculados
            </StatBadge>
          </UserStats>
        </UserDetailsHeader>

        <SectionTitle>Permissões diretas</SectionTitle>
        <SectionDescription>
          Esses itens são salvos diretamente no usuário e são independentes dos
          papéis atribuídos.
        </SectionDescription>

        <PermissionSelector
          permissions={permissions}
          selectedPermissions={selectedDirectPermissionIds}
          onPermissionsChange={setSelectedDirectPermissionIds}
          isLoading={permissionsLoading || userPermissionDetailsLoading}
          searchPlaceholder="Buscar permissões diretas..."
        />

        <PermissionHelper>
          O salvamento mantém os papéis atuais e atualiza apenas o conjunto de
          permissões diretas.
        </PermissionHelper>

        {selectedUserDirectPermissions.length > 0 && (
          <>
            <SectionTitle>Permissões diretas atuais</SectionTitle>
            <UserChips>
              {selectedUserDirectPermissions.map((permission) => (
                <UserChip key={permission._id}>{permission.name}</UserChip>
              ))}
            </UserChips>
          </>
        )}

        <PermissionActions>
          <SecondaryButton
            type="button"
            onClick={() =>
              setSelectedDirectPermissionIds(
                selectedUserDirectPermissions.map(
                  (permission) => permission._id,
                ),
              )
            }
          >
            Reverter alterações
          </SecondaryButton>
          <CreateButton
            type="button"
            onClick={handleSaveDirectPermissions}
            disabled={
              updateUserPermissions.isPending ||
              userPermissionDetailsLoading ||
              effectivePermissionsLoading
            }
          >
            {updateUserPermissions.isPending
              ? 'Salvando...'
              : 'Salvar permissões'}
          </CreateButton>
        </PermissionActions>
      </>
    );
  }

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
            <PermissionTitle>{moduleLabels[module] || module}</PermissionTitle>
            {moduleDescriptions[module] && (
              <PermissionDescription>
                {moduleDescriptions[module]}
              </PermissionDescription>
            )}
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
        <Tab
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Usuários
        </Tab>
      </TabContainer>

      <ContentArea>
        {activeTab === 'roles' && (
          <>
            <SectionHeader>
              <div>
                <SectionTitle>Papéis do Sistema</SectionTitle>
                <SectionDescription>
                  Gerencie os papéis e suas permissões
                </SectionDescription>
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
                <SectionTitle>Permissões Disponíveis</SectionTitle>
                <SectionDescription>
                  Todas as permissões que podem ser atribuídas aos papéis
                </SectionDescription>
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
                editar ou deletar recursos, como eventos, tarefas e ligas
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
                tarefas, squads e membros da liga
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

        {activeTab === 'users' && (
          <>
            <SectionHeader>
              <div>
                <SectionTitle>Permissões por Usuário</SectionTitle>
                <SectionDescription>
                  Ajuste permissões diretas sem alterar os papéis globais.
                </SectionDescription>
              </div>
            </SectionHeader>

            <UserWorkspace>
              <UserPanel>
                <UserPanelHeader>
                  <UserSearchBox
                    type="text"
                    placeholder="Buscar usuário por nome, e-mail ou cargo"
                    value={userSearchTerm}
                    onChange={(event) => setUserSearchTerm(event.target.value)}
                  />
                </UserPanelHeader>

                {userListContent}
              </UserPanel>

              <UserDetailsPanel>{selectedUserContent}</UserDetailsPanel>
            </UserWorkspace>
          </>
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
