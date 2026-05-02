import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiCamera,
  FiMail,
  FiSave,
  FiShield,
  FiUser,
  FiLock,
  FiXCircle,
} from 'react-icons/fi';
import { SiGoogle } from 'react-icons/si';
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
  GoogleButtonIcon,
  GoogleConnectButton,
  Form,
  FormAction,
  FormActionContent,
  FormActions,
  HeaderSection,
  HeaderSubtitle,
  HeaderTitle,
  HiddenFileInput,
  IdentityBlock,
  InfoGrid,
  InlineInfoContent,
  InfoItem,
  InfoLabel,
  InfoValue,
  SectionTitle,
  TextButton,
  UploadHint,
} from './Styles';
import UploadProfilePhotoModal from './UploadProfilePhotoModal';
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
  useUploadUserProfilePhoto,
  useUpdateUser,
} from '../../hooks/query/user';
import { getUserById } from '../../services/api/endpoints';
import useAuthStore from '../../stores/auth';
import { resolveMediaUrl } from '../../utils/media';
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
  const fileInputRef = useRef(null);
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(null);
  const [profilePhotoPreviewUrl, setProfilePhotoPreviewUrl] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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

  const { mutate: uploadProfilePhoto, isPending: isUploadingProfilePhoto } =
    useUploadUserProfilePhoto({
      onSuccess: (updatedUser) => {
        setUser({ ...authUser, ...updatedUser });
        if (profilePhotoPreviewUrl) {
          URL.revokeObjectURL(profilePhotoPreviewUrl);
        }
        setSelectedProfilePhoto(null);
        setProfilePhotoPreviewUrl('');
        setIsUploadModalOpen(false);
        notifySuccess('Foto de perfil atualizada com sucesso!');
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
    activeMembership?.role || authUser?.roleKeys?.[0],
  );

  const handleSelectProfilePhoto = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!authUser?._id) {
      notifyError('Não foi possível identificar o usuário autenticado');
      return;
    }

    const isValidMimeType = ['image/jpeg', 'image/png', 'image/webp'].includes(
      selectedFile.type,
    );

    if (!isValidMimeType) {
      notifyError('Formato inválido. Use JPG, PNG ou WEBP.');
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
      return;
    }

    const fileSizeInMB = selectedFile.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      notifyError('A imagem deve ter no máximo 5MB.');
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
      return;
    }

    if (profilePhotoPreviewUrl) {
      URL.revokeObjectURL(profilePhotoPreviewUrl);
    }

    const localPreviewUrl = URL.createObjectURL(selectedFile);
    setSelectedProfilePhoto(selectedFile);
    setProfilePhotoPreviewUrl(localPreviewUrl);

    // Allow re-selecting the same file later.
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  };

  const handleUploadSelectedProfilePhoto = () => {
    if (!authUser?._id || !selectedProfilePhoto) {
      notifyError('Selecione uma imagem para enviar');
      return;
    }

    uploadProfilePhoto({
      _id: authUser._id,
      file: selectedProfilePhoto,
    });
  };

  const handleCancelProfilePhotoPreview = () => {
    if (profilePhotoPreviewUrl) {
      URL.revokeObjectURL(profilePhotoPreviewUrl);
    }

    setSelectedProfilePhoto(null);
    setProfilePhotoPreviewUrl('');
    setIsUploadModalOpen(false);
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  useEffect(
    () => () => {
      if (profilePhotoPreviewUrl) {
        URL.revokeObjectURL(profilePhotoPreviewUrl);
      }
    },
    [profilePhotoPreviewUrl],
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
              $imageUrl={
                profilePhotoPreviewUrl || resolveMediaUrl(authUser?.image?.url)
              }
              role="img"
              aria-label={
                authUser?.name ? `Foto de ${authUser.name}` : 'Foto do usuário'
              }
            >
              {!profilePhotoPreviewUrl &&
                !resolveMediaUrl(authUser?.image?.url) &&
                getInitials(authUser?.name)}
            </Avatar>

            <div>
              <strong>{authUser?.name || 'Usuário'}</strong>
              <span>{activeLeague?.name || 'Liga não vinculada'}</span>
              <InlineInfoContent>
                <HiddenFileInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleSelectProfilePhoto}
                />
                <TextButton
                  type="button"
                  onClick={handleOpenUploadModal}
                  disabled={isUploadingProfilePhoto}
                >
                  <InlineInfoContent>
                    <FiCamera />
                    Alterar foto
                  </InlineInfoContent>
                </TextButton>
              </InlineInfoContent>
              <UploadHint>Formatos: JPG, PNG ou WEBP (max. 5MB)</UploadHint>
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
                  <GoogleConnectButton
                    type="button"
                    onClick={() => getLinkUrl(authUser?._id)}
                    disabled={isLinkingGoogle}
                  >
                    <GoogleButtonIcon aria-hidden="true">
                      <SiGoogle />
                    </GoogleButtonIcon>
                    {isLinkingGoogle
                      ? 'Redirecionando...'
                      : 'Conectar com o Google'}
                  </GoogleConnectButton>
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

      <UploadProfilePhotoModal
        isOpen={isUploadModalOpen}
        onClose={handleCancelProfilePhotoPreview}
        previewUrl={profilePhotoPreviewUrl}
        isLoading={isUploadingProfilePhoto}
        onConfirm={handleUploadSelectedProfilePhoto}
        onSelectFile={handleSelectProfilePhoto}
        userInitials={getInitials(authUser?.name)}
      />
    </Content>
  );
}
