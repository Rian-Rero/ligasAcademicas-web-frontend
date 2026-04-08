import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoPerson } from 'react-icons/io5';
import { RiLock2Fill } from 'react-icons/ri';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  Box,
  Button,
  ButtonContent,
  Container,
  ForgotPassword,
  InputsBox,
  StyledForm,
} from './Styles';
import { buildLoginErrorMessage, loginValidationSchema } from './utils';
import { Logo } from '../../components/common';
import { FormInput } from '../../components/features';
import { useLogin } from '../../hooks/query/sessions';
import { notifyError, notifySuccess } from '../../utils/toast';

export default function Login() {
  const theme = useTheme();
  const { mutate: login, isPending: isLoading } = useLogin({
    onSuccess: () => {
      notifySuccess('Login realizado com sucesso!');
    },
    onError: (err) => {
      notifyError(buildLoginErrorMessage(err));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginValidationSchema) });

  const onSubmit = (data) => login(data);

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Logo customHeight="60%" />
        <Box>
          <InputsBox>
            <FormInput
              name="email"
              label="E-mail"
              hideLabel
              type="email"
              placeholder="Digite aqui seu email"
              icon={IoPerson}
              register={register}
              errors={errors}
              rules={{
                required: 'E-mail e obrigatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Digite um e-mail valido',
                },
              }}
              borderRadius="4rem"
              customColor={theme.colors.font.white}
              borderString={`1px solid ${theme.colors.white}`}
            />
            <FormInput
              name="password"
              label="Senha"
              hideLabel
              type="password"
              placeholder="Digite aqui sua senha"
              icon={RiLock2Fill}
              register={register}
              errors={errors}
              rules={{
                required: 'Senha e obrigatoria',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres',
                },
              }}
              borderRadius="4rem"
              customColor={theme.colors.font.white}
              borderString={`1px solid ${theme.colors.white}`}
            />
            <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? (
                <ButtonContent>
                  <ClipLoader
                    size={18}
                    color={theme.colors.white}
                    speedMultiplier={0.9}
                  />
                  Entrando...
                </ButtonContent>
              ) : (
                'Entrar'
              )}
            </Button>
            <ForgotPassword type="button" disabled={isLoading}>
              Esqueci minha senha
            </ForgotPassword>
          </InputsBox>
        </Box>
      </StyledForm>
    </Container>
  );
}
