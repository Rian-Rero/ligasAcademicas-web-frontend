import { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiLink,
  FiMail,
  FiSave,
  FiShield,
  FiUser,
  FiLock,
  FiXCircle,
} from 'react-icons/fi';
import { TbSchool } from 'react-icons/tb';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  Avatar,
  Badge,
  CalendarStatusPill,
  Card,
  Content,
  Form,
  FormAction,
  FormActionContent,
  FormActions,
  HeaderSection,
  HeaderSubtitle,
  HeaderTitle,
  IdentityBlock,
  InfoGrid,
  InlineInfoContent,
  InfoItem,
  InfoLabel,
  InfoValue,
  SectionTitle,
  TextButton,
} from './Styles';
import {
  buildProfileUpdateErrorMessage,
  profileValidationSchema,
} from './utils';
import { FormInput } from '../../components/features';
import { useGetAcademicLeagues } from '../../hooks/query/academicLeague';
import { useGetLeagueMemberships } from '../../hooks/query/leagueMembership';
import { useGetUniversities } from '../../hooks/query/university';
import {
  useGetGoogleCalendarLinkUrl,
  useUnlinkGoogleCalendar,
  useUpdateUser,
} from '../../hooks/query/user';
import { getUserById } from '../../services/api/endpoints';
import useAuthStore from '../../stores/auth';
import { notifyError, notifySuccess } from '../../utils/toast';

function formatRole(role) {
  if (!role) return 'Membro';

  return String(role)
    .replace(/[-_]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toLocaleUpperCase('pt-BR') + word.slice(1))
    .join(' ');
}

function getInitials(name) {
  if (!name) return 'AL';

  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase('pt-BR') || '')
    .join('');
}

