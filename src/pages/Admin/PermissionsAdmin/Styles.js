import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  color: rgba(241, 245, 255, 0.94);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PageTitle = styled.h1`
  margin: 0 0 2rem 0;
  color: #f3f4f7;
  font-size: 2rem;
  letter-spacing: 0.02em;
  text-shadow: 0 0.15rem 0.5rem rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  overflow-x: auto;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(241, 245, 255, 0.62);
  transition: all 0.3s ease;
  white-space: nowrap;
  border-radius: 1rem 1rem 0 0;

  &:hover {
    color: #f3f4f7;
    background: rgba(255, 255, 255, 0.07);
  }

  &.active {
    color: #ffffff;
    border-bottom-color: #f6a04f;
    background: linear-gradient(
      180deg,
      rgba(18, 34, 62, 0.95),
      rgba(9, 16, 31, 0.85)
    );
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
  background: linear-gradient(120deg, #2f8fff, #4f8ef2 52%, #f6a04f);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    filter 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 0.9rem 2rem rgba(47, 143, 255, 0.22);

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const InfoBox = styled.div`
  padding: 1.5rem;
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.95), rgba(8, 18, 34, 0.95))
      padding-box,
    linear-gradient(120deg, rgba(0, 163, 255, 0.5), rgba(255, 140, 0, 0.45))
      border-box;
  border: 1px solid transparent;
  border-radius: 1.4rem;
  color: rgba(241, 245, 255, 0.86);
  line-height: 1.6;
  box-shadow: 0 1rem 2.2rem rgba(0, 0, 0, 0.35);

  h3 {
    margin-top: 0;
    color: #f3f4f7;
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
  padding: 1rem 1rem 0.9rem;
  border-radius: 1.2rem;
  border: 1px solid transparent;
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.95), rgba(8, 18, 34, 0.95))
      padding-box,
    linear-gradient(120deg, rgba(47, 143, 255, 0.42), rgba(246, 160, 79, 0.32))
      border-box;
  color: rgba(241, 245, 255, 0.9);
  box-shadow:
    0 1rem 2rem rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(47, 143, 255, 0.08),
      rgba(246, 160, 79, 0.05)
    );
    pointer-events: none;
  }
`;

export const PermissionTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.95rem;
`;

export const PermissionKey = styled.p`
  margin: 0.25rem 0;
  color: #7dc2ff;
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 700;
`;

export const PermissionModule = styled.p`
  margin: 0.25rem 0;
  color: rgba(241, 245, 255, 0.68);
  font-size: 0.85rem;
`;

export const PermissionDescription = styled.p`
  margin: 0.75rem 0 0 0;
  color: rgba(241, 245, 255, 0.78);
  font-size: 0.9rem;
  line-height: 1.4;
`;
