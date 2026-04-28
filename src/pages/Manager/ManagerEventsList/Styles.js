import styled, { css } from 'styled-components';

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
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

export const EventsCard = styled.article`
  ${panelSurface};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 58rem;
`;

export const EditorCard = styled.form`
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

export const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 64rem;
  overflow-y: auto;
  padding-right: 0.3rem;
`;

export const EventItem = styled.button`
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

export const EventTitle = styled.div`
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

export const EventMeta = styled.div`
  margin-top: 0.65rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
`;

export const EventMetaItem = styled.span`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
`;

export const EventBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: ${({ $variant }) =>
    $variant === 'squad'
      ? 'rgba(0, 255, 128, 0.16)'
      : 'rgba(255, 183, 0, 0.16)'};
  color: ${({ $variant }) => ($variant === 'squad' ? '#a8ffbf' : '#ffd56a')};
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

export const ErrorMessage = styled.span`
  color: #ff8d8d;
  font-size: 1.2rem;
`;

export const HelperText = styled.span`
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.15rem;
`;

export const FullRow = styled.div`
  grid-column: 1 / -1;
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
      : '0 0.8rem 2rem rgba(0, 140, 255, 0.28)'};

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

export const EmptyState = styled.p`
  margin: 0;
  padding: 1rem;
  border-radius: 1rem;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.04);
  font-size: 1.35rem;
`;
