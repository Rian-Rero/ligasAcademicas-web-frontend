import { useEffect, useMemo } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';

import {
  adminEventDefaultValues,
  useAdminEventForm,
} from './useAdminEventForm';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import { createEvent as createEventRequest } from '../../../services/api/endpoints';
import {
  ActionButton,
  ActionsRow,
  EmptyState,
  EditorCard,
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
} from '../../Manager/ManagerEvents/Styles';
import { buildEventCreateErrorMessage } from '../../Manager/ManagerEvents/utils';

function formatDateTime(value) {
  if (!value) return 'Nao informado';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data invalida';

  return date.toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

export function AdminEvents() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useAdminEventForm();

  const selectedLeagueId = watch('academicLeague');
  const selectedScope = watch('scope');
  const selectedSquadId = watch('squad');
  const watchedTitle = watch('title');
  const watchedDescription = watch('description');
  const watchedDateTime = watch('dateTime');
  const watchedLocation = watch('location');

  const { data: academicLeagues = [] } = useGetAcademicLeagues();
  const { data: squads = [] } = useGetSquads();
  const { data: memberships = [] } = useGetLeagueMemberships({
    filters: selectedLeagueId
      ? { academicLeague: selectedLeagueId, isActive: true }
      : undefined,
    enabled: Boolean(selectedLeagueId),
  });

  const filteredSquads = useMemo(() => {
    if (!selectedLeagueId) return [];

    return squads.filter(
      (squad) =>
        squad.academicLeague?._id === selectedLeagueId ||
        squad.academicLeague === selectedLeagueId,
    );
  }, [squads, selectedLeagueId]);

  const selectedLeague = academicLeagues.find(
    (league) => league._id === selectedLeagueId,
  );
  const selectedSquad = filteredSquads.find(
    (squad) => squad._id === selectedSquadId,
  );

  const attendeesCount = useMemo(() => {
    if (!selectedLeagueId) return 0;

    if (selectedScope === 'squad') {
      return memberships.filter((membership) => {
        const membershipSquadId = membership.squad?._id || membership.squad;
        return membershipSquadId === selectedSquadId;
      }).length;
    }

    return memberships.length;
  }, [memberships, selectedLeagueId, selectedScope, selectedSquadId]);

  useEffect(() => {
    if (selectedScope !== 'squad' && selectedSquadId) {
      setValue('squad', '');
    }
  }, [selectedScope, selectedSquadId, setValue]);

  useEffect(() => {
    if (!selectedSquadId) return;

    const squadStillVisible = filteredSquads.some(
      (squad) => squad._id === selectedSquadId,
    );

    if (!squadStillVisible) {
      setValue('squad', '');
    }
  }, [filteredSquads, selectedSquadId, setValue]);

  const createEvent = useMutation({
    mutationFn: createEventRequest,
    onSuccess: () => {
      toast.success('Evento criado com sucesso');
      reset(adminEventDefaultValues);
      queryClient.invalidateQueries(['events']);
    },
    onError: (error) => {
      toast.error(buildEventCreateErrorMessage(error));
    },
  });

  const onSubmit = (formData) => {
    const { scope, ...eventData } = formData;

    createEvent.mutate({
      ...eventData,
      squad: scope === 'squad' ? formData.squad : null,
    });
  };

  return (
    <div>
      <HeaderSection>
        <div>
          <HeaderTitle>Novo evento</HeaderTitle>
          <HeaderSubtitle>
            Crie eventos para toda a liga ou apenas para uma subequipe, com
            sincronizacao na agenda dos participantes.
          </HeaderSubtitle>
        </div>
        <ScopeBadge $variant={selectedScope}>
          <FiCalendar />
          {selectedLeague
            ? selectedLeague.name || selectedLeague.title
            : 'Selecione uma liga'}
        </ScopeBadge>
      </HeaderSection>

      <PanelGrid>
        <EditorCard onSubmit={handleSubmit(onSubmit)}>
          <FormGrid>
            <Field>
              <Label>Liga academica</Label>
              <SelectInput {...register('academicLeague')}>
                <option value="">Selecione uma liga</option>
                {academicLeagues.map((league) => (
                  <option key={league._id} value={league._id}>
                    {league.name || league.title}
                  </option>
                ))}
              </SelectInput>
              {errors.academicLeague && (
                <HelperText>{errors.academicLeague.message}</HelperText>
              )}
            </Field>

            <Field>
              <Label>Escopo</Label>
              <SelectInput {...register('scope')}>
                <option value="global">Toda a liga</option>
                <option value="squad">Apenas uma subequipe</option>
              </SelectInput>
              {errors.scope && <HelperText>{errors.scope.message}</HelperText>}
            </Field>

            <Field>
              <Label>Titulo</Label>
              <TextInput
                type="text"
                placeholder="Ex.: Reuniao de alinhamento"
                {...register('title')}
              />
              {errors.title && <HelperText>{errors.title.message}</HelperText>}
            </Field>

            <Field>
              <Label>Data e horario</Label>
              <TextInput type="datetime-local" {...register('dateTime')} />
              {errors.dateTime && (
                <HelperText>{errors.dateTime.message}</HelperText>
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
                <HelperText>{errors.location.message}</HelperText>
              )}
            </Field>

            <Field>
              <Label>Subequipe</Label>
              <SelectInput
                {...register('squad')}
                disabled={selectedScope !== 'squad' || !selectedLeagueId}
              >
                <option value="">
                  {selectedScope === 'squad'
                    ? 'Selecione uma subequipe'
                    : 'Nao necessario neste escopo'}
                </option>
                {filteredSquads.map((squad) => (
                  <option key={squad._id} value={squad._id}>
                    {squad.name}
                  </option>
                ))}
              </SelectInput>
              {errors.squad && <HelperText>{errors.squad.message}</HelperText>}
            </Field>

            <Field style={{ gridColumn: '1 / -1' }}>
              <Label>Descricao</Label>
              <TextArea
                rows={5}
                placeholder="Explique o conteudo, o objetivo e os detalhes do evento"
                {...register('description')}
              />
              {errors.description && (
                <HelperText>{errors.description.message}</HelperText>
              )}
            </Field>
          </FormGrid>

          <ActionsRow>
            <ActionButton type="submit" disabled={createEvent.isLoading}>
              {createEvent.isLoading ? 'Criando...' : 'Criar evento'}
            </ActionButton>
          </ActionsRow>
        </EditorCard>

        <PreviewCard>
          <PreviewTitle>Previsualizacao</PreviewTitle>
          <PreviewList>
            <PreviewItem>
              <PreviewLabel>
                <FiUsers /> Participantes
              </PreviewLabel>
              <PreviewValue>{attendeesCount}</PreviewValue>
            </PreviewItem>
            <PreviewItem>
              <PreviewLabel>
                <FiClock /> Data
              </PreviewLabel>
              <PreviewValue>{formatDateTime(watchedDateTime)}</PreviewValue>
            </PreviewItem>
            <PreviewItem>
              <PreviewLabel>
                <FiMapPin /> Local
              </PreviewLabel>
              <PreviewValue>{watchedLocation || 'Nao informado'}</PreviewValue>
            </PreviewItem>
            <PreviewItem>
              <PreviewLabel>Titulo</PreviewLabel>
              <PreviewValue>{watchedTitle || 'Novo evento'}</PreviewValue>
            </PreviewItem>
          </PreviewList>

          <div>
            <PreviewTitle>Destino</PreviewTitle>
            <HelperText>
              {selectedScope === 'squad'
                ? `Subequipe ${selectedSquad?.name || 'nao selecionada'} dentro da liga ${selectedLeague?.name || selectedLeague?.title || 'nao selecionada'}.`
                : `Toda a liga ${selectedLeague?.name || selectedLeague?.title || 'nao selecionada'}.`}
            </HelperText>
          </div>

          <div>
            <PreviewTitle>Descricao</PreviewTitle>
            {watchedDescription ? (
              <HelperText>{watchedDescription}</HelperText>
            ) : (
              <EmptyState>Sem descricao ainda.</EmptyState>
            )}
          </div>
        </PreviewCard>
      </PanelGrid>
    </div>
  );
}

export default AdminEvents;
