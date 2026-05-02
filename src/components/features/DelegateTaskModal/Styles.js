import * as Dialog from '@radix-ui/react-dialog';
import styled, { css } from 'styled-components';

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.72);
  backdrop-filter: blur(10px);
  z-index: 40;
`;

export const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(92vw, 64rem);
  max-height: 90vh;
  overflow-y: auto;
  z-index: 50;
  border-radius: 2.4rem;
  border: 1px solid transparent;
  background:
    linear-gradient(165deg, rgba(12, 20, 38, 0.98), rgba(9, 15, 28, 0.94))
      padding-box,
    linear-gradient(135deg, rgba(0, 140, 255, 0.72), rgba(255, 172, 77, 0.7))
      border-box;
  box-shadow:
    0 2.8rem 7rem rgba(0, 0, 0, 0.58),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  color: #ffffff;

  @media (max-width: 640px) {
    width: min(95vw, 100%);
    max-height: 92vh;
    border-radius: 2rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2.4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);

  @media (max-width: 640px) {
    padding: 1.6rem;
  }
`;

export const Title = styled(Dialog.Title)`
  font-size: clamp(1.7rem, 1.8vw, 2rem);
  font-weight: 800;
  letter-spacing: 0.01em;
  color: #ffffff;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.82);
  padding: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    transform: translateY(-1px);
  }
`;

export const Body = styled.div`
  padding: 2.4rem;

  @media (max-width: 640px) {
    padding: 1.6rem;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 1.6rem 2.4rem 2.4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);

  @media (max-width: 640px) {
    padding: 1.6rem;
    flex-direction: column-reverse;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.6rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.78);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`;

const fieldBase = css`
  width: 100%;
  min-height: 4.8rem;
  padding: 0 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1.2rem;
  font-size: 1.4rem;
  font-family: inherit;
  background: rgba(13, 22, 45, 0.82);
  color: #ffffff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.42);
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 163, 255, 0.9);
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.18);
    background: rgba(13, 22, 45, 0.96);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  ${fieldBase};
`;

export const Textarea = styled.textarea`
  ${fieldBase};
  resize: vertical;
  min-height: 11rem;
  padding-top: 1.1rem;
  padding-bottom: 1.1rem;

  @media (max-width: 640px) {
    min-height: 10rem;
  }
`;

export const DateInput = styled(Input)``;

export const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Select = styled.select`
  ${fieldBase};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23dbeafe' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
`;

export const PriorityGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const PriorityOption = styled.button`
  min-height: 4.4rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.82);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;

  ${(props) =>
    props.selected &&
    `
    border-color: ${props.color};
    background: linear-gradient(120deg, ${props.color}35, ${props.color}18);
    color: #ffffff;
    box-shadow: 0 0.8rem 2rem ${props.color}22;
  `}

  &:hover:not(:disabled) {
    border-color: ${(props) => props.color};
    background: ${(props) => props.color}16;
    color: #ffffff;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 1.2rem;
  color: #ff9d9d;
  font-weight: 600;
`;

export const SaveButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 1.35rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.05);
    box-shadow: 0 1rem 2.4rem rgba(0, 140, 255, 0.32);
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
    filter: saturate(0.85);
  }
`;

export const CancelButton = styled.button`
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  font-size: 1.35rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.11);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
