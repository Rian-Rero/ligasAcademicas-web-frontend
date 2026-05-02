import { useState } from 'react';

import {
  Container,
  EmptyState,
  Header,
  PermissionCard,
  PermissionDescription,
  PermissionKey,
  PermissionList,
  PermissionModule,
  PermissionTitle,
  SearchBox,
  Title,
} from './Styles';

export function PermissionSelector({
  permissions = [],
  selectedPermissions = [],
  onPermissionsChange,
  isLoading = false,
  searchPlaceholder = 'Buscar permissões...',
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description &&
        permission.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  );

  const handleTogglePermission = (permissionId) => {
    const isSelected = selectedPermissions.some(
      (item) => item._id === permissionId || item === permissionId,
    );

    const nextSelected = isSelected
      ? selectedPermissions.filter(
          (item) => (item._id || item) !== permissionId,
        )
      : [...selectedPermissions, permissionId];

    onPermissionsChange(nextSelected);
  };

  if (isLoading) {
    return <Container>Carregando permissões...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Selecione Permissões</Title>
        <SearchBox
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </Header>

      {filteredPermissions.length === 0 ? (
        <EmptyState>
          <p>
            {permissions.length === 0
              ? 'Nenhuma permissão disponível'
              : 'Nenhuma permissão encontrada'}
          </p>
        </EmptyState>
      ) : (
        <PermissionList>
          {filteredPermissions.map((permission) => {
            const isSelected = selectedPermissions.some(
              (item) => (item._id || item) === permission._id,
            );

            return (
              <PermissionCard
                key={permission._id}
                className={isSelected ? 'selected' : ''}
                onClick={() => handleTogglePermission(permission._id)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  style={{ marginRight: '0.5rem' }}
                />
                <PermissionTitle>{permission.name}</PermissionTitle>
                <PermissionKey>{permission.key}</PermissionKey>
                <PermissionModule>Módulo: {permission.module}</PermissionModule>
                {permission.description && (
                  <PermissionDescription>
                    {permission.description}
                  </PermissionDescription>
                )}
              </PermissionCard>
            );
          })}
        </PermissionList>
      )}
    </Container>
  );
}

export default PermissionSelector;
