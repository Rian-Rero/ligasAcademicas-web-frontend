import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FiLock, FiSave } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  Container,
  StyledForm,
  Box,
  InputsBox,
  Title,
  Description,
  Button,
  ButtonContent,
  ErrorMessage,
} from './Styles';
import { redefinePasswordValidationSchema } from './utils';
import { Logo } from '../../components/common';
import { FormInput } from '../../components/features';
import { useRedefinePassword } from '../../hooks/query/user';
import { notifyError, notifySuccess } from '../../utils/toast';

export default function RedefinePassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(redefinePasswordValidationSchema) });

  const { mutate: redefinePassword, isPending: isLoading } =
    useRedefinePassword({
      onSuccess: () => {
        notifySuccess('Senha redefinida com sucesso!');
        navigate('/login', { replace: true });
      },
      onError: (err) => {
        const msg = err?.message || 'Erro ao redefinir senha';
        notifyError(msg);
      },
    });

  const onSubmit = ({ password }) => {
    if (!token) {
      notifyError('Token inválido');
      return;
    }

    redefinePassword({ token, password });
  };

  if (!token) {
    return (
      <Container>
        <StyledForm>
          <Logo customHeight="60%" />
          <Box>
            <InputsBox>
              <ErrorMessage>
                Link inválido. Por favor, solicite uma nova redefinição de
                senha.
              </ErrorMessage>
            </InputsBox>
          </Box>
        </StyledForm>
      </Container>
    );
  }

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Logo customHeight="60%" />

        <Box>
          <InputsBox>
            <Title>Redefinir senha</Title>
            <Description>
              Escolha uma nova senha segura para sua conta.
            </Description>

            <FormInput
              name="password"
              label="Nova senha"
              hideLabel
              type="password"
              placeholder="Digite sua nova senha (mín. 6 caracteres)"
              icon={FiLock}
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
              placeholder="Confirme sua nova senha"
              icon={FiLock}
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
                  Salvando...
                </ButtonContent>
              ) : (
                <ButtonContent>
                  <FiSave />
                  Redefinir senha
                </ButtonContent>
              )}
            </Button>
          </InputsBox>
        </Box>
      </StyledForm>
    </Container>
  );
}
