import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.03);
    opacity: 0.88;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;

  width: 100%;
  min-height: 100dvh;
  min-height: 100vh;
`;

export const Logo = styled.img`
  width: clamp(400px, 32vw, 500px);
  height: auto;
  animation: ${pulse} 1.3s ease-in-out infinite;
`;

export const Text = styled.p`
  align-self: center;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: ${(props) => props.theme.fonts.openSans};
`;
