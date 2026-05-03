import styled, { css } from 'styled-components';

export const Content = styled.div`
  padding: clamp(1.6rem, 2vw, 2.4rem);
  max-width: 1200px;
  margin: 0 auto;
  color: #ffffff;

  @media (max-width: 768px) {
    padding: 1.6rem;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: clamp(2.2rem, 2.6vw, 3rem);
  font-weight: 800;
  letter-spacing: 0.01em;
  color: #ffffff;
  margin: 0 0 8px 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 1.45rem;
  color: rgba(255, 255, 255, 0.72);
  margin: 0;
  max-width: 64rem;
`;

const panelSurface = css`
  background:
    linear-gradient(165deg, rgba(26, 49, 104, 0.95), rgba(13, 22, 45, 0.92))
      padding-box,
    linear-gradient(135deg, rgba(0, 140, 255, 0.72), rgba(255, 160, 90, 0.72))
      border-box;
  border: 1px solid transparent;
  box-shadow:
    0 1.4rem 3.6rem rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5.6rem 2.4rem;
  text-align: center;
  ${panelSurface};
  border-radius: 2rem;

  h3 {
    margin: 1.6rem 0 0.8rem 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: #ffffff;
  }

  p {
    margin: 0;
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.72);
  }
`;

export const TasksContainer = styled.div`
  display: grid;
  gap: 1.6rem;
`;

export const TaskCard = styled.div`
  ${panelSurface};
  border-radius: 1.8rem;
  padding: 1.6rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  ${(props) =>
    props.completed &&
    `
    opacity: 0.9;
    background:
      linear-gradient(165deg, rgba(20, 30, 46, 0.96), rgba(12, 18, 30, 0.92)) padding-box,
      linear-gradient(135deg, rgba(148, 163, 184, 0.42), rgba(255, 255, 255, 0.08)) border-box;
  `}

  ${(props) =>
    props.overdue &&
    `
    background:
      linear-gradient(165deg, rgba(72, 16, 34, 0.95), rgba(25, 11, 20, 0.95)) padding-box,
      linear-gradient(135deg, rgba(255, 99, 99, 0.7), rgba(255, 184, 107, 0.55)) border-box;
  `}
  
  &:hover {
    ${(props) =>
      !props.completed &&
      `
      transform: translateY(-2px);
      box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.32);
    `}
  }
`;

export const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
`;

export const TaskCardTitle = styled.h3`
  margin: 0 0 6px 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
`;

export const TaskCardDescription = styled.p`
  margin: 0;
  font-size: 1.35rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const TaskCardMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.72);

  div {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export const TaskCardActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const CompleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.85rem 1.2rem;
  background: linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-size: 1.25rem;
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
    opacity: 0.78;
    cursor: not-allowed;
  }
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.85rem 1.2rem;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: not-allowed;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PriorityBadge = styled.span`
  display: inline-block;
  padding: 0.45rem 1rem;
  background: ${(props) => props.color}22;
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.color}40;
  border-radius: 999px;
  font-size: 1.15rem;
  font-weight: 800;
  white-space: nowrap;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.45rem 1rem;
  background: ${(props) =>
    props.completed ? 'rgba(16, 185, 129, 0.16)' : 'rgba(239, 68, 68, 0.16)'};
  color: ${(props) => (props.completed ? '#b7ffd9' : '#ffb3b3')};
  border: 1px solid
    ${(props) =>
      props.completed ? 'rgba(16, 185, 129, 0.22)' : 'rgba(239, 68, 68, 0.22)'};
  border-radius: 999px;
  font-size: 1.15rem;
  font-weight: 800;
  white-space: nowrap;
`;

export const DueDateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.78);

  ${(props) => props.overdue && `color: #ff9d9d; font-weight: 700;`}
`;

export const ConfirmDialog = styled.div`
  width: min(92vw, 42rem);
  background:
    linear-gradient(165deg, rgba(12, 20, 38, 0.98), rgba(9, 15, 28, 0.94))
      padding-box,
    linear-gradient(135deg, rgba(0, 140, 255, 0.7), rgba(255, 160, 90, 0.72))
      border-box;
  border: 1px solid transparent;
  border-radius: 2rem;
  box-shadow: 0 2.2rem 5rem rgba(0, 0, 0, 0.42);
  overflow: hidden;
  z-index: 1000;
`;

export const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(3, 7, 18, 0.72);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
`;

export const DialogContent = styled.div`
  padding: 2.4rem;

  h2 {
    margin: 0 0 12px 0;
    font-size: 1.8rem;
    font-weight: 800;
    color: #ffffff;
  }

  p {
    margin: 0;
    font-size: 1.35rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.5;
  }
`;

export const DialogButtons = styled.div`
  display: flex;
  gap: 8px;
  padding: 1.6rem 2.4rem 2.4rem;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

export const DialogButton = styled.button`
  padding: 0.95rem 1.6rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) => {
    if (props.variant === 'danger') {
      return `
        background: linear-gradient(120deg, #ef4444, #dc2626);
        color: white;
        &:hover:not(:disabled) {
          transform: translateY(-1px);
        }
      `;
    }
    return `
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.12);
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        transform: translateY(-1px);
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
