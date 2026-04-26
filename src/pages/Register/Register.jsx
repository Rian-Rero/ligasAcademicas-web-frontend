import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoArrowBack, IoMail, IoPerson } from 'react-icons/io5';
import { RiLock2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  BackToLogin,
  Box,
  Button,
  ButtonContent,
  Container,
  Description,
  InputsBox,
  StyledForm,
  Title,
} from './Styles';
import { buildRegisterErrorMessage, registerValidationSchema } from './utils';
import { Logo } from '../../components/common';
import { FormInput } from '../../components/features';
import { useCreateUser } from '../../hooks/query/user';
import { notifyError, notifySuccess } from '../../utils/toast';

export default function Register() {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerValidationSchema) });

  const { mutate: createUser, isPending: isLoading } = useCreateUser({
    onSuccess: () => {
      notifySuccess('Cadastro realizado com sucesso! Verifique seu e-mail.');
      reset();
      navigate('/login');
    },
    onError: (err) => {
      notifyError(buildRegisterErrorMessage(err));
    },
  });

  const onSubmit = ({ confirmPassword, ...newUserData }) => {
    createUser(newUserData);
  };

  const handleBackToLogin = () => navigate('/login');

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Logo customHeight="60%" />

        <Box>
          <InputsBox>
            <Title>Criar conta</Title>
            <Description>
              Preencha os campos para criar sua conta e acessar o sistema.
            </Description>

            <FormInput
              name="name"
              label="Nome"
              hideLabel
              placeholder="Digite aqui seu nome"
              icon={IoPerson}
              register={register}
              errors={errors}
              borderRadius="4rem"
              customColor={theme.colors.font.white}
              borderString={`1px solid ${theme.colors.white}`}
            />

            <FormInput
              name="email"
              label="E-mail"
              hideLabel
              type="email"
              placeholder="Digite aqui seu email"
              icon={IoMail}
              register={register}
              errors={errors}
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
              borderRadius="4rem"
              customColor={theme.colors.font.white}
              borderString={`1px solid ${theme.colors.white}`}
            />

            <FormInput
              name="confirmPassword"
              label="Confirmar senha"
              hideLabel
              type="password"
              placeholder="Confirme sua senha"
              icon={RiLock2Fill}
              register={register}
              errors={errors}
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
                  Cadastrando...
                </ButtonContent>
              ) : (
                'Criar conta'
              )}
            </Button>

            <BackToLogin
              type="button"
              disabled={isLoading}
              onClick={handleBackToLogin}
            >
              <IoArrowBack />
              Já tenho conta
            </BackToLogin>
          </InputsBox>
        </Box>
      </StyledForm>
    </Container>
  );
}
