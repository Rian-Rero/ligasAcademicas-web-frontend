import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoArrowBack, IoMail } from 'react-icons/io5';
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
import {
  buildForgotPasswordErrorMessage,
  forgotPasswordValidationSchema,
} from './utils';
import { Logo } from '../../components/common';
import { FormInput } from '../../components/features';
import { useForgotPassword } from '../../hooks/query/user';
import { notifyError, notifySuccess } from '../../utils/toast';

export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordValidationSchema) });

  const { mutate: requestForgotPassword, isPending: isLoading } =
    useForgotPassword({
      onSuccess: () => {
        notifySuccess('Link de redefinição enviado para seu e-mail!');
        reset();
      },
      onError: (err) => {
        notifyError(buildForgotPasswordErrorMessage(err));
      },
    });

  const onSubmit = ({ email }) => requestForgotPassword(email);
  const handleBackToLogin = () => navigate('/login');

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Logo customHeight="60%" />

        <Box>
          <InputsBox>
            <Title>Recuperar senha</Title>
            <Description>
              Digite o e-mail da sua conta para receber um link de redefinição.
            </Description>

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

            <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
              {isLoading ? (
                <ButtonContent>
                  <ClipLoader
                    size={18}
                    color={theme.colors.white}
                    speedMultiplier={0.9}
                  />
                  Enviando...
                </ButtonContent>
              ) : (
                'Enviar link de redefinição'
              )}
            </Button>

            <BackToLogin
              type="button"
              disabled={isLoading}
              onClick={handleBackToLogin}
            >
              <IoArrowBack />
              Voltar para login
            </BackToLogin>
          </InputsBox>
        </Box>
      </StyledForm>
    </Container>
  );
}
