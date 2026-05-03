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

export const SectionTitle = styled.h2`
  margin: 0;
  color: #f3f4f7;
  font-size: 1.3rem;
  letter-spacing: 0.01em;
`;

export const SectionDescription = styled.p`
  margin: 0.5rem 0 0 0;
  color: rgba(241, 245, 255, 0.66);
  line-height: 1.5;
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

export const SecondaryButton = styled(CreateButton)`
  background: rgba(255, 255, 255, 0.08);
  box-shadow: none;
  color: rgba(241, 245, 255, 0.9);

  &:hover {
    filter: none;
    background: rgba(255, 255, 255, 0.14);
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

export const UserWorkspace = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 1.2rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const UserPanel = styled.section`
  padding: 1.2rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
`;

export const UserPanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const UserSearchBox = styled.input`
  width: 100%;
  padding: 0.95rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: #f3f4f7;
  font-size: 1.05rem;
  height: 3rem;

  &:focus {
    outline: none;
    border-color: rgba(246, 160, 79, 0.7);
    box-shadow: 0 0 0 3px rgba(246, 160, 79, 0.12);
  }
`;

export const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 60vh;
  overflow: auto;
  padding-right: 0.25rem;
`;

export const UserCard = styled.button`
  width: 100%;
  padding: 1rem;
  border: 1px solid transparent;
  border-radius: 1.2rem;
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.95), rgba(8, 18, 34, 0.95))
      padding-box,
    linear-gradient(120deg, rgba(47, 143, 255, 0.24), rgba(246, 160, 79, 0.18))
      border-box;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    filter 0.25s ease,
    box-shadow 0.25s ease;
  box-shadow: 0 0.9rem 1.8rem rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.04);
  }

  &.selected {
    border-color: transparent;
    background:
      linear-gradient(160deg, rgba(15, 31, 58, 0.98), rgba(10, 20, 38, 0.98))
        padding-box,
      linear-gradient(120deg, rgba(47, 143, 255, 0.8), rgba(246, 160, 79, 0.65))
        border-box;
    box-shadow:
      0 1rem 2rem rgba(0, 0, 0, 0.36),
      0 0 0 1px rgba(125, 194, 255, 0.15);
  }
`;

export const UserCardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
`;

export const UserCardName = styled.strong`
  color: #ffffff;
  font-size: 1rem;
`;

export const UserCardMeta = styled.p`
  margin: 0.35rem 0 0;
  color: rgba(241, 245, 255, 0.68);
  font-size: 0.88rem;
  line-height: 1.4;
`;

export const UserCardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #7dc2ff;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const UserDetailsPanel = styled.section`
  padding: 1.2rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.95), rgba(8, 18, 34, 0.95))
      padding-box,
    linear-gradient(120deg, rgba(47, 143, 255, 0.3), rgba(246, 160, 79, 0.24))
      border-box;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.25);
`;

export const UserDetailsHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const UserStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const StatBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(241, 245, 255, 0.88);
  font-size: 0.85rem;

  strong {
    color: #7dc2ff;
  }
`;

export const UserChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const UserChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(241, 245, 255, 0.88);
  font-size: 0.85rem;
`;

export const PermissionActions = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

export const PermissionHelper = styled.p`
  margin: 0.5rem 0 0;
  color: rgba(241, 245, 255, 0.62);
  line-height: 1.5;
`;

export const EmptySelection = styled.div`
  display: grid;
  place-items: center;
  min-height: 24rem;
  text-align: center;
  color: rgba(241, 245, 255, 0.72);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 2rem;
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

export const RoleSelectContainer = styled.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  font-weight: 500;
  color: #ffffff;
`;

export const RoleSelectLabel = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  color: #f3f4f7;
  font-size: 0.95rem;
  font-weight: 500;
`;

export const RoleSelect = styled.select`
  width: 100%;
  height: 2.8rem;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  color: #ffffff;
  border: 1px solid rgba(167, 206, 255, 0.38);
  background: linear-gradient(
    165deg,
    rgba(8, 22, 44, 0.78),
    rgba(11, 29, 54, 0.68)
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 10px 24px rgba(0, 0, 0, 0.24);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
  cursor: pointer;

  option {
    background: #0b1d36;
    color: #ffffff;
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 140, 255, 0.75);
    background: linear-gradient(
      165deg,
      rgba(10, 27, 54, 0.9),
      rgba(12, 34, 66, 0.82)
    );
    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.22),
      0 12px 28px rgba(0, 0, 0, 0.28);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 700px) {
    font-size: 0.9rem;
    padding: 0.5rem 0.8rem;
  }
`;

export const RoleInputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.8rem;
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
    }
  }
`;
