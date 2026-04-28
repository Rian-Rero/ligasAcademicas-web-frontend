import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const riseUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 1.6rem;
  background: linear-gradient(
    180deg,
    rgba(4, 8, 18, 0.78),
    rgba(7, 15, 30, 0.9)
  );
  backdrop-filter: blur(6px);
  animation: ${fadeIn} 0.2s ease;
`;

export const DialogCard = styled.section`
  width: min(44rem, 100%);
  border-radius: 2rem;
  padding: 1.6rem;
  border: 2px solid transparent;
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.95), rgba(8, 18, 34, 0.95))
      padding-box,
    linear-gradient(120deg, rgba(0, 163, 255, 0.65), rgba(255, 140, 0, 0.6))
      border-box;
  box-shadow:
    0 1.6rem 3rem rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  animation: ${riseUp} 0.25s ease;
`;

export const DialogHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
`;

export const DialogTitle = styled.h3`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const DialogContent = styled.div`
  margin-top: 1rem;
  display: grid;
  gap: 0.8rem;
`;

export const DialogDescription = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.35rem;
`;

const actionBase = css`
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.85rem 1.4rem;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Actions = styled.div`
  margin-top: 1.4rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;

  button {
    ${actionBase};
  }

  button:first-child {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
  }

  button:last-child {
    background: linear-gradient(120deg, #cc5f04, #f08f20 58%, #f6a04f);
    box-shadow: 0 0.8rem 2rem rgba(236, 135, 20, 0.28);
    color: #ffffff;
  }
`;
