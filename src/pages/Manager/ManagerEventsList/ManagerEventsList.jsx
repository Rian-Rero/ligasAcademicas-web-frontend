import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  FiCalendar,
  FiMapPin,
  FiSave,
  FiTag,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi';
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
  EventBadge,
  EventItem,
  EventList,
  EventMeta,
  EventMetaItem,
  EventTitle,
  EventsCard,
  Field,
  FullRow,
  FormGrid,
  HeaderActions,
  HeaderSection,
  HeaderSubtitle,
  HeaderTitle,
  HelperText,
  Label,
  PanelGrid,
  SectionTitle,
  SelectInput,
  TextArea,
  TextInput,
} from './Styles';
import { ConfirmDialog } from '../../../components/common';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import {
  useDeleteEvent,
  useGetEvents,
  useUpdateEvent,
} from '../../../hooks/query/event';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import useAuthStore from '../../../stores/auth';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast';
import { eventValidationSchema } from '../ManagerEvents/utils';

const defaultFormValues = {
  title: '',
  description: '',
  dateTime: '',
  location: '',
  scope: 'global',
  squad: '',
};

function normalizeId(value) {
  return String(value || '');
}

function buildRequestErrorMessage(err, fallback) {
  const responseMessage = err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' | ');
  }

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message;
  }

  return fallback;
}

