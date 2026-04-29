import styled, { css } from 'styled-components';

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const HeaderSection = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const HeaderTitle = styled.h1`
  color: #ffffffa2;
  line-height: 1;
  font-size: 1.8rem;
`;

export const HeaderSubtitle = styled.p`
  margin-top: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.4rem;
  max-width: 70rem;
`;

export const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 1.2rem;
  display: inline-flex;
  color: rgba(255, 255, 255, 0.65);
  font-size: 1.5rem;
`;

const inputStyles = css`
  width: 100%;
  min-height: 4.5rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(13, 22, 45, 0.65);
  color: #ffffff;
  padding: 0 1.2rem;
  font-size: 1.45rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.52);
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 163, 255, 0.8);
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.18);
  }
`;

export const SearchInput = styled.input`
  ${inputStyles};
  padding-left: 3.8rem;
`;

export const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1.5fr;
  gap: 1.4rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const panelSurface = css`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  border-radius: 2rem;
  padding: clamp(1.4rem, 1.8vw, 2rem);
`;

export const SquadsCard = styled.article`
  ${panelSurface};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 58rem;
  width: 40;
`;

export const RightColumn = styled.div`
  display: grid;
  gap: 1.4rem;
  align-content: start;
`;

export const EditorCard = styled.article`
  ${panelSurface};
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const MembersCard = styled.article`
  ${panelSurface};
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const CreateCompact = styled.button`
  ${panelSurface};
  padding: 0.5rem 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-700, #e6eefc);
  background: var(--surface-100, rgba(255, 255, 255, 0.02));
  transition: box-shadow 120ms ease-in-out;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  width: 540px;
  max-width: calc(100% - 40px);
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  border-radius: 2rem;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 1.7vw, 1.9rem);
  line-height: 1.1;
  letter-spacing: 0.03em;
`;

export const SquadList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 64rem;
  overflow-y: auto;
  padding-right: 0.3rem;
`;

export const SquadItem = styled.button`
  width: 100%;
  border: 1px solid transparent;
  border-radius: 1.2rem;
  padding: 1rem;
  margin-top: 0.3rem;
  text-align: left;
  background: ${({ $active }) =>
    $active ? 'rgba(0, 140, 255, 0.22)' : 'rgba(255, 255, 255, 0.04)'};
  border-color: ${({ $active }) =>
    $active ? 'rgba(0, 163, 255, 0.78)' : 'rgba(255, 255, 255, 0.06)'};
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(0, 163, 255, 0.6);
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 163, 255, 0.9);
    outline-offset: 2px;
    border-color: rgba(0, 163, 255, 0.78);
  }
`;

export const SquadTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;

  strong {
    font-size: 1.45rem;
    font-weight: 700;
    color: #ffffff;
  }
`;

export const SquadDescription = styled.p`
  margin: 0.45rem 0 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.3rem;
`;

export const SquadMeta = styled.div`
  margin-top: 0.65rem;
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;

  span {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.62);
  }
`;

export const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: rgba(0, 255, 128, 0.16);
  color: #a8ffbf;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${({ $fullWidth }) => ($fullWidth ? '1 / -1' : 'auto')};
`;

export const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.7);
`;

export const TextInput = styled.input`
  ${inputStyles};
`;

export const TextArea = styled.textarea`
  ${inputStyles};
  min-height: 9.2rem;
  padding: 0.9rem 1rem;
  resize: vertical;
`;

export const ActionsRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.8rem;
`;

export const ActionButton = styled.button`
  min-height: 4.3rem;
  max-width: 22rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0 1.2rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 700;
  cursor: pointer;

  background: ${({ $variant }) => {
    if ($variant === 'warning') {
      return 'linear-gradient(120deg, #cc5f04, #f08f20 58%, #f6a04f)';
    }

    if ($variant === 'danger') {
      return 'linear-gradient(120deg, #ad1d3a, #dc3e57 58%, #ff6f5f)';
    }

    return 'linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8)';
  }};

  box-shadow: ${({ $variant }) => {
    if ($variant === 'warning') {
      return '0 0.8rem 2rem rgba(236, 135, 20, 0.28)';
    }

    if ($variant === 'danger') {
      return '0 0.8rem 2rem rgba(220, 62, 87, 0.25)';
    }

    return '0 0.8rem 2rem rgba(0, 140, 255, 0.28)';
  }};

  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.82;
    cursor: not-allowed;
    transform: none;
    filter: saturate(0.9);
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 163, 255, 0.9);
    outline-offset: 2px;
  }
`;

export const MemberSectionTitle = styled.h3`
  font-size: 1.4rem;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.88);
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  margin: 0.2rem 0;
`;

export const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const MemberItem = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.8rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.9rem 1rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const MemberTitle = styled.strong`
  display: block;
  color: #ffffff;
  font-size: 1.35rem;
`;

export const MemberEmail = styled.span`
  display: block;
  margin-top: 0.25rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.2rem;
`;

export const MemberMeta = styled.div`
  margin-top: 0.45rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const MemberEditorRow = styled.div`
  display: flex-end;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.7rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const MemberRoleInput = styled.input`
  width: 100%;
  min-height: 4rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(13, 22, 45, 0.65);
  color: #ffffff;
  padding: 0 1rem;
  font-size: 1.35rem;

  &:focus {
    outline: none;
    border-color: rgba(0, 163, 255, 0.85);
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.18);
  }
`;

export const MemberBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.26rem 0.7rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ $variant }) =>
    $variant === 'current' ? '#7bc9ff' : 'rgba(255, 255, 255, 0.74)'};
  background: ${({ $variant }) =>
    $variant === 'current'
      ? 'rgba(0, 140, 255, 0.18)'
      : 'rgba(255, 255, 255, 0.08)'};
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 1rem;
  border-radius: 1rem;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.04);
  font-size: 1.35rem;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
`;

export const ModalContent = styled.div`
  padding: 1.5rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
`;

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 163, 255, 0.9);
    outline-offset: 2px;
  }
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14rem;
  height: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  margin-top: 0.8rem;
  background: linear-gradient(120deg, #cc5f04, #f08f20 58%, #f6a04f);
  color: #ffffff;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.3rem;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 163, 255, 0.9);
    outline-offset: 2px;
  }
`;
