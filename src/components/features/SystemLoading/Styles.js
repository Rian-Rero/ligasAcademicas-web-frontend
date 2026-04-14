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

const dotTrail = keyframes`
  0%, 20% {
    opacity: 0;
  }

  45%, 100% {
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 100% 50%;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.9rem;

  width: 100%;
  min-height: 100dvh;
  min-height: 100vh;
  padding: 1.6rem;
`;

export const Logo = styled.img`
  width: 60%;
  height: auto;
  animation: ${pulse} 1.3s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(0, 140, 255, 0.25))
    drop-shadow(0 0 40px rgba(255, 140, 0, 0.15));
`;

export const Title = styled.p`
  align-self: center;
  margin: 0;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: ${(props) => props.theme.fonts.openSans};

  &::after {
    content: '...';
    display: inline-block;
    width: 1.8rem;
    margin-left: 0.15rem;
    overflow: hidden;
    vertical-align: bottom;
    animation: ${dotTrail} 1.1s ease-in-out infinite;
  }
`;

export const NameTag = styled.span`
  margin-top: -0.2rem;
  padding: 0.35rem 0.95rem;
  border-radius: 999px;

  background: linear-gradient(120deg, #008cff, #2b66ff, #0b9de8);
  background-size: 200% 200%;

  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  box-shadow:
    0 0.65rem 1.6rem rgba(0, 140, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  animation: ${shimmer} 1.8s linear infinite;
`;

export const Message = styled.small`
  max-width: 31rem;
  margin-top: 0.2rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.98rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.45;
`;
