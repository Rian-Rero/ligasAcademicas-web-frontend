import { useForm } from 'react-hook-form';
import { IoPerson } from 'react-icons/io5';
import { RiLock2Fill } from 'react-icons/ri';
import { useTheme } from 'styled-components';

import {
  Box,
  Button,
  Container,
  ForgotPassword,
  InputsBox,
  StyledForm,
} from './Styles';
import { Logo } from '../../components/common';
import { FormInput } from '../../components/features';

export default function Login() {
  const theme = useTheme();
  const {
    register,
    formState: { errors },
  } = useForm(); // Form Validation must be replaced

  return (
    <Container>
      <StyledForm onSubmit={(event) => event.preventDefault()}>
        <Logo customHeight="60%" />
        <Box>
          <InputsBox>
            <FormInput
              name="email"
              placeholder="Digite aqui seu email"
              icon={IoPerson}
              register={register}
              errors={errors}
              borderRadius="4rem"
              customColor={theme.colors.font.white}
              borderString={`1px solid ${theme.colors.white}`}
            />
            <FormInput
              name="password"
              placeholder="Digite aqui sua senha"
              icon={RiLock2Fill}
              register={register}
              errors={errors}
              borderRadius="4rem"
              customColor={theme.colors.font.white}
              borderString={`1px solid ${theme.colors.white}`}
            />
            <Button type="submit">Entrar</Button>
            <ForgotPassword type="button">Esqueci minha senha</ForgotPassword>
          </InputsBox>
        </Box>
      </StyledForm>
    </Container>
  );
}