export default function Profile() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasHandledGoogleCallback = useRef(false);
  const authUser = useAuthStore((state) => state.auth?.user);
  const setUser = useAuthStore((state) => state.setUser);

  const { data: memberships = [] } = useGetLeagueMemberships({
    filters: { user: authUser?._id, isActive: true },
    enabled: Boolean(authUser?._id),
  });

  const activeMembership = memberships[0];

  const { data: leagues = [] } = useGetAcademicLeagues({
    filters: { _id: activeMembership?.academicLeague },
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const activeLeague = leagues[0];

  const { data: universities = [] } = useGetUniversities({
    filters: { _id: activeLeague?.university },
    enabled: Boolean(activeLeague?.university),
  });

  const activeUniversity = universities[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      name: authUser?.name || '',
    },
  });

  useEffect(() => {
    reset({ name: authUser?.name || '' });
  }, [authUser?.name, reset]);

  useEffect(() => {
    const callbackStatus = searchParams.get('googleCalendar');
    if (!callbackStatus || !authUser?._id || hasHandledGoogleCallback.current)
      return;

    hasHandledGoogleCallback.current = true;

    const callbackMessage = searchParams.get('message');
    setSearchParams({});

    if (callbackStatus === 'linked') {
      notifySuccess('Conta Google vinculada com sucesso!');
    } else {
      notifyError(
        callbackMessage || 'Não foi possível vincular a conta Google',
      );
    }

    getUserById(authUser._id)
      .then((freshUser) => {
        setUser({ ...authUser, ...freshUser });
      })
      .catch((err) => {
        notifyError(buildProfileUpdateErrorMessage(err));
      });
  }, [authUser, searchParams, setSearchParams, setUser]);

  const { mutate: updateUser, isPending: isSaving } = useUpdateUser({
    onSuccess: (updatedUser) => {
      const nextUser = {
        ...authUser,
        ...updatedUser,
        name: updatedUser?.name || authUser?.name,
      };

      setUser(nextUser);
      reset({ name: nextUser.name || '' });
      notifySuccess('Perfil atualizado com sucesso!');
    },
    onError: (err) => {
      notifyError(buildProfileUpdateErrorMessage(err));
    },
  });

  const { mutate: getLinkUrl, isPending: isLinkingGoogle } =
    useGetGoogleCalendarLinkUrl({
      onSuccess: ({ authUrl }) => {
        window.location.assign(authUrl);
      },
      onError: (err) => {
        notifyError(buildProfileUpdateErrorMessage(err));
      },
    });

  const { mutate: unlinkGoogle, isPending: isUnlinkingGoogle } =
    useUnlinkGoogleCalendar({
      onSuccess: (updatedUser) => {
        setUser({ ...authUser, ...updatedUser });
        notifySuccess('Conta Google desvinculada com sucesso!');
      },
      onError: (err) => {
        notifyError(buildProfileUpdateErrorMessage(err));
      },
    });

  const onSubmit = ({ name }) => {
    if (!authUser?._id) {
      notifyError('Não foi possível identificar o usuário autenticado');
      return;
    }

    const normalizedName = name.trim();
    if (normalizedName === String(authUser?.name || '').trim()) {
      notifySuccess('Nenhuma alteração para salvar');
      return;
    }

    updateUser({
      _id: authUser._id,
      newUserData: { name: normalizedName },
    });
  };

  const isEmailVerified = Boolean(authUser?.emailVerified);
  const isGoogleLinked = Boolean(authUser?.googleCalendarLinked);
  const displayRole = formatRole(
    activeMembership?.role || authUser?.globalRole,
  );

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>MEU PERFIL</HeaderTitle>
          <HeaderSubtitle>
            Gerencie seus dados pessoais e acompanhe seu vínculo com a liga.
          </HeaderSubtitle>
        </div>

        <Badge $variant={isEmailVerified ? 'success' : 'warning'}>
          {isEmailVerified ? <FiCheckCircle /> : <FiAlertCircle />}
          {isEmailVerified
            ? 'E-mail verificado'
            : 'E-mail pendente de verificação'}
        </Badge>
      </HeaderSection>

      <InfoGrid>
        <Card>
          <SectionTitle>Dados da conta</SectionTitle>

          <IdentityBlock>
            <Avatar
              $imageUrl={authUser?.imageURL}
              role="img"
              aria-label={
                authUser?.name ? `Foto de ${authUser.name}` : 'Foto do usuário'
              }
            >
              {!authUser?.imageURL && getInitials(authUser?.name)}
            </Avatar>

            <div>
              <strong>{authUser?.name || 'Usuário'}</strong>
              <span>{activeLeague?.name || 'Liga não vinculada'}</span>
            </div>
          </IdentityBlock>

          <InfoItem>
            <InfoLabel>
              <FiMail /> E-mail
            </InfoLabel>
            <InfoValue>{authUser?.email || '-'}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>
              <FiShield /> Perfil
            </InfoLabel>
            <InfoValue>{displayRole}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>
              <TbSchool /> Universidade
            </InfoLabel>
            <InfoValue>{activeUniversity?.name || 'Não definida'}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>
              <TbSchool /> Liga acadêmica
            </InfoLabel>
            <InfoValue>{activeLeague?.name || 'Não vinculada'}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>
              <FiLock /> Senha
            </InfoLabel>
            <InfoValue>
              <TextButton
                type="button"
                onClick={() => navigate('/change-password')}
              >
                Alterar senha
              </TextButton>
            </InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>
              <FiCalendar /> Google Agenda
            </InfoLabel>
            <InfoValue>
              <InlineInfoContent>
                <CalendarStatusPill $isLinked={isGoogleLinked}>
                  {isGoogleLinked ? 'Vinculado' : 'Não vinculado'}
                </CalendarStatusPill>

                {isGoogleLinked && authUser?.googleCalendarEmail
                  ? authUser.googleCalendarEmail
                  : 'Sincronize eventos automaticamente com seu calendário'}

                {isGoogleLinked ? (
                  <TextButton
                    type="button"
                    onClick={() => unlinkGoogle(authUser?._id)}
                    disabled={isUnlinkingGoogle}
                  >
                    <InlineInfoContent>
                      <FiXCircle />
                      {isUnlinkingGoogle ? 'Desvinculando...' : 'Desvincular'}
                    </InlineInfoContent>
                  </TextButton>
                ) : (
                  <TextButton
                    type="button"
                    onClick={() => getLinkUrl(authUser?._id)}
                    disabled={isLinkingGoogle}
                  >
                    <InlineInfoContent>
                      <FiLink />
                      {isLinkingGoogle ? 'Redirecionando...' : 'Vincular conta'}
                    </InlineInfoContent>
                  </TextButton>
                )}
              </InlineInfoContent>
            </InfoValue>
          </InfoItem>
        </Card>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <SectionTitle>Editar perfil</SectionTitle>

          <FormInput
            name="name"
            label="Nome"
            hideLabel
            placeholder="Digite aqui seu nome"
            icon={FiUser}
            register={register}
            errors={errors}
            borderRadius="4rem"
            customColor={theme.colors.font.white}
            borderString={`1px solid ${theme.colors.white}`}
          />

          <FormActions>
            <FormAction
              type="submit"
              disabled={isSaving || !isDirty}
              aria-busy={isSaving}
            >
              {isSaving ? (
                <FormActionContent>
                  <ClipLoader
                    size={18}
                    color={theme.colors.white}
                    speedMultiplier={0.9}
                  />
                  Salvando...
                </FormActionContent>
              ) : (
                <FormActionContent>
                  <FiSave />
                  Salvar alterações
                </FormActionContent>
              )}
            </FormAction>
          </FormActions>
        </Form>
      </InfoGrid>
    </Content>
  );
}
