import styled from 'styled-components';

export const Content = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
`;

export const HeaderSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px dashed #e2e8f0;

  h3 {
    margin: 16px 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
  }
`;

export const TasksContainer = styled.div`
  display: grid;
  gap: 16px;
`;

export const TaskCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;

  ${(props) =>
    props.completed &&
    `
    opacity: 0.7;
    border-color: #d1d5db;
    background: #f9fafb;
  `}

  ${(props) =>
    props.overdue &&
    `
    border-left: 4px solid #ef4444;
    background: #fef2f2;
  `}
  
  &:hover {
    ${(props) =>
      !props.completed &&
      `
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
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
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
`;

export const TaskCardDescription = styled.p`
  margin: 0;
  font-size: 13px;
  color: #64748b;
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
  font-size: 13px;
  color: #64748b;
  flex-wrap: wrap;

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
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: not-allowed;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
  }
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
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
  padding: 4px 10px;
  background: ${(props) => props.color}20;
  color: ${(props) => props.color};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const UserBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const DueDateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${(props) => props.overdue && `color: #ef4444; font-weight: 600;`}
`;

export const ConfirmDialog = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  overflow: hidden;
  z-index: 1000;
`;

export const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 16px;
`;

export const DialogContent = styled.div`
  padding: 24px;

  h2 {
    margin: 0 0 12px 0;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
  }
`;

export const DialogButtons = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  justify-content: flex-end;
`;

export const DialogButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) => {
    if (props.variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover:not(:disabled) {
          background: #dc2626;
        }
      `;
    }
    return `
      background: white;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      &:hover {
        background: #f1f5f9;
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
