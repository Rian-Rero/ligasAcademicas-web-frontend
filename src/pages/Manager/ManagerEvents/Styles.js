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
  max-width: 64rem;
`;

export const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
  gap: 1.5rem;

  @media (max-width: 1100px) {
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

export const EditorCard = styled.form`
  ${panelSurface};
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const PreviewCard = styled.article`
  ${panelSurface};
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
  border: 1px solid rgba(167, 206, 255, 0.38);
  background: linear-gradient(
    165deg,
    rgba(8, 22, 44, 0.78),
    rgba(11, 29, 54, 0.68)
  );
  color: #ffffff;
  padding: 0 1rem;
  font-size: clamp(1.2rem, 1.3vw, 1.5rem);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 10px 24px rgba(0, 0, 0, 0.24);
  transition: all 0.25s ease;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: rgba(0, 140, 255, 0.75);
    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.22),
      0 12px 28px rgba(0, 0, 0, 0.28);
    background: linear-gradient(
      165deg,
      rgba(10, 27, 54, 0.9),
      rgba(12, 34, 66, 0.82)
    );
  }

  &:hover {
    border-color: rgba(0, 140, 255, 0.5);
    filter: brightness(1.02);
  }
`;

export const TextInput = styled.input`
  ${fieldStyles};
`;

export const SelectInput = styled.select`
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237dc2ff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 3rem;
  cursor: pointer;

  option {
    background: #0b1d36;
    color: #ffffff;
    font-weight: 500;
  }

  &:focus {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237dc2ff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
  }

  @media (max-width: 600px) {
    padding-right: 2.8rem;
    background-position: right 0.8rem center;
  }
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

export const PreviewTitle = styled.h2`
  font-size: clamp(1.6rem, 1.6vw, 2rem);
  margin: 0;
`;

export const PreviewList = styled.div`
  display: grid;
  gap: 0.9rem;
`;

export const PreviewItem = styled.div`
  display: grid;
  gap: 0.3rem;
  padding: 0.8rem 1rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
`;

export const PreviewLabel = styled.span`
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.6);
`;

export const PreviewValue = styled.strong`
  font-size: 1.4rem;
  color: #ffffff;
`;

export const ScopeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 1.15rem;
  font-weight: 700;
  background: ${({ $variant }) =>
    $variant === 'squad'
      ? 'rgba(0, 255, 128, 0.16)'
      : 'rgba(255, 183, 0, 0.16)'};
  color: ${({ $variant }) => ($variant === 'squad' ? '#a8ffbf' : '#ffd56a')};
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 1rem;
  border-radius: 1rem;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.04);
  font-size: 1.35rem;
`;
