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
  color: #1a1a1a;
  font-size: 1.5rem;
`;

export const SearchBox = styled.input`
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

export const PermissionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PermissionCard = styled.div`
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

export const PermissionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
  font-size: 1.1rem;
`;

export const PermissionKey = styled.p`
  margin: 0.25rem 0;
  color: #6366f1;
  font-family: monospace;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const PermissionModule = styled.p`
  margin: 0.25rem 0;
  color: #999;
  font-size: 0.9rem;
`;

export const PermissionDescription = styled.p`
  margin: 0.75rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const EmptyState = styled.div`
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