function formatDateTimeInput(dateValue) {
  if (!dateValue) return '';

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return '';

  const offset = parsedDate.getTimezoneOffset();
  const localDate = new Date(parsedDate.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function formatDateTimeDisplay(dateValue) {
  if (!dateValue) return 'Data a definir';

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return 'Data a definir';

  return parsedDate.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function ManagerEventsList() {
  const theme = useTheme();
  const queryClient = useQueryClient();
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

  const { data: eventsFromApi = [], isLoading: isLoadingEvents } = useGetEvents(
    {
      filters: { academicLeague: managerLeagueId },
      enabled: Boolean(managerLeagueId),
      onError: () => {},
    },
  );

  const { data: squads = [] } = useGetSquads({
    filters: { academicLeague: managerLeagueId },
    enabled: Boolean(managerLeagueId),
  });

  const squadsById = useMemo(
    () =>
      squads.reduce((acc, squad) => {
        acc[normalizeId(squad._id)] = squad;
        return acc;
      }, {}),
    [squads],
  );

  const events = useMemo(
    () =>
      [...eventsFromApi].sort(
        (left, right) =>
          new Date(left.dateTime).getTime() -
          new Date(right.dateTime).getTime(),
      ),
    [eventsFromApi],
  );

  const [selectedEventId, setSelectedEventId] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!events.length) {
      setSelectedEventId('');
      return;
    }

    const hasSelectedEvent = events.some(
      (event) => normalizeId(event._id) === selectedEventId,
    );

    if (!hasSelectedEvent) {
      setSelectedEventId(normalizeId(events[0]._id));
    }
  }, [events, selectedEventId]);

  useEffect(() => {
    setIsDeleteConfirmOpen(false);
  }, [selectedEventId]);

  const selectedEvent = useMemo(
    () => events.find((event) => normalizeId(event._id) === selectedEventId),
    [events, selectedEventId],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventValidationSchema),
    defaultValues: defaultFormValues,
  });

  const scope = watch('scope');

  useEffect(() => {
    if (!selectedEvent) {
      reset(defaultFormValues);
      return;
    }

    reset({
      title: selectedEvent.title || '',
      description: selectedEvent.description || '',
      dateTime: formatDateTimeInput(selectedEvent.dateTime),
      location: selectedEvent.location || '',
      scope: selectedEvent.squad ? 'squad' : 'global',
      squad: selectedEvent.squad ? normalizeId(selectedEvent.squad) : '',
    });
  }, [reset, selectedEvent]);

  useEffect(() => {
    if (scope === 'global') {
      setValue('squad', '');
    }
  }, [scope, setValue]);

  const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const { mutateAsync: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  const isSaving = isSubmitting || isUpdating || isDeleting;
  const canEdit = Boolean(selectedEvent?._id);
  const isLoadingLeague = isLoadingMemberships || isLoadingLeagues;

  const handleRequestDelete = () => {
    if (!selectedEvent?._id) {
      notifyWarning('Selecione um evento para remover');
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEvent?._id) {
      notifyWarning('Selecione um evento para remover');
      setIsDeleteConfirmOpen(false);
      return;
    }

    try {
      await deleteEvent(selectedEvent._id);
      notifySuccess('Evento removido com sucesso');
      await queryClient.invalidateQueries(['events']);
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Nao foi possivel remover o evento selecionado',
        ),
      );
    }
  };

  const onSubmit = async (formData) => {
    if (!selectedEvent?._id) {
      notifyWarning('Selecione um evento para editar');
      return;
    }

    if (!activeLeague?._id) {
      notifyWarning('Nao foi possivel identificar a liga ativa');
      return;
    }

    const payload = {
      _id: selectedEvent._id,
      inputData: {
        academicLeague: activeLeague._id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dateTime: formData.dateTime,
        location: formData.location.trim(),
        squad:
          formData.scope === 'squad' && formData.squad ? formData.squad : null,
      },
    };

    try {
      await updateEvent(payload);
      notifySuccess('Evento atualizado com sucesso');
      await queryClient.invalidateQueries(['events']);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(err, 'Nao foi possivel atualizar o evento'),
      );
    }
  };

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>EVENTOS</HeaderTitle>
          <HeaderSubtitle>
            Gerencie eventos da liga, edite informacoes e remova programacoes
            antigas.
          </HeaderSubtitle>
        </div>

        <HeaderActions>
          <ActionButton
            type="button"
            onClick={() => navigate('/manager/criar-evento')}
          >
            <GrAddCircle /> Criar evento
          </ActionButton>
        </HeaderActions>
      </HeaderSection>

      {!isLoadingLeague && !activeLeague && (
        <EmptyState>
          Nenhuma liga ativa foi encontrada para o seu usuario.
        </EmptyState>
      )}

      <PanelGrid>
        <EventsCard>
          <SectionTitle>Eventos cadastrados</SectionTitle>

          {isLoadingEvents && <EmptyState>Carregando eventos...</EmptyState>}

          {!isLoadingEvents && !events.length && (
            <EmptyState>Nenhum evento encontrado.</EmptyState>
          )}

          <EventList>
            {events.map((event) => {
              const squadName = event.squad
                ? squadsById[normalizeId(event.squad)]?.name
                : null;

              return (
                <EventItem
                  key={event._id}
                  type="button"
                  $active={normalizeId(event._id) === selectedEventId}
                  onClick={() => setSelectedEventId(normalizeId(event._id))}
                >
                  <EventTitle>
                    <strong>{event.title || 'Evento sem título'}</strong>
                    <EventBadge $variant={event.squad ? 'squad' : 'global'}>
                      {event.squad ? 'Subequipe' : 'Global'}
                    </EventBadge>
                  </EventTitle>
                  <EventMeta>
                    <EventMetaItem>
                      {formatDateTimeDisplay(event.dateTime)}
                    </EventMetaItem>
                    <EventMetaItem>
                      {event.location || 'Local a definir'}
                    </EventMetaItem>
                    {squadName && (
                      <EventMetaItem>Equipe: {squadName}</EventMetaItem>
                    )}
                  </EventMeta>
                </EventItem>
              );
            })}
          </EventList>
        </EventsCard>

        <EditorCard onSubmit={handleSubmit(onSubmit)}>
          <SectionTitle>Editar evento</SectionTitle>

          {!canEdit && (
            <HelperText>Selecione um evento para editar.</HelperText>
          )}

          <FormGrid>
            <Field>
              <Label>
                <FiTag /> Título do evento
              </Label>
              <TextInput
                type="text"
                placeholder="Digite o título do evento"
                {...register('title')}
                disabled={!canEdit}
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
                disabled={!canEdit}
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
                disabled={!canEdit}
              />
              {errors.location && (
                <ErrorMessage>{errors.location.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>
                <FiUsers /> Escopo
              </Label>
              <SelectInput {...register('scope')} disabled={!canEdit}>
                <option value="global">Evento global da liga</option>
                <option value="squad">Evento para subequipe</option>
              </SelectInput>
            </Field>

            {scope === 'squad' && (
              <Field>
                <Label>Subequipe</Label>
                <SelectInput
                  {...register('squad')}
                  disabled={!canEdit || !squads.length}
                >
                  <option value="">Selecione a subequipe</option>
                  {squads.map((squad) => (
                    <option key={squad._id} value={squad._id}>
                      {squad.name}
                    </option>
                  ))}
                </SelectInput>
                {!squads.length && (
                  <HelperText>Nenhuma subequipe cadastrada.</HelperText>
                )}
                {errors.squad && (
                  <ErrorMessage>{errors.squad.message}</ErrorMessage>
                )}
              </Field>
            )}

            <Field $fullWidth>
              <Label>Descrição</Label>
              <TextArea
                placeholder="Descreva o objetivo do evento"
                {...register('description')}
                disabled={!canEdit}
              />
              {errors.description && (
                <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
            </Field>

            {isDeleteConfirmOpen && (
              <FullRow>
                <HelperText>
                  Tem certeza que deseja excluir o evento{' '}
                  {selectedEvent?.title || ''}?
                </HelperText>
              </FullRow>
            )}

            <ActionsRow>
              {isDeleteConfirmOpen ? (
                <>
                  <ActionButton
                    type="button"
                    onClick={handleCancelDelete}
                    disabled={isSaving}
                  >
                    Cancelar
                  </ActionButton>
                  <ActionButton
                    type="button"
                    $variant="warning"
                    onClick={handleConfirmDelete}
                    disabled={isSaving}
                  >
                    <FiTrash2 /> Confirmar exclusao
                  </ActionButton>
                </>
              ) : (
                <ActionButton
                  type="button"
                  $variant="warning"
                  onClick={handleRequestDelete}
                  disabled={!canEdit || isSaving}
                >
                  <FiTrash2 /> Excluir evento
                </ActionButton>
              )}

              <ActionButton type="submit" disabled={!canEdit || isSaving}>
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
                    <FiSave /> Salvar alterações
                  </>
                )}
              </ActionButton>
            </ActionsRow>
          </FormGrid>
        </EditorCard>
      </PanelGrid>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Confirmar exclusao"
        description={`Deseja excluir o evento ${selectedEvent?.title || ''}?`}
        confirmLabel="Excluir evento"
        cancelLabel="Manter evento"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isSaving}
      />
    </Content>
  );
}
