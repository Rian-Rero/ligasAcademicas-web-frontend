import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props) => props.theme.fonts.openSans};
  font-style: normal;
  font-weight: 500;
  gap: 0.5rem;

  width: 100%;
`;

export const Label = styled.label`
  color: #ffffff;
  font-size: 2.4rem;

  ${({ $visuallyHidden }) =>
    $visuallyHidden &&
    css`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `}

  @media (max-width: 700px) {
    font-size: 2rem;
  }
  @media (max-width: 370px) {
    font-size: 1.5rem;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Icon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(226, 240, 255, 0.8);
  font-size: 2rem;
  pointer-events: none;
`;

export const Input = styled.input`
  height: clamp(4rem, 4.1vw, 4.6rem);
  font-size: 1.8rem;
  padding: 0.8rem 1.6rem;
  padding-left: 4rem;
  border-radius: ${(props) => props.$borderRadius ?? '0.4rem'};
  width: 100%;
  color: ${(props) => props.$customColor ?? '#ffffff'};
  border: ${(props) =>
    props.$error
      ? '0.2rem red solid'
      : (props.$borderString ?? '1px solid rgba(167, 206, 255, 0.38)')};
  background: ${(props) =>
    props.$backgroundColor
      ? props.$backgroundColor
      : 'linear-gradient(165deg, rgba(8, 22, 44, 0.78), rgba(11, 29, 54, 0.68))'};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 10px 24px rgba(0, 0, 0, 0.24);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &::placeholder {
    color: rgba(225, 239, 255, 0.82);
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 140, 255, 0.75);
    color: ${(props) => props.$customColor ?? '#ffffff'};

    background: linear-gradient(
      165deg,
      rgba(10, 27, 54, 0.9),
      rgba(12, 34, 66, 0.82)
    );
    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.22),
      0 12px 28px rgba(0, 0, 0, 0.28);
  }

  @media (max-width: 700px) {
    font-weight: 400;
    font-size: 1.6rem;
    line-height: 2rem;
    height: 4rem;
    padding-left: 3.8rem;
  }

  @media (max-width: 370px) {
    font-size: 1.4rem;
  }
`;

export const ErrorMessage = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2rem;
  color: red;

  @media (max-width: 700px) {
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 1.7rem;
  }

  @media (max-width: 370px) {
    font-size: 1.2rem;
  }
`;
