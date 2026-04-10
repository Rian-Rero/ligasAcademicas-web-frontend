import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: clamp(1.6rem, 3vw, 3.2rem);
`;

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: clamp(1.6rem, 2vw, 2.4rem);

  width: min(92vw, 46rem);
  min-height: clamp(50rem, 72vh, 64rem);
  padding: clamp(1.8rem, 2vw, 2.6rem);
  border-radius: 2.8rem;
  border: 1px solid transparent;

  background:
    linear-gradient(165deg, rgba(7, 18, 35, 0.86), rgba(11, 29, 54, 0.58))
      padding-box,
    linear-gradient(
        130deg,
        rgba(0, 140, 255, 0.72),
        rgba(0, 80, 255, 0.64),
        rgba(255, 255, 255, 0.42)
      )
      border-box;

  box-shadow:
    0 2.4rem 5.4rem rgba(0, 0, 0, 0.48),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  backdrop-filter: blur(10px);

  @media (max-width: 700px) {
    min-height: auto;
    padding: 1.8rem;
    border-radius: 2.2rem;
  }
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: auto;
  padding: clamp(2.4rem, 2.5vw, 3.2rem);
  border-radius: 2.2rem;
  border: 1px solid rgba(255, 255, 255, 0.26);

  background: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.09),
    rgba(255, 255, 255, 0.02)
  );

  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);

  @media (max-width: 700px) {
    border-radius: 1.8rem;
    padding: 2rem;
  }
`;

export const InputsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.4rem, 1.8vw, 2rem);
  width: 100%;
  height: 100%;
`;

export const Title = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: clamp(2rem, 2.4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  text-align: center;
`;

export const Description = styled.p`
  margin: 0;
  max-width: 40rem;
  color: rgba(255, 255, 255, 0.88);
  font-size: clamp(1.3rem, 1.5vw, 1.5rem);
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
`;

export const Message = styled.p`
  margin: 0;
  max-width: 40rem;
  color: rgba(255, 255, 255, 0.76);
  font-size: clamp(1.1rem, 1.2vw, 1.35rem);
  font-weight: 400;
  line-height: 1.6;
  text-align: center;
`;

export const Button = styled.button`
  width: 100%;
  height: clamp(4rem, 4.2vw, 4.6rem);
  margin-top: 1rem;
  border-radius: 4rem;
  border: 1px solid rgba(255, 255, 255, 0.42);

  background: linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8);
  color: ${({ theme }) => theme?.colors?.font?.white || '#ffffff'};
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;

  box-shadow:
    0 0.8rem 2rem rgba(0, 140, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
    box-shadow:
      0 1.1rem 2.4rem rgba(0, 140, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.35),
      0 1rem 2rem rgba(0, 140, 255, 0.35);
  }
`;
