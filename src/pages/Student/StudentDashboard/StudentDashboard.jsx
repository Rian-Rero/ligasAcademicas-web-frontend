import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
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
import {
  getAcademicLeagues,
  getEvents,
  getLeagueMemberships,
  getSquads,
  getUniversities,
  getUsers,
} from '../../../services/api/endpoints';
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

  const { data: memberships = [] } = useQuery({
    queryKey: ['league-memberships', authUser?._id],
    queryFn: () =>
      getLeagueMemberships({ user: authUser?._id, isActive: true }),
    enabled: Boolean(authUser?._id),
  });

  const activeMembership = memberships[0];

  const { data: leagues = [] } = useQuery({
    queryKey: ['academic-leagues', activeMembership?.academicLeague],
    queryFn: () =>
      getAcademicLeagues({ _id: activeMembership?.academicLeague }),
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const activeLeague = leagues[0];

  const { data: squads = [] } = useQuery({
    queryKey: ['squads', activeMembership?.squad],
    queryFn: () => getSquads({ _id: activeMembership?.squad }),
    enabled: Boolean(activeMembership?.squad),
  });

  const activeSquad = squads[0];

  const { data: universities = [] } = useQuery({
    queryKey: ['universities', activeLeague?.university],
    queryFn: () => getUniversities({ _id: activeLeague?.university }),
    enabled: Boolean(activeLeague?.university),
  });

  const activeUniversity = universities[0];

  const { data: squadMemberships = [] } = useQuery({
    queryKey: ['squad-memberships', activeMembership?.squad],
    queryFn: () =>
      getLeagueMemberships({ squad: activeMembership?.squad, isActive: true }),
    enabled: Boolean(activeMembership?.squad),
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['users', 'all-for-student-dashboard'],
    queryFn: () => getUsers(),
    enabled: squadMemberships.length > 0,
  });

  const { data: eventsFromApi = [] } = useQuery({
    queryKey: ['events', activeMembership?.academicLeague],
    queryFn: async () => {
      try {
        return await getEvents({
          academicLeague: activeMembership?.academicLeague,
        });
      } catch {
        return [];
      }
    },
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const team = useMemo(() => {
    if (!squadMemberships.length || !allUsers.length) {
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

    const userIds = new Set(
      squadMemberships.map((member) => String(member.user)),
    );

    const names = allUsers
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
    allUsers,
    authUser?._id,
    authUser?.name,
    authUser?.imageURL,
    squadMemberships,
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
