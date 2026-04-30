import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FiLock, FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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
} from './Styles';
import {
  changePasswordValidationSchema,
  changePasswordValidationSchemaForced,
} from './utils';
import { Logo } from '../../components/common';
import { FormInput } from '../../components/features';
import { useGetLeagueMembershipsOnDemand } from '../../hooks/query/leagueMembership';
import { useChangeUserPassword } from '../../hooks/query/user';
import useAuthStore from '../../stores/auth';
import { hasAdminRole, hasManagerRole } from '../../utils/roles';
import { notifyError, notifySuccess } from '../../utils/toast';

async function resolvePostChangePasswordRoute(getActiveMemberships) {
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

export default function ChangePassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.auth?.user);
  const { mutateAsync: getActiveMemberships } =
    useGetLeagueMembershipsOnDemand();

  const schema = authUser?.mustChangePassword
    ? changePasswordValidationSchemaForced
    : changePasswordValidationSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { mutate: changePassword, isPending: isLoading } =
    useChangeUserPassword({
      onSuccess: async () => {
        notifySuccess('Senha alterada com sucesso!');

        const nextRoute =
          await resolvePostChangePasswordRoute(getActiveMemberships);
        navigate(nextRoute, { replace: true });
      },
      onError: (err) => notifyError(err?.message || 'Erro ao alterar senha'),
    });

  const onSubmit = ({ currentPassword, newPassword }) => {
    if (!authUser?._id) {
      notifyError('Usuário não autenticado');
      return;
    }

    changePassword({
      _id: authUser._id,
      newPassword,
      currentPassword,
    });
  };

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Logo customHeight="60%" />

        <Box>
          <InputsBox>
            <Title>Alterar senha</Title>
            <Description>Escolha uma nova senha para sua conta.</Description>

            <FormInput
              name="newPassword"
              label="Nova senha"
              hideLabel
              type="password"
              placeholder="Digite sua nova senha"
              icon={FiLock}
              register={register}
              errors={errors}
              borderRadius="4rem"
              customColor={theme.colors.font.white}
              borderString={`1px solid ${theme.colors.white}`}
            />

            {!authUser?.mustChangePassword && (
              <FormInput
                name="currentPassword"
                label="Senha atual"
                hideLabel
                type="password"
                placeholder="Digite sua senha atual"
                icon={FiLock}
                register={register}
                errors={errors}
                borderRadius="4rem"
                customColor={theme.colors.font.white}
                borderString={`1px solid ${theme.colors.white}`}
              />
            )}

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
                  Alterar senha
                </ButtonContent>
              )}
            </Button>
          </InputsBox>
        </Box>
      </StyledForm>
    </Container>
  );
}
