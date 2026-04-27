import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoArrowBack, IoMail, IoPerson } from 'react-icons/io5';
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
      notifySuccess('Membro cadastrado! A senha foi enviada por e-mail.');
      reset();
    },
    onError: (err) => {
      notifyError(buildRegisterErrorMessage(err));
    },
  });

  const onSubmit = (newUserData) => createUser(newUserData);

  const handleBackToManagerDashboard = () => navigate('/manager/dashboard');

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <InputsBox>
            <Title>Cadastrar novo membro</Title>
            <Description>
              Preencha os campos para adicionar uma nova pessoa. A senha sera
              gerada automaticamente e enviada por e-mail.
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
                'Cadastrar membro'
              )}
            </Button>

            <BackToLogin
              type="button"
              disabled={isLoading}
              onClick={handleBackToManagerDashboard}
            >
              <IoArrowBack />
              Voltar ao dashboard
            </BackToLogin>
          </InputsBox>
        </Box>
      </StyledForm>
    </Container>
  );
}
