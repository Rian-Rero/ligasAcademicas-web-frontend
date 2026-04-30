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

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
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
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.25fr);
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

export const ListCard = styled.article`
  ${panelSurface};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 58rem;
`;

export const FormCard = styled.form`
  ${panelSurface};
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 1.7vw, 1.9rem);
  line-height: 1.1;
  letter-spacing: 0.03em;
`;

export const EntityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 64rem;
  overflow-y: auto;
  padding-right: 0.3rem;
`;

export const EntityItem = styled.button`
  width: 100%;
  border: 1px solid transparent;
  border-radius: 1.2rem;
  padding: 1rem;
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

export const EntityTitle = styled.div`
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

export const EntityMeta = styled.div`
  margin-top: 0.65rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;

  span {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const EntityBadge = styled.span`
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

const fieldStyles = css`
  width: 100%;
  min-height: 4.4rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(13, 22, 45, 0.65);
  color: #ffffff;
  padding: 0 1rem;
  font-size: 1.4rem;

  &:focus {
    outline: none;
    border-color: rgba(0, 163, 255, 0.85);
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.18);
  }
`;

export const TextInput = styled.input`
  ${fieldStyles};
`;

export const SelectInput = styled.select`
  ${fieldStyles};
`;

export const TextArea = styled.textarea`
  ${fieldStyles};
  min-height: 9.4rem;
  padding: 0.9rem 1rem;
  resize: vertical;
`;

export const HelperText = styled.span`
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.15rem;
`;

export const ErrorMessage = styled.span`
  color: #ff8d8d;
  font-size: 1.2rem;
`;

export const EmptyState = styled.div`
  padding: 1.4rem;
  border-radius: 1.2rem;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.35rem;
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.8rem;
`;

export const ActionButton = styled.button`
  min-height: 4.3rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 0 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $variant }) =>
    $variant === 'warning'
      ? 'linear-gradient(120deg, #cc5f04, #f08f20 58%, #f6a04f)'
      : 'linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8)'};
  box-shadow: ${({ $variant }) =>
    $variant === 'warning'
      ? '0 0.8rem 2rem rgba(236, 135, 20, 0.28)'
      : '0 0.8rem 2rem rgba(0, 117, 255, 0.22)'};
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    transform: none;
  }
`;
