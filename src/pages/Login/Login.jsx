import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { IoPerson } from 'react-icons/io5';
import { RiLock2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  Box,
  Button,
  ButtonContent,
  Container,
  ForgotPassword as ForgotPasswordButton,
  InputsBox,
  StyledForm,
} from './Styles';
import { buildLoginErrorMessage, loginValidationSchema } from './utils';
import { Logo } from '../../components/common';
import { FormInput } from '../../components/features';
import { useGetLeagueMembershipsOnDemand } from '../../hooks/query/leagueMembership';
import { useLogin } from '../../hooks/query/sessions';
import useAuthStore from '../../stores/auth';
import { hasAdminRole, hasManagerRole } from '../../utils/roles';
import { notifyError, notifySuccess } from '../../utils/toast';

const AUTH_INPUT_BACKGROUND =
  'linear-gradient(165deg, rgba(9, 26, 52, 0.82), rgba(10, 28, 56, 0.72))';
const AUTH_INPUT_BORDER = '1px solid rgba(170, 212, 255, 0.4)';

async function resolvePostLoginRoute(getActiveMemberships) {
  const authUser = useAuthStore.getState().auth?.user;
  if (!authUser?._id) return '/student/dashboard';

  if (hasAdminRole(authUser?.globalRole)) return '/admin/dashboard';

  if (hasManagerRole(authUser?.globalRole)) return '/manager/dashboard';

  try {
    const activeMemberships = await getActiveMemberships({
      user: authUser._id,
      isActive: true,
    });

    const hasManagementMembership = activeMemberships.some((membership) =>
      hasManagerRole(membership?.role),
    );

    return hasManagementMembership
      ? '/manager/dashboard'
      : '/student/dashboard';
  } catch {
    return '/student/dashboard';
  }
}

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mutateAsync: getActiveMemberships } =
    useGetLeagueMembershipsOnDemand();

  const { mutate: login, isPending: isLoading } = useLogin({
    onSuccess: async () => {
      notifySuccess('Login realizado com sucesso!');

      const authUser = useAuthStore.getState().auth?.user;
      if (authUser?.mustChangePassword) {
        navigate('/change-password', { replace: true });
        return;
      }

      const nextRoute = await resolvePostLoginRoute(getActiveMemberships);
      navigate(nextRoute, { replace: true });
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
              borderRadius="4rem"
              backgroundColor={AUTH_INPUT_BACKGROUND}
              customColor={theme.colors.font.white}
              borderString={AUTH_INPUT_BORDER}
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
              backgroundColor={AUTH_INPUT_BACKGROUND}
              customColor={theme.colors.font.white}
              borderString={AUTH_INPUT_BORDER}
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
            <ForgotPasswordButton
              type="button"
              disabled={isLoading}
              onClick={() => navigate('/forgot-password')}
            >
              Esqueci minha senha
            </ForgotPasswordButton>
          </InputsBox>
        </Box>
      </StyledForm>
    </Container>
  );
}
