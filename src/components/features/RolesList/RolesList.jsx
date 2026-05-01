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
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
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

const RoleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RoleCardContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.15);
  }
`;

const RoleHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RoleColorBadge = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color || '#6366f1'};
  flex-shrink: 0;
`;

const RoleInfo = styled.div`
  flex: 1;
`;

const RoleTitle = styled.h3`
  margin: 0;
  color: #1a1a1a;
  font-size: 1.1rem;
`;

const RoleKey = styled.p`
  margin: 0.25rem 0 0 0;
  color: #999;
  font-size: 0.9rem;
  font-family: monospace;
`;

const RoleBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RoleDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const PermissionsCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;

  strong {
    color: #6366f1;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const EditButton = styled(Button)`
  background: #6366f1;
  color: white;

  &:hover {
    background: #4f46e5;
  }
`;

const DeleteButton = styled(Button)`
  background: #fee2e2;
  color: #dc2626;

  &:hover {
    background: #fecaca;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
  grid-column: 1 / -1;

  p {
    margin: 0;
  }
`;

/**
 * Componente para exibição de papéis/roles
 */
export function RoleCard({ role, onEdit, onDelete, isSystem = false }) {
  const permissionsCount = role.permissions?.length || 0;

  return (
    <RoleCardContainer>
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
          <DeleteButton onClick={() => onDelete(role._id)} disabled={isSystem}>
            {isSystem ? 'Sistema' : 'Deletar'}
          </DeleteButton>
        </ActionButtons>
      </RoleBody>
    </RoleCardContainer>
  );
}

/**
 * Componente para listar roles
 */
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
