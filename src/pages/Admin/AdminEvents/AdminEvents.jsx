import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FiCalendar, FiMapPin, FiSave, FiTrash2 } from 'react-icons/fi';
import { GrAddCircle } from 'react-icons/gr';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  adminEventDefaultValues,
  adminEventSchema,
  buildAdminEventErrorMessage,
} from './utils';
import { ConfirmDialog } from '../../../components/common';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import {
  useCreateEvent,
  useDeleteEvent,
  useGetEvents,
  useUpdateEvent,
} from '../../../hooks/query/event';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast';
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
} from '../../Manager/ManagerEventsList/Styles';

function normalizeId(value) {
  if (!value) return '';
  if (typeof value === 'object') return String(value._id || value.id || '');
  return String(value);
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

function buildEventPayload(formData) {
  return {
    academicLeague: formData.academicLeague,
    title: formData.title.trim(),
    description: formData.description.trim(),
    dateTime: formData.dateTime,
    location: formData.location.trim(),
    squad: formData.scope === 'squad' && formData.squad ? formData.squad : null,
  };
}

export function AdminEvents() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [eventsLeagueFilter, setEventsLeagueFilter] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminEventSchema),
    defaultValues: adminEventDefaultValues,
  });

  const formLeagueId = watch('academicLeague');
  const formScope = watch('scope');
  const formSquadId = watch('squad');
  const formTitle = watch('title');
  const formDescription = watch('description');
  const formDateTime = watch('dateTime');
  const formLocation = watch('location');

  const { data: academicLeagues = [] } = useGetAcademicLeagues();
  const { data: squads = [] } = useGetSquads({
    filters: formLeagueId ? { academicLeague: formLeagueId } : undefined,
    enabled: Boolean(formLeagueId),
  });
  const { data: memberships = [] } = useGetLeagueMemberships({
    filters: formLeagueId
      ? { academicLeague: formLeagueId, isActive: true }
      : undefined,
    enabled: Boolean(formLeagueId),
  });
  const { data: eventsFromApi = [] } = useGetEvents({
    filters: eventsLeagueFilter
      ? { academicLeague: eventsLeagueFilter }
      : undefined,
    enabled: Boolean(eventsLeagueFilter),
  });

  const events = useMemo(
    () =>
      [...eventsFromApi].sort(
        (left, right) =>
          new Date(left.dateTime).getTime() -
          new Date(right.dateTime).getTime(),
      ),
    [eventsFromApi],
  );

  const selectedEvent = useMemo(
    () => events.find((event) => normalizeId(event._id) === selectedEventId),
    [events, selectedEventId],
  );

  const selectedLeague = academicLeagues.find(
    (league) => normalizeId(league._id) === formLeagueId,
  );
  const selectedSquad = squads.find(
    (squad) => normalizeId(squad._id) === formSquadId,
  );

  const attendeesCount = useMemo(() => {
    if (!formLeagueId) return 0;

    if (formScope === 'squad') {
      return memberships.filter((membership) => {
        const membershipSquadId = normalizeId(
          membership.squad?._id || membership.squad,
        );
        return membershipSquadId === formSquadId;
      }).length;
    }

    return memberships.length;
  }, [formLeagueId, formScope, formSquadId, memberships]);

  useEffect(() => {
    if (formScope !== 'squad' && formSquadId) {
      setValue('squad', '');
    }
  }, [formScope, formSquadId, setValue]);

  useEffect(() => {
    if (!formSquadId) return;

    const squadStillVisible = squads.some(
      (squad) => normalizeId(squad._id) === formSquadId,
    );

    if (!squadStillVisible) {
      setValue('squad', '');
    }
  }, [formSquadId, squads, setValue]);

  useEffect(() => {
    if (!selectedEvent) {
      reset(adminEventDefaultValues);
      return;
    }

    reset({
      academicLeague: normalizeId(
        selectedEvent.academicLeague?._id || selectedEvent.academicLeague,
      ),
      title: selectedEvent.title || '',
      description: selectedEvent.description || '',
      dateTime: formatDateTimeInput(selectedEvent.dateTime),
      location: selectedEvent.location || '',
      scope: selectedEvent.squad ? 'squad' : 'global',
      squad: selectedEvent.squad
        ? normalizeId(selectedEvent.squad?._id || selectedEvent.squad)
        : '',
    });
  }, [reset, selectedEvent]);

  useEffect(() => {
    if (!selectedEventId) {
      setIsDeleteConfirmOpen(false);
      return;
    }

    const selectedEventStillVisible = events.some(
      (event) => normalizeId(event._id) === selectedEventId,
    );

    if (!selectedEventStillVisible) {
      setSelectedEventId('');
      setIsDeleteConfirmOpen(false);
    }
  }, [events, selectedEventId]);

  const createEvent = useCreateEvent({
    onSuccess: (_, variables) => {
      notifySuccess('Evento criado com sucesso');
      setEventsLeagueFilter(variables?.academicLeague || '');
      setSelectedEventId('');
      reset(adminEventDefaultValues);
      queryClient.invalidateQueries(['events']);
    },
    onError: (error) => {
      notifyError(buildAdminEventErrorMessage(error));
    },
  });

  const updateEvent = useUpdateEvent({
    onSuccess: (_, variables) => {
      notifySuccess('Evento atualizado com sucesso');
      setEventsLeagueFilter(
        variables?.inputData?.academicLeague || eventsLeagueFilter,
      );
      queryClient.invalidateQueries(['events']);
    },
    onError: (error) => {
      notifyError(buildAdminEventErrorMessage(error));
    },
  });

  const deleteEvent = useDeleteEvent({
    onSuccess: () => {
      notifySuccess('Evento removido com sucesso');
      setSelectedEventId('');
      setIsDeleteConfirmOpen(false);
      reset(adminEventDefaultValues);
      queryClient.invalidateQueries(['events']);
    },
    onError: (error) => {
      notifyError(buildAdminEventErrorMessage(error));
    },
  });

  const isSaving =
    isSubmitting || createEvent.isPending || updateEvent.isPending;
  const isDeleting = deleteEvent.isPending;
  const isEditing = Boolean(selectedEventId);
  const canSubmit = Boolean(formLeagueId);

  const handleStartNewEvent = () => {
    setSelectedEventId('');
    reset(adminEventDefaultValues);
  };

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

    await deleteEvent.mutateAsync(selectedEvent._id);
  };

  const onSubmit = async (formData) => {
    if (!formData.academicLeague) {
      notifyWarning('Selecione uma liga antes de salvar o evento');
      return;
    }

    const payload = buildEventPayload(formData);

    if (isEditing && selectedEvent?._id) {
      await updateEvent.mutateAsync({
        _id: selectedEvent._id,
        inputData: payload,
      });
      return;
    }

    await createEvent.mutateAsync(payload);
  };

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>EVENTOS</HeaderTitle>
          <HeaderSubtitle>
            Crie, edite e remova eventos da liga. A lista fica separada do
            formulario para evitar preenchimento automatico indevido.
          </HeaderSubtitle>
        </div>

        <HeaderActions>
          <ActionButton type="button" onClick={handleStartNewEvent}>
            <GrAddCircle /> Novo evento
          </ActionButton>
        </HeaderActions>
      </HeaderSection>

      <PanelGrid>
        <EventsCard>
          <SectionTitle>Lista de eventos</SectionTitle>

          <Field $fullWidth>
            <Label>Filtrar por liga</Label>
            <SelectInput
              value={eventsLeagueFilter}
              onChange={(event) => {
                setEventsLeagueFilter(event.target.value);
                setSelectedEventId('');
              }}
            >
              <option value="">Selecione uma liga para listar eventos</option>
              {academicLeagues.map((league) => (
                <option key={league._id} value={normalizeId(league._id)}>
                  {league.name || league.title}
                </option>
              ))}
            </SelectInput>
          </Field>

          {!eventsLeagueFilter && (
            <EmptyState>
              Selecione uma liga para visualizar, editar e excluir os eventos
              cadastrados.
            </EmptyState>
          )}

          {eventsLeagueFilter && !events.length && (
            <EmptyState>
              Nenhum evento encontrado para a liga selecionada.
            </EmptyState>
          )}

          <EventList>
            {events.map((event) => {
              const eventLeagueId = normalizeId(
                event.academicLeague?._id || event.academicLeague,
              );
              const eventSquadId = normalizeId(event.squad?._id || event.squad);
              const eventSquad = squads.find(
                (squad) => normalizeId(squad._id) === eventSquadId,
              );

              return (
                <EventItem
                  key={event._id}
                  type="button"
                  $active={normalizeId(event._id) === selectedEventId}
                  onClick={() => setSelectedEventId(normalizeId(event._id))}
                >
                  <EventTitle>
                    <strong>{event.title}</strong>
                    <EventBadge $variant={event.squad ? 'squad' : 'global'}>
                      {event.squad ? 'Subequipe' : 'Global'}
                    </EventBadge>
                  </EventTitle>

                  <EventMeta>
                    <EventMetaItem>
                      <FiCalendar /> {formatDateTimeDisplay(event.dateTime)}
                    </EventMetaItem>
                    <EventMetaItem>
                      <FiMapPin /> {event.location || 'Sem local definido'}
                    </EventMetaItem>
                    <EventMetaItem>
                      Liga{' '}
                      {academicLeagues.find(
                        (league) => normalizeId(league._id) === eventLeagueId,
                      )?.name || 'selecionada'}
                    </EventMetaItem>
                    {eventSquad && (
                      <EventMetaItem>Subequipe {eventSquad.name}</EventMetaItem>
                    )}
                  </EventMeta>
                </EventItem>
              );
            })}
          </EventList>
        </EventsCard>

        <EditorCard onSubmit={handleSubmit(onSubmit)}>
          <SectionTitle>
            {isEditing ? 'Editar evento' : 'Criar novo evento'}
          </SectionTitle>
          <HelperText>
            {isEditing
              ? 'O formulario foi preenchido manualmente com o evento selecionado.'
              : 'Escolha os dados abaixo para cadastrar um novo evento.'}
          </HelperText>

          <FormGrid>
            <Field>
              <Label>Liga acadêmica</Label>
              <SelectInput {...register('academicLeague')}>
                <option value="">Selecione uma liga</option>
                {academicLeagues.map((league) => (
                  <option key={league._id} value={normalizeId(league._id)}>
                    {league.name || league.title}
                  </option>
                ))}
              </SelectInput>
              {errors.academicLeague && (
                <ErrorMessage>{errors.academicLeague.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Escopo</Label>
              <SelectInput {...register('scope')}>
                <option value="global">Toda a liga</option>
                <option value="squad">Apenas uma subequipe</option>
              </SelectInput>
              {errors.scope && (
                <ErrorMessage>{errors.scope.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Título</Label>
              <TextInput
                type="text"
                placeholder="Ex.: Reunião de alinhamento"
                {...register('title')}
              />
              {errors.title && (
                <ErrorMessage>{errors.title.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Data e horário</Label>
              <TextInput type="datetime-local" {...register('dateTime')} />
              {errors.dateTime && (
                <ErrorMessage>{errors.dateTime.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Local</Label>
              <TextInput
                type="text"
                placeholder="Ex.: Sala 204"
                {...register('location')}
              />
              {errors.location && (
                <ErrorMessage>{errors.location.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Subequipe</Label>
              <SelectInput
                {...register('squad')}
                disabled={formScope !== 'squad' || !formLeagueId}
              >
                <option value="">
                  {formScope === 'squad'
                    ? 'Selecione uma subequipe'
                    : 'Não necessario neste escopo'}
                </option>
                {squads.map((squad) => (
                  <option key={squad._id} value={normalizeId(squad._id)}>
                    {squad.name}
                  </option>
                ))}
              </SelectInput>
              {errors.squad && (
                <ErrorMessage>{errors.squad.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>Descrição</Label>
              <TextArea
                rows={5}
                placeholder="Explique o conteúdo, o objetivo e os detalhes do evento"
                {...register('description')}
              />
              {errors.description && (
                <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <HelperText>
                {formLeagueId
                  ? `${attendeesCount} pessoa(s) devem receber a agenda deste evento.`
                  : 'Selecione uma liga para calcular os participantes.'}
              </HelperText>
              {formLeagueId && selectedLeague && (
                <HelperText>
                  Liga atual: {selectedLeague.name || selectedLeague.title}
                  {formScope === 'squad' && selectedSquad
                    ? ` • Subequipe: ${selectedSquad.name}`
                    : ''}
                </HelperText>
              )}
              <HelperText>
                Data: {formDateTime || 'Não definida'} • Local:{' '}
                {formLocation || 'Não definido'} • Título:{' '}
                {formTitle || 'Novo evento'}
              </HelperText>
              {formDescription && <HelperText>{formDescription}</HelperText>}
            </Field>
          </FormGrid>

          <ActionsRow>
            {isEditing && (
              <ActionButton
                type="button"
                $variant="warning"
                onClick={handleRequestDelete}
                disabled={isSaving || isDeleting}
              >
                <FiTrash2 /> Excluir evento
              </ActionButton>
            )}

            <ActionButton
              type="button"
              onClick={handleStartNewEvent}
              disabled={isSaving || isDeleting}
            >
              Nova criação
            </ActionButton>

            <ActionButton
              type="submit"
              disabled={isSaving || isDeleting || !canSubmit}
            >
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
                  <FiSave /> {isEditing ? 'Salvar alterações' : 'Criar evento'}
                </>
              )}
            </ActionButton>
          </ActionsRow>
        </EditorCard>
      </PanelGrid>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Excluir evento"
        description={
          selectedEvent
            ? `Tem certeza que deseja excluir ${selectedEvent.title}? Essa ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este evento?'
        }
        confirmLabel={isDeleting ? 'Excluindo...' : 'Excluir'}
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </Content>
  );
}

export default AdminEvents;
