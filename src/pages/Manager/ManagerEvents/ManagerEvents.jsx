import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FiCalendar, FiMapPin, FiTag, FiUsers } from 'react-icons/fi';
import { GrAddCircle } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  ActionButton,
  ActionsRow,
  Content,
  EditorCard,
  EmptyState,
  ErrorMessage,
  Field,
  FormGrid,
  HeaderSection,
  HeaderSubtitle,
  HeaderTitle,
  HelperText,
  Label,
  PanelGrid,
  PreviewCard,
  PreviewItem,
  PreviewLabel,
  PreviewList,
  PreviewTitle,
  PreviewValue,
  ScopeBadge,
  SelectInput,
  TextArea,
  TextInput,
} from './Styles';
import { buildEventCreateErrorMessage, eventValidationSchema } from './utils';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useCreateEvent } from '../../../hooks/query/event';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import useAuthStore from '../../../stores/auth';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast';

function formatPreviewDate(dateValue) {
  if (!dateValue) return 'Data a definir';

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return 'Data a definir';

  return parsedDate.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function ManagerEvents() {
  const theme = useTheme();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.auth?.user);

  const { data: memberships = [], isLoading: isLoadingMemberships } =
    useGetLeagueMemberships({
      filters: { user: authUser?._id, isActive: true },
      enabled: Boolean(authUser?._id),
    });

  const managerLeagueId = memberships[0]?.academicLeague;

  const { data: leagues = [], isLoading: isLoadingLeagues } =
    useGetAcademicLeagues({
      filters: { _id: managerLeagueId },
      enabled: Boolean(managerLeagueId),
    });

  const activeLeague = leagues[0];

  const { data: squads = [], isLoading: isLoadingSquads } = useGetSquads({
    filters: { academicLeague: managerLeagueId },
    enabled: Boolean(managerLeagueId),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      dateTime: '',
      location: '',
      scope: 'global',
      squad: '',
    },
  });

  const scope = watch('scope');
  const selectedSquadId = watch('squad');
  const previewTitle = watch('title');
  const previewDateTime = watch('dateTime');
  const previewLocation = watch('location');
  const previewDescription = watch('description');

  useEffect(() => {
    if (scope === 'global') {
      setValue('squad', '');
    }
  }, [scope, setValue]);

  const selectedSquad = useMemo(
    () => squads.find((squad) => String(squad._id) === String(selectedSquadId)),
    [squads, selectedSquadId],
  );

  const { mutateAsync: createEvent, isPending: isCreating } = useCreateEvent();

  const isSaving = isSubmitting || isCreating;
  const isLoadingLeague = isLoadingMemberships || isLoadingLeagues;
  const canSubmit = Boolean(activeLeague?._id);

  const onSubmit = async (formData) => {
    if (!activeLeague?._id) {
      notifyWarning('Nao foi possivel identificar a liga ativa');
      return;
    }

    const payload = {
      academicLeague: activeLeague._id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dateTime: formData.dateTime,
      location: formData.location.trim(),
      squad:
        formData.scope === 'squad' && formData.squad ? formData.squad : null,
    };

    try {
      await createEvent(payload);
      notifySuccess('Evento criado com sucesso');
      reset({
        title: '',
        description: '',
        dateTime: '',
        location: '',
        scope: 'global',
        squad: '',
      });
    } catch (err) {
      notifyError(buildEventCreateErrorMessage(err));
    }
  };

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>CRIAR EVENTO</HeaderTitle>
          <HeaderSubtitle>
            Cadastre novos eventos para a liga ou para uma subequipe. Escolha
            data, local e o escopo correto para a atividade.
          </HeaderSubtitle>
        </div>
      </HeaderSection>

      {!isLoadingLeague && !activeLeague && (
        <EmptyState>
          Nenhuma liga ativa foi encontrada para o seu usuario. Verifique o
          vinculo antes de criar eventos.
        </EmptyState>
      )}

      <PanelGrid>
        <EditorCard onSubmit={handleSubmit(onSubmit)}>
          <FormGrid>
            <Field>
              <Label>
                <FiTag /> Titulo do evento
              </Label>
              <TextInput
                type="text"
                placeholder="Digite o titulo do evento"
                {...register('title')}
                disabled={!canSubmit}
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>
                <FiCalendar /> Data e horario
              </Label>
              <TextInput
                type="datetime-local"
                {...register('dateTime')}
                disabled={!canSubmit}
              />
              {errors.dateTime && (
                <ErrorMessage>{errors.dateTime.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>
                <FiMapPin /> Local
              </Label>
              <TextInput
                type="text"
                placeholder="Informe o local do evento"
                {...register('location')}
                disabled={!canSubmit}
              />
              {errors.location && (
                <ErrorMessage>{errors.location.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>
                <FiUsers /> Escopo
              </Label>
              <SelectInput {...register('scope')} disabled={!canSubmit}>
                <option value="global">Evento global da liga</option>
                <option value="squad">Evento para subequipe</option>
              </SelectInput>
            </Field>

            {scope === 'squad' && (
              <Field>
                <Label>Subequipe</Label>
                <SelectInput
                  {...register('squad')}
                  disabled={!canSubmit || !squads.length}
                >
                  <option value="">Selecione a subequipe</option>
                  {squads.map((squad) => (
                    <option key={squad._id} value={squad._id}>
                      {squad.name}
                    </option>
                  ))}
                </SelectInput>
                {isLoadingSquads && (
                  <HelperText>Carregando subequipes...</HelperText>
                )}
                {!isLoadingSquads && !squads.length && (
                  <HelperText>Nenhuma subequipe cadastrada.</HelperText>
                )}
                {errors.squad && (
                  <ErrorMessage>{errors.squad.message}</ErrorMessage>
                )}
              </Field>
            )}

            <Field $fullWidth>
              <Label>Descricao</Label>
              <TextArea
                placeholder="Descreva o objetivo do evento"
                {...register('description')}
                disabled={!canSubmit}
              />
              {errors.description && (
                <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
            </Field>

            <ActionsRow>
              <ActionButton
                type="button"
                $variant="warning"
                onClick={() => navigate('/manager/dashboard')}
                disabled={isSaving}
              >
                Voltar ao dashboard
              </ActionButton>

              <ActionButton type="submit" disabled={isSaving || !canSubmit}>
                {isSaving ? (
                  <>
                    <ClipLoader
                      size={18}
                      color={theme.colors.white}
                      speedMultiplier={0.9}
                    />
                    Salvando...
                  </>
                ) : (
                  <>
                    <GrAddCircle /> Criar evento
                  </>
                )}
              </ActionButton>
            </ActionsRow>
          </FormGrid>
        </EditorCard>

        <PreviewCard>
          <PreviewTitle>Resumo do evento</PreviewTitle>
          <PreviewList>
            <PreviewItem>
              <PreviewLabel>Titulo</PreviewLabel>
              <PreviewValue>{previewTitle || 'Titulo a definir'}</PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Liga</PreviewLabel>
              <PreviewValue>
                {activeLeague?.name || 'Liga nao definida'}
              </PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Escopo</PreviewLabel>
              <PreviewValue>
                <ScopeBadge $variant={scope === 'squad' ? 'squad' : 'global'}>
                  {scope === 'squad' ? 'Subequipe' : 'Global'}
                </ScopeBadge>
              </PreviewValue>
            </PreviewItem>

            {scope === 'squad' && (
              <PreviewItem>
                <PreviewLabel>Subequipe</PreviewLabel>
                <PreviewValue>
                  {selectedSquad?.name || 'Selecione uma subequipe'}
                </PreviewValue>
              </PreviewItem>
            )}

            <PreviewItem>
              <PreviewLabel>Data e horario</PreviewLabel>
              <PreviewValue>{formatPreviewDate(previewDateTime)}</PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Local</PreviewLabel>
              <PreviewValue>
                {previewLocation || 'Local a definir'}
              </PreviewValue>
            </PreviewItem>

            <PreviewItem>
              <PreviewLabel>Descricao</PreviewLabel>
              <PreviewValue>
                {previewDescription || 'Descricao a definir'}
              </PreviewValue>
            </PreviewItem>
          </PreviewList>
        </PreviewCard>
      </PanelGrid>
    </Content>
  );
}
