import { useState } from 'react';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #1a1a1a;
  font-size: 1.5rem;
`;

const SearchBox = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const PermissionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PermissionCard = styled.div`
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  }

  &.selected {
    border-color: #6366f1;
    background: #f0f4ff;
  }
`;

const PermissionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
  font-size: 1.1rem;
`;

const PermissionKey = styled.p`
  margin: 0.25rem 0;
  color: #6366f1;
  font-family: monospace;
  font-size: 0.9rem;
  font-weight: 500;
`;

const PermissionModule = styled.p`
  margin: 0.25rem 0;
  color: #999;
  font-size: 0.9rem;
`;

const PermissionDescription = styled.p`
  margin: 0.75rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #999;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

/**
 * Componente para seleção de permissões
 */
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
      (p) => p._id === permissionId || p === permissionId,
    );

    let newSelected;
    if (isSelected) {
      newSelected = selectedPermissions.filter(
        (p) => (p._id || p) !== permissionId,
      );
    } else {
      newSelected = [...selectedPermissions, permissionId];
    }

    onPermissionsChange(newSelected);
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
              (p) => (p._id || p) === permission._id,
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
                  onChange={() => {}}
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
