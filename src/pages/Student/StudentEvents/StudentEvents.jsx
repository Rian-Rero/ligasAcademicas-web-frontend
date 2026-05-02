import { useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  AgendaInfo,
  AgendaItem,
  AgendaList,
  ConfirmButton,
  Content,
  EmptyState,
  EventBadge,
  EventMeta,
  HeaderSection,
  HeaderSubtitle,
  HeaderTitle,
  SectionHeading,
} from './Styles';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import {
  useConfirmAttendance,
  useCreateAttendance,
  useGetAttendances,
} from '../../../hooks/query/attendance';
import { useGetEvents } from '../../../hooks/query/event';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import useAuthStore from '../../../stores/auth';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast';

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

function formatDateTime(dateValue) {
  if (!dateValue) return 'Data a definir';

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return 'Data a definir';

  return parsedDate.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function StudentEvents() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.auth?.user);
  const [pendingEventId, setPendingEventId] = useState('');

  const { data: memberships = [], isLoading: isLoadingMemberships } =
    useGetLeagueMemberships({
      filters: { user: authUser?._id, isActive: true },
      enabled: Boolean(authUser?._id),
    });

  const activeMembership = memberships[0];

  const { data: leagues = [] } = useGetAcademicLeagues({
    filters: { _id: activeMembership?.academicLeague },
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const activeLeague = leagues[0];

  const { data: squads = [] } = useGetSquads({
    filters: { academicLeague: activeMembership?.academicLeague },
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const squadsById = useMemo(
    () =>
      squads.reduce((acc, squad) => {
        acc[normalizeId(squad._id)] = squad;
        return acc;
      }, {}),
    [squads],
  );

  const { data: eventsFromApi = [], isLoading: isLoadingEvents } = useGetEvents(
    {
      filters: {
        academicLeague: activeMembership?.academicLeague,
        ...(activeMembership?.squad && { squad: activeMembership.squad }),
      },
      enabled: Boolean(activeMembership?.academicLeague),
      onError: () => {},
    },
  );

  const { data: attendances = [], isLoading: isLoadingAttendances } =
    useGetAttendances({
      filters: { leagueMembership: activeMembership?._id },
      enabled: Boolean(activeMembership?._id),
      onError: () => {},
    });

  const attendanceByEvent = useMemo(
    () =>
      attendances.reduce((acc, attendance) => {
        acc[normalizeId(attendance.event)] = attendance;
        return acc;
      }, {}),
    [attendances],
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

  const { mutateAsync: createAttendance } = useCreateAttendance();
  const { mutateAsync: confirmAttendance } = useConfirmAttendance();

  const isLoading =
    isLoadingMemberships || isLoadingEvents || isLoadingAttendances;

  const handleConfirm = async (eventId) => {
    if (!activeMembership?._id) {
      notifyWarning('Nao foi possivel identificar sua ligacao com a liga');
      return;
    }

    const attendance = attendanceByEvent[normalizeId(eventId)];

    setPendingEventId(normalizeId(eventId));

    try {
      if (!attendance) {
        await createAttendance({
          event: eventId,
          leagueMembership: activeMembership._id,
          isConfirmed: true,
        });
      } else if (!attendance.isConfirmed) {
        await confirmAttendance(attendance._id);
      }

      await queryClient.invalidateQueries(['attendances']);
      notifySuccess('Presença confirmada com sucesso');
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Nao foi possivel confirmar sua presença',
        ),
      );
    } finally {
      setPendingEventId('');
    }
  };

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>MEUS EVENTOS</HeaderTitle>
          <HeaderSubtitle>
            Confira os eventos disponiveis e confirme sua presença para garantir
            sua vaga.
          </HeaderSubtitle>
        </div>
      </HeaderSection>

      {!isLoading && !activeLeague && (
        <EmptyState>
          Nenhuma liga ativa foi encontrada para o seu usuário.
        </EmptyState>
      )}

      <SectionHeading>
        Eventos da liga {activeLeague?.name ? `- ${activeLeague.name}` : ''}
      </SectionHeading>

      {isLoading && <EmptyState>Carregando eventos...</EmptyState>}

      {!isLoading && !events.length && (
        <EmptyState>Nenhum evento encontrado no momento.</EmptyState>
      )}

      <AgendaList>
        {events.map((event) => {
          const attendance = attendanceByEvent[normalizeId(event._id)];
          const isConfirmed = Boolean(attendance?.isConfirmed);
          const isPending = pendingEventId === normalizeId(event._id);
          let confirmButtonContent = 'Confirmar presença';

          if (isConfirmed) {
            confirmButtonContent = 'Presença confirmada';
          }

          if (isPending) {
            confirmButtonContent = (
              <>
                <ClipLoader
                  size={18}
                  color={theme.colors.white}
                  speedMultiplier={0.9}
                />
                Confirmando...
              </>
            );
          }

          const squadName = event.squad
            ? squadsById[normalizeId(event.squad)]?.name
            : null;

          return (
            <AgendaItem key={event._id}>
              <AgendaInfo>
                <strong>Data</strong>
                <span>{formatDateTime(event.dateTime)}</span>
              </AgendaInfo>

              <div>
                <strong>{event.title || 'Evento sem título'}</strong>
                <span>{event.location || 'Local a definir'}</span>
                <EventMeta>
                  <EventBadge $variant={event.squad ? 'squad' : 'global'}>
                    {event.squad ? 'Subequipe' : 'Global'}
                  </EventBadge>
                  {squadName && (
                    <EventBadge $variant="pending">
                      Equipe: {squadName}
                    </EventBadge>
                  )}
                  <EventBadge $variant={isConfirmed ? 'confirmed' : 'pending'}>
                    {isConfirmed ? 'Presença confirmada' : 'A confirmar'}
                  </EventBadge>
                </EventMeta>
              </div>

              <ConfirmButton
                type="button"
                $variant={isConfirmed ? 'secondary' : 'primary'}
                disabled={isConfirmed || isPending}
                onClick={() => handleConfirm(event._id)}
              >
                {confirmButtonContent}
              </ConfirmButton>
            </AgendaItem>
          );
        })}
      </AgendaList>
    </Content>
  );
}
