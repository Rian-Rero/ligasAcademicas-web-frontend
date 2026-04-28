import { useMemo } from 'react';

import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiDownload,
  FiUsers,
} from 'react-icons/fi';
import { TbCertificate } from 'react-icons/tb';

import {
  AgendaAction,
  AgendaInfo,
  AgendaItem,
  AgendaList,
  BottomCards,
  Box,
  Card,
  CardDate,
  CardHeader,
  CardIcon,
  CardTitle,
  CardValue,
  Content,
  HeaderSection,
  HeaderTitle,
  MiddleSection,
  ProgressCircle,
  ProgressInfo,
  QuickLink,
  SectionHeading,
  StatusBadge,
  SummaryCard,
  SummaryItem,
  TeamAvatar,
  TeamList,
  TeamMember,
  TopCards,
} from './Styles';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useGetEvents } from '../../../hooks/query/event';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import { useGetUniversities } from '../../../hooks/query/university';
import { useGetUsersByIds } from '../../../hooks/query/user';
import useAuthStore from '../../../stores/auth';

const fallbackAgenda = [
  {
    id: 'fallback-1',
    date: 'DD/MM',
    title: 'Título do Evento 1',
    location: 'Local do Evento 1',
    action: 'Inscrever-se',
    variant: 'primary',
  },
  {
    id: 'fallback-2',
    date: 'DD/MM',
    title: 'Título do Evento 2',
    location: 'Local do Evento 2',
    action: 'Confirmar Inscrição',
    variant: 'secondary',
  },
];

const certificates = [
  { title: 'Nome do Certificado 1', date: 'Mês/Ano' },
  { title: 'Nome do Certificado 2', date: 'Mês/Ano' },
];

const fallbackTeam = [];

