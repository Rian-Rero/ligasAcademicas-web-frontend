import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.div`
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

export const Title = styled.h2`
  margin: 0;
  color: #f3f4f7;
  font-size: 1.5rem;
`;

export const SearchBox = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  color: #f3f4f7;
  background: rgba(255, 255, 255, 0.05);

  &:focus {
    outline: none;
    border-color: rgba(246, 160, 79, 0.7);
    box-shadow: 0 0 0 3px rgba(246, 160, 79, 0.12);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const RoleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RoleCard = styled.div`
  border-radius: 1.35rem;
  border: 1px solid transparent;
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.95), rgba(8, 18, 34, 0.95))
      padding-box,
    linear-gradient(120deg, rgba(47, 143, 255, 0.42), rgba(246, 160, 79, 0.32))
      border-box;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    filter 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 1rem 2rem rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  &:hover {
    transform: translateY(-3px);
    filter: brightness(1.04);
  }
`;

export const RoleHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const RoleColorBadge = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color || '#6366f1'};
  flex-shrink: 0;
`;

export const RoleInfo = styled.div`
  flex: 1;
`;

export const RoleTitle = styled.h3`
  margin: 0;
  color: #ffffff;
  font-size: 1.1rem;
`;

export const RoleKey = styled.p`
  margin: 0.25rem 0 0 0;
  color: rgba(241, 245, 255, 0.68);
  font-size: 0.9rem;
  font-family: monospace;
`;

export const RoleBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const RoleDescription = styled.p`
  margin: 0;
  color: rgba(241, 245, 255, 0.78);
  font-size: 0.95rem;
  line-height: 1.4;
`;

export const PermissionsCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  font-size: 0.9rem;
  color: rgba(241, 245, 255, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);

  strong {
    color: #7dc2ff;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
`;

export const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const EditButton = styled(Button)`
  background: linear-gradient(120deg, #2f8fff, #4f8ef2);
  color: white;

  &:hover {
    background: #4f46e5;
  }
`;

export const DeleteButton = styled(Button)`
  background: rgba(255, 255, 255, 0.08);
  color: #ffb3b3;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(241, 245, 255, 0.68);
  grid-column: 1 / -1;

  p {
    margin: 0;
  }
`;
