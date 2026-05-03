import { useMemo } from 'react';

import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiDownload,
  FiUsers,
  FiXCircle,
} from 'react-icons/fi';
import { TbCertificate } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

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
  SeeTeamLink,
  StatusBadge,
  SummaryCard,
  SummaryItem,
  TeamAvatar,
  TeamList,
  TeamMember,
  TopCards,
} from './Styles';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useGetCertificates } from '../../../hooks/query/certificate';
import { useGetEvents } from '../../../hooks/query/event';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import { useGetUniversities } from '../../../hooks/query/university';
import { useGetUsersByIds } from '../../../hooks/query/user';
import useAuthStore from '../../../stores/auth';
import { resolveMediaUrl } from '../../../utils/media';

const fallbackTeam = [];

function formatDate(dateString) {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return 'DD/MM';

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function formatMonthYear(dateString) {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return 'Data inválida';

  return parsedDate.toLocaleDateString('pt-BR', {
    month: '2-digit',
    year: 'numeric',
  });
}

export default function StudentDashboard() {
  const authUser = useAuthStore((state) => state.auth?.user);
  const navigate = useNavigate();

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

  const { data: certificatesFromApi = [] } = useGetCertificates({
    filters: { leagueMembership: activeMembership?._id },
    enabled: Boolean(activeMembership?._id),
    onError: () => {},
  });

  const team = useMemo(() => {
    if (!squadMemberUserIds.length || !squadUsers.length) {
      return authUser?.name
        ? [
            {
              id: String(authUser._id || 'auth-user'),
              name: authUser.name,
              imageURL: authUser?.image?.url || null,
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
        imageURL: user?.image?.url || null,
      }));

    if (!names.length) {
      return authUser?.name
        ? [
            {
              id: String(authUser._id || 'auth-user'),
              name: authUser.name,
              imageURL: authUser?.image?.url || null,
            },
          ]
        : fallbackTeam;
    }

    return names;
  }, [
    authUser?._id,
    authUser?.name,
    authUser?.image?.url,
    squadMemberUserIds,
    squadUsers,
  ]);

  const agenda = useMemo(() => {
    if (!eventsFromApi.length) return [];

    return eventsFromApi.map((event, index) => ({
      id: String(event._id || `event-${index + 1}`),
      date: formatDate(event.dateTime),
      title: event.title || 'Sem título',
      location: event.location || 'Sem local informado',
      action: 'Ver detalhes',
      variant: index % 2 === 0 ? 'primary' : 'secondary',
    }));
  }, [eventsFromApi]);

  const certificates = useMemo(
    () =>
      certificatesFromApi.map((certificate, index) => ({
        id: String(certificate._id || `certificate-${index + 1}`),
        title: `Certificado ${index + 1}`,
        date: formatMonthYear(certificate.issueDate),
        pdfUrl: certificate.pdfUrl,
      })),
    [certificatesFromApi],
  );

  const nextEvent = agenda[0];
  const totalMembersCount = team.length;
  const memberLabel = totalMembersCount === 1 ? 'membro' : 'membros';
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
          <StatusBadge $isActive={activeMembership?.isActive}>
            {activeMembership?.isActive ? (
              <>
                <FiCheckCircle /> Membro ativo
              </>
            ) : (
              <>
                <FiXCircle /> Inativo
              </>
            )}
          </StatusBadge>
        </div>
      </HeaderSection>

      <TopCards>
        <Card>
          <CardIcon>
            <FiUsers />
          </CardIcon>
          <CardHeader>Subequipe:</CardHeader>
          <CardTitle>
            {activeSquad?.name || 'Não pertence a nenhuma subequipe'}
          </CardTitle>
        </Card>

        <Card>
          <CardIcon>
            <TbCertificate />
          </CardIcon>
          <CardHeader>Certificados disponíveis:</CardHeader>
          <CardValue>{certificates.length}</CardValue>
        </Card>

        <Card>
          <CardIcon>
            <FiCalendar />
          </CardIcon>
          <CardHeader>Próximo evento:</CardHeader>
          <CardTitle>{nextEvent?.title || 'Não tem'}</CardTitle>
          <CardDate>{nextEvent?.date || '--/--'}</CardDate>
        </Card>
      </TopCards>

      <MiddleSection>
        <Box>
          <SectionHeading>Eventos e Reuniões</SectionHeading>
          <AgendaList>
            {!agenda.length ? (
              <AgendaItem $isEmpty>
                <div>
                  <strong>Não tem eventos e reuniões.</strong>
                </div>
              </AgendaItem>
            ) : (
              agenda.map((item) => (
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
              ))
            )}
          </AgendaList>
        </Box>

        <SummaryCard>
          <SectionHeading>Meus Certificados</SectionHeading>
          {!certificates.length ? (
            <SummaryItem>
              <div>
                <strong>Nenhum certificado disponível no momento.</strong>
              </div>
            </SummaryItem>
          ) : (
            certificates.map((certificate) => (
              <SummaryItem key={certificate.id}>
                <div>
                  <strong>{certificate.title}</strong>
                  <span>{certificate.date}</span>
                </div>
                <button
                  type="button"
                  aria-label={`Baixar certificado ${certificate.title}`}
                  onClick={() => {
                    if (certificate.pdfUrl) {
                      window.open(
                        certificate.pdfUrl,
                        '_blank',
                        'noopener,noreferrer',
                      );
                    }
                  }}
                  disabled={!certificate.pdfUrl}
                >
                  <FiDownload />
                </button>
              </SummaryItem>
            ))
          )}
        </SummaryCard>
      </MiddleSection>

      <BottomCards>
        <SummaryCard>
          <SectionHeading>
            <strong>Minha subequipe </strong>
            <span>
              (
              {activeUniversity?.name ||
                activeLeague?.name ||
                'Você não pertence a nenhuma liga'}
              )
            </span>
            <div>
              <span className="members-subtitle">
                {activeMembership?.squad
                  ? `${totalMembersCount} ${memberLabel}`
                  : 'Sem subequipe'}
              </span>
            </div>
          </SectionHeading>
          <TeamList>
            {activeMembership?.squad
              ? team.map((member) => (
                  <TeamMember key={member.id}>
                    <TeamAvatar
                      $imageUrl={resolveMediaUrl(member?.imageURL)}
                      role="img"
                      aria-label={`Foto de ${member.name}`}
                    />
                    {member.name}
                  </TeamMember>
                ))
              : null}
          </TeamList>
          <SeeTeamLink type="button" onClick={() => navigate('/student/team')}>
            Ver mais
          </SeeTeamLink>
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
