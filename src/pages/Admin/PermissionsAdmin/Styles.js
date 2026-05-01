import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PageTitle = styled.h1`
  margin: 0 0 2rem 0;
  color: #1a1a1a;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
  overflow-x: auto;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const Tab = styled.button`
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

export const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const SectionHeader = styled.div`
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

export const CreateButton = styled.button`
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

export const InfoBox = styled.div`
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

export const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

export const PermissionCard = styled.div`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
`;

export const PermissionTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
`;

export const PermissionKey = styled.p`
  margin: 0.25rem 0;
  color: #6366f1;
  font-family: monospace;
  font-size: 0.85rem;
`;

export const PermissionModule = styled.p`
  margin: 0.25rem 0;
  color: #999;
  font-size: 0.85rem;
`;

export const PermissionDescription = styled.p`
  margin: 0.75rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;
