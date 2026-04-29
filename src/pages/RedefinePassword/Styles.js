import styled from 'styled-components';

import {
  Box as LoginBox,
  Button as LoginButton,
  ButtonContent as LoginButtonContent,
  Container as LoginContainer,
  InputsBox as LoginInputsBox,
  StyledForm as LoginStyledForm,
} from '../Login/Styles';

export const Container = styled(LoginContainer)``;

export const StyledForm = styled(LoginStyledForm)``;

export const Box = styled(LoginBox)`
  min-height: 34rem;
`;

export const InputsBox = styled(LoginInputsBox)`
  justify-content: center;
  margin-top: 0;
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
  max-width: 34rem;
  color: rgba(255, 255, 255, 0.86);
  font-size: clamp(1.4rem, 1.6vw, 1.6rem);
  font-weight: 500;
  line-height: 1.45;
  text-align: center;
`;

export const Button = styled(LoginButton)``;

export const ButtonContent = styled(LoginButtonContent)``;

export const ErrorMessage = styled.p`
  margin: 0;
  color: #fca5a5;
  font-size: 16px;
  text-align: center;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(244, 63, 63, 0.3);
  border-radius: 8px;
`;
