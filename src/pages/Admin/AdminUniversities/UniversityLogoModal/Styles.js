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
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.72);
  z-index: 100;
  animation: ${fadeIn} 0.2s ease-out;
  padding: 1rem;
`;

export const Modal = styled.div`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 1.4rem rgba(0, 140, 255, 0.25);
  border-radius: 2.4rem;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.3s ease-out;
  overflow: hidden;

  @media (max-width: 600px) {
    border-radius: 1.6rem;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(1.2rem, 2vw, 1.8rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ModalTitle = styled.h2`
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  line-height: 1.2;
  color: #ffffff;
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  border-radius: 0.6rem;
  transition: all 0.2s ease-out;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: clamp(1.5rem, 2vw, 2rem);
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

export const PreviewContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 1.6rem;
  background: rgba(0, 140, 255, 0.1);
  border: 2px dashed rgba(0, 140, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 600px) {
    border-radius: 1.2rem;
    max-height: 300px;
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PreviewEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);

  svg {
    font-size: 2.8rem;
    color: #a6d0ff;
  }

  strong {
    color: #ffffff;
    font-size: 1.35rem;
  }

  span {
    font-size: 1.1rem;
    line-height: 1.35;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: clamp(1.2rem, 2vw, 1.8rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;

  @media (max-width: 400px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export const ModalButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.8rem 1.4rem;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.2s ease-out;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
  }

  &:active:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 400px) {
    padding: 0.9rem 1rem;
    font-size: 1.2rem;
  }
`;