function formatDate(dateString) {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return 'DD/MM';

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

export default function StudentDashboard() {
  const authUser = useAuthStore((state) => state.auth?.user);

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

  const { data: squads = [] } = useGetSquads({
    filters: { _id: activeMembership?.squad },
    enabled: Boolean(activeMembership?.squad),
  });

  const activeSquad = squads[0];

  const { data: universities = [] } = useGetUniversities({
    filters: { _id: activeLeague?.university },
    enabled: Boolean(activeLeague?.university),
  });

  const activeUniversity = universities[0];

  const { data: squadMemberships = [] } = useGetLeagueMemberships({
    filters: { squad: activeMembership?.squad, isActive: true },
    enabled: Boolean(activeMembership?.squad),
  });

  const squadMemberUserIds = useMemo(
    () => [
      ...new Set(
        squadMemberships
          .map((membership) => membership?.user)
          .filter(Boolean)
          .map((userId) => String(userId)),
      ),
    ],
    [squadMemberships],
  );

  const { data: squadUsers = [] } = useGetUsersByIds({
    userIds: squadMemberUserIds,
    enabled: squadMemberUserIds.length > 0,
  });

  const { data: eventsFromApi = [] } = useGetEvents({
    filters: {
      academicLeague: activeMembership?.academicLeague,
      ...(activeMembership?.squad && { squad: activeMembership.squad }),
    },
    enabled: Boolean(activeMembership?.academicLeague),
    onError: () => {},
  });

  const team = useMemo(() => {
    if (!squadMemberUserIds.length || !squadUsers.length) {
      return authUser?.name
        ? [
            {
              id: String(authUser._id || 'auth-user'),
              name: authUser.name,
              imageURL: authUser?.imageURL || null,
            },
          ]
        : fallbackTeam;
    }

    const userIds = new Set(squadMemberUserIds);

    const names = squadUsers
      .filter((user) => userIds.has(String(user._id)))
      .filter((user) => Boolean(user.name))
      .map((user) => ({
        id: String(user._id),
        name: user.name,
        imageURL: user?.imageURL || null,
      }));

    if (!names.length) {
      return authUser?.name
        ? [
            {
              id: String(authUser._id || 'auth-user'),
              name: authUser.name,
              imageURL: authUser?.imageURL || null,
            },
          ]
        : fallbackTeam;
    }

    return names;
  }, [
    authUser?._id,
    authUser?.name,
    authUser?.imageURL,
    squadMemberUserIds,
    squadUsers,
  ]);

  const agenda = useMemo(() => {
    if (!eventsFromApi.length) return fallbackAgenda;

    return eventsFromApi.map((event, index) => ({
      id: String(event._id || `event-${index + 1}`),
      date: formatDate(event.dateTime),
      title: event.title || `Evento ${index + 1}`,
      location: event.location || 'Local a definir',
      action: 'Ver detalhes',
      variant: index % 2 === 0 ? 'primary' : 'secondary',
    }));
  }, [eventsFromApi]);

  const nextEvent = agenda[0];
  const visibleTeam = useMemo(() => team.slice(0, 3), [team]);
  const displayedMembersCount = visibleTeam.length;
  const totalMembersCount = team.length;
  const memberLabel = displayedMembersCount === 1 ? 'membro' : 'membros';
  const uppercaseStudentName = authUser?.name?.toLocaleUpperCase('pt-BR');

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>
            {uppercaseStudentName
              ? `PÁGINA GERAL DO ALUNO - ${uppercaseStudentName}`
              : 'PÁGINA GERAL DO ALUNO'}
          </HeaderTitle>
          <StatusBadge>
            <FiCheckCircle />{' '}
            {activeMembership?.isActive ? 'Membro ativo' : 'Status do Membro'}
          </StatusBadge>
        </div>
      </HeaderSection>

      <TopCards>
        <Card>
          <CardIcon>
            <FiUsers />
          </CardIcon>
          <CardHeader>Subequipe:</CardHeader>
          <CardTitle>{activeSquad?.name || 'Nome da Equipe'}</CardTitle>
        </Card>

        <Card>
          <CardIcon>
            <TbCertificate />
          </CardIcon>
          <CardHeader>Certificados disponíveis:</CardHeader>
          <CardValue>0</CardValue>
        </Card>

        <Card>
          <CardIcon>
            <FiCalendar />
          </CardIcon>
          <CardHeader>Próximo evento:</CardHeader>
          <CardTitle>{nextEvent?.title || 'Nome do Evento'}</CardTitle>
          <CardDate>{nextEvent?.date || 'DD/MM'}</CardDate>
        </Card>
      </TopCards>

      <MiddleSection>
        <Box>
          <SectionHeading>Eventos e Reuniões</SectionHeading>
          <AgendaList>
            {agenda.map((item) => (
              <AgendaItem key={item.id}>
                <AgendaInfo>
                  <strong>Data</strong>
                  <span>{item.date}</span>
                </AgendaInfo>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.location}</span>
                </div>
                <AgendaAction $variant={item.variant}>
                  {item.action}
                </AgendaAction>
              </AgendaItem>
            ))}
          </AgendaList>
        </Box>

        <SummaryCard>
          <SectionHeading>Meus Certificados</SectionHeading>
          {certificates.map((certificate) => (
            <SummaryItem key={certificate.title}>
              <div>
                <strong>{certificate.title}</strong>
                <span>{certificate.date}</span>
              </div>
              <button
                type="button"
                aria-label={`Baixar certificado ${certificate.title}`}
              >
                <FiDownload />
              </button>
            </SummaryItem>
          ))}
        </SummaryCard>
      </MiddleSection>

      <BottomCards>
        <SummaryCard>
          <SectionHeading>
            <strong>Minha subequipe </strong>
            <span>
              ({activeUniversity?.name || activeLeague?.name || 'Nome'})
            </span>
            <div>
              <span className="members-subtitle">
                {displayedMembersCount} {memberLabel}
                {totalMembersCount > 3 ? ` de ${totalMembersCount}` : ''}
              </span>
            </div>
          </SectionHeading>
          <TeamList>
            {visibleTeam.map((member) => (
              <TeamMember key={member.id}>
                <TeamAvatar
                  $imageUrl={member?.imageURL}
                  role="img"
                  aria-label={`Foto de ${member.name}`}
                />
                {member.name}
              </TeamMember>
            ))}
          </TeamList>
        </SummaryCard>

        <SummaryCard>
          <SectionHeading>Histórico de participação</SectionHeading>
          <ProgressCircle>
            <span>0%</span>
          </ProgressCircle>
          <ProgressInfo>
            <strong>Eventos Participados</strong>
            <span>0/0</span>
          </ProgressInfo>
        </SummaryCard>

        <SummaryCard>
          <SectionHeading>Atalhos rápidos</SectionHeading>
          <QuickLink type="button">
            <TbCertificate /> Ver todos os certificados <FiArrowRight />
          </QuickLink>
          <QuickLink type="button">
            <FiCalendar /> Ver calendário completo <FiArrowRight />
          </QuickLink>
        </SummaryCard>
      </BottomCards>
    </Content>
  );
}
