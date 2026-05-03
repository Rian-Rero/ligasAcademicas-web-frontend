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

export const PermissionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(246, 160, 79, 0.5);
    border-radius: 999px;

    &:hover {
      background: rgba(246, 160, 79, 0.7);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-height: 40vh;
  }
`;

export const PermissionCard = styled.div`
  padding: 1.5rem;
  border: 1px solid transparent;
  border-radius: 1.35rem;
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.95), rgba(8, 18, 34, 0.95))
      padding-box,
    linear-gradient(120deg, rgba(47, 143, 255, 0.42), rgba(246, 160, 79, 0.32))
      border-box;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    filter 0.3s ease;
  cursor: pointer;
  box-shadow:
    0 1rem 2rem rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  &:hover {
    transform: translateY(-3px);
    filter: brightness(1.04);
  }

  &.selected {
    border-color: rgba(125, 194, 255, 0.7);
    box-shadow:
      0 1rem 2rem rgba(0, 0, 0, 0.34),
      0 0 0 1px rgba(125, 194, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
`;

export const PermissionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  font-size: 1.1rem;
`;

export const PermissionKey = styled.p`
  margin: 0.25rem 0;
  color: #7dc2ff;
  font-family: monospace;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const PermissionModule = styled.p`
  margin: 0.25rem 0;
  color: rgba(241, 245, 255, 0.68);
  font-size: 0.9rem;
`;

export const PermissionDescription = styled.p`
  margin: 0.75rem 0 0 0;
  color: rgba(241, 245, 255, 0.78);
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(241, 245, 255, 0.68);

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;
