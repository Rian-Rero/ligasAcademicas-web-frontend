import styled from 'styled-components';

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
  color: rgba(255, 255, 255, 0.68);
  font-size: 2rem;
  pointer-events: none;
`;

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'error',
})`
  height: clamp(4rem, 4.1vw, 4.6rem);
  font-size: 1.8rem;
  padding: 0.8rem 1.6rem;
  padding-left: 4rem;
  border-radius: ${(props) => props.borderradius ?? '0.4rem'};
  width: 100%;
  color: ${(props) => props.customColor ?? '#ffffff'};
  border: ${(props) =>
    props.error
      ? '0.2rem red solid'
      : (props.borderString ?? '1px solid rgba(255, 255, 255, 0.28)')};
  background-color: ${(props) =>
    props.backgroundcolor
      ? props.backgroundcolor
      : 'rgba(255, 255, 255, 0.06)'};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.72);
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 140, 255, 0.75);
    background-color: rgba(255, 255, 255, 0.09);
    box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.22);
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
