import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AvatarMenuContainer = styled.div`
  position: relative;
`;

export const AvatarMenuButton = styled.button`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center / cover no-repeat`
      : 'radial-gradient(circle at top left, #57b8ff 10%, #0f2f6e 60%)'};
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-out;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 1.2rem rgba(0, 140, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 600px) {
    width: 3.6rem;
    height: 3.6rem;
    font-size: 1.2rem;
  }
`;

export const AvatarMenuContent = styled.div`
  position: absolute;
  top: calc(100% + 0.8rem);
  right: 0;
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  border-radius: 1.2rem;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 0 1.2rem rgba(0, 140, 255, 0.2);
  overflow: hidden;
  z-index: 50;
  animation: ${slideDown} 0.2s ease-out;
  min-width: 180px;

  @media (max-width: 600px) {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
`;

export const AvatarMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1rem 1.2rem;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease-out;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'danger'
        ? 'rgba(239, 68, 68, 0.15)'
        : 'rgba(0, 140, 255, 0.15)'};
    color: ${({ $variant }) => ($variant === 'danger' ? '#ff6b6b' : '#a6d0ff')};
  }

  &:active {
    background: ${({ $variant }) =>
      $variant === 'danger'
        ? 'rgba(239, 68, 68, 0.25)'
        : 'rgba(0, 140, 255, 0.25)'};
  }

  svg {
    font-size: 1.5rem;
  }
`;
