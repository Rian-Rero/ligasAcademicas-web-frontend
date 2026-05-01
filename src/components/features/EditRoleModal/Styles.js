import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.2s ease-out;
`;

export const Content = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.98), rgba(8, 18, 34, 0.98))
      padding-box,
    linear-gradient(120deg, rgba(47, 143, 255, 0.42), rgba(246, 160, 79, 0.32))
      border-box;
  border: 1px solid transparent;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.45);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 50;
  animation: ${slideIn} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 95%;
    max-width: calc(100% - 2rem);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 1rem;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f3f4f7;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: rgba(241, 245, 255, 0.72);
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

export const Body = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  color: #f3f4f7;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  font-size: 1rem;
  color: #f3f4f7;
  background: rgba(255, 255, 255, 0.05);

  &:focus {
    outline: none;
    border-color: rgba(125, 194, 255, 0.72);
    box-shadow: 0 0 0 3px rgba(125, 194, 255, 0.12);
  }
`;

export const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  color: #f3f4f7;
  background: rgba(255, 255, 255, 0.05);

  &:focus {
    outline: none;
    border-color: rgba(125, 194, 255, 0.72);
    box-shadow: 0 0 0 3px rgba(125, 194, 255, 0.12);
  }
`;

export const ColorPickerGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

export const ColorPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.14);
  background-color: ${(props) => props.color};
`;

export const ColorInput = styled.input`
  cursor: pointer;
  width: 100%;
`;

export const Footer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SaveButton = styled(Button)`
  flex: 1;
  background: linear-gradient(120deg, #2f8fff, #4f8ef2);
  color: white;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }
`;

export const CancelButton = styled(Button)`
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(241, 245, 255, 0.88);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.14);
  }
`;
