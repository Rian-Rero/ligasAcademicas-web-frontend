import { useState } from 'react';

import {
  ActionButtons,
  Container,
  DeleteButton,
  EditButton,
  EmptyState,
  Header,
  PermissionsCount,
  RoleBody,
  RoleCard as RoleCardWrapper,
  RoleColorBadge,
  RoleDescription,
  RoleHeader,
  RoleInfo,
  RoleKey,
  RoleList,
  RoleTitle,
  SearchBox,
  Title,
} from './Styles';

export function RoleCard({ role, onEdit, onDelete, isSystem = false }) {
  const permissionsCount = role.permissions?.length || 0;

  return (
    <RoleCardWrapper>
      <RoleHeader>
        <RoleColorBadge color={role.color} />
        <RoleInfo>
          <RoleTitle>{role.name}</RoleTitle>
          <RoleKey>{role.key}</RoleKey>
        </RoleInfo>
      </RoleHeader>
      <RoleBody>
        {role.description && (
          <RoleDescription>{role.description}</RoleDescription>
        )}
        <PermissionsCount>
          <strong>{permissionsCount}</strong> permissão(ões)
        </PermissionsCount>
        <ActionButtons>
          <EditButton onClick={() => onEdit(role)}>Editar</EditButton>
          <DeleteButton onClick={() => onDelete(role)} disabled={isSystem}>
            {isSystem ? 'Sistema' : 'Deletar'}
          </DeleteButton>
        </ActionButtons>
      </RoleBody>
    </RoleCardWrapper>
  );
}

export function RolesList({
  roles = [],
  onEdit,
  onDelete,
  isLoading = false,
  searchPlaceholder = 'Buscar papéis...',
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description &&
        role.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (isLoading) {
    return <Container>Carregando papéis...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Papéis do Sistema</Title>
        <SearchBox
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Header>

      {filteredRoles.length === 0 ? (
        <EmptyState>
          <p>
            {roles.length === 0
              ? 'Nenhum papel disponível'
              : 'Nenhum papel encontrado'}
          </p>
        </EmptyState>
      ) : (
        <RoleList>
          {filteredRoles.map((role) => (
            <RoleCard
              key={role._id}
              role={role}
              onEdit={onEdit}
              onDelete={onDelete}
              isSystem={role.isSystem}
            />
          ))}
        </RoleList>
      )}
    </Container>
  );
}

export default RolesList;
