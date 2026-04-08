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
  width: 60%;
  height: auto;
  animation: ${pulse} 1.3s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(0, 140, 255, 0.25))
    drop-shadow(0 0 40px rgba(255, 140, 0, 0.15));
`;

export const Text = styled.p`
  align-self: center;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: ${(props) => props.theme.fonts.openSans};
`;
