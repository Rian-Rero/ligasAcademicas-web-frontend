import { useMemo } from 'react';

import { CgFileDocument } from 'react-icons/cg';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import { GrAddCircle } from 'react-icons/gr';
import { RiUserAddLine } from 'react-icons/ri';
import { TbCertificate, TbUsersGroup } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import {
  AgendaAction,
  AgendaInfo,
  AgendaItem,
  AgendaList,
  FeaturedBar,
  FeaturedBars,
  FeaturedTeamsCard,
  FeaturedTeamName,
  FeaturedTeamRow,
  FeaturedTeamTotal,
  FeaturedTeamsTitle,
  Box,
  BottomCard,
  Card,
  CardIcon,
  CardHeader,
  CardValue,
  Content,
  HeaderSection,
  HeaderTitle,
  MiddleSection,
  SectionHeading,
  ShortcutBox,
  ShortcutBoxes,
  TopCards,
} from './Styles';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useGetEvents } from '../../../hooks/query/event';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import { useGetUniversities } from '../../../hooks/query/university';
import useAuthStore from '../../../stores/auth';

const fallbackAgenda = [
  {
    id: 'fallback-1',
    date: 'DD/MM',
    title: 'Título do Evento 1',
    location: 'Local do Evento 1',
  },
  {
    id: 'fallback-2',
    date: 'DD/MM',
    title: 'Título do Evento 2',
    location: 'Local do Evento 2',
  },
];

function formatDate(dateString) {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return 'DD/MM';

  return parsedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
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

  const { data: universities = [] } = useGetUniversities({
    filters: { _id: activeLeague?.university },
    enabled: Boolean(activeLeague?.university),
  });

  const activeUniversity = universities[0];

  const { data: leagueMemberships = [] } = useGetLeagueMemberships({
    filters: {
      academicLeague: activeMembership?.academicLeague,
      isActive: true,
    },
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const { data: squads = [] } = useGetSquads({
    filters: { academicLeague: activeMembership?.academicLeague },
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const { data: eventsFromApi = [] } = useGetEvents({
    filters: { academicLeague: activeMembership?.academicLeague },
    enabled: Boolean(activeMembership?.academicLeague),
    onError: () => {},
  });

  const agenda = useMemo(() => {
    if (!eventsFromApi.length) return fallbackAgenda;

    return [...eventsFromApi]
      .sort((left, right) => {
        const leftTime = new Date(left.dateTime).getTime();
        const rightTime = new Date(right.dateTime).getTime();

        return leftTime - rightTime;
      })
      .map((event, index) => ({
        id: String(event._id || `event-${index + 1}`),
        date: formatDate(event.dateTime),
        title: event.title || `Evento ${index + 1}`,
        location: event.location || 'Local a definir',
      }));
  }, [eventsFromApi]);

  const featuredSubteams = useMemo(() => {
    if (!squads.length) return [];

    const membersPerSquad = leagueMemberships.reduce((acc, membership) => {
      const squadId = String(membership.squad || '');
      if (!squadId) return acc;

      acc[squadId] = (acc[squadId] || 0) + 1;
      return acc;
    }, {});

    return squads
      .map((squad) => ({
        name: squad.name,
        members: membersPerSquad[String(squad._id)] || 0,
      }))
      .sort((left, right) => right.members - left.members)
      .slice(0, 3);
  }, [leagueMemberships, squads]);

  const totalMembers = leagueMemberships.length;
  const totalEvents = eventsFromApi.length;
  const totalSquads = squads.length;
  const totalCertificatesInMonth = 0;

  return (
    <Content>
      <HeaderSection>
        <HeaderTitle>
          {activeLeague?.name
            ? `PAINEL DE GESTÃO - ${activeLeague.name.toLocaleUpperCase('pt-BR')}`
            : 'PAINEL DE GESTÃO DA LIGA'}
        </HeaderTitle>
      </HeaderSection>

      <TopCards>
        <Card>
          <CardIcon>
            <FiUsers />
          </CardIcon>
          <CardHeader>TOTAL DE MEMBROS:</CardHeader>
          <CardValue>{totalMembers}</CardValue>
        </Card>

        <Card>
          <CardIcon>
            <FiCalendar />
          </CardIcon>
          <CardHeader>EVENTOS AGENDADOS:</CardHeader>
          <CardValue>{totalEvents}</CardValue>
        </Card>

        <Card>
          <CardIcon>
            <TbUsersGroup />
          </CardIcon>
          <CardHeader>SUBEQUIPES ATIVAS:</CardHeader>
          <CardValue>{totalSquads}</CardValue>
        </Card>

        <Card>
          <CardIcon>
            <TbCertificate />
          </CardIcon>
          <CardHeader>CERTIFICADOS EMITIDOS (MÊS):</CardHeader>
          <CardValue>{totalCertificatesInMonth}</CardValue>
        </Card>
      </TopCards>

      <MiddleSection>
        <Box>
          <SectionHeading>Próximos Eventos</SectionHeading>
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
                <AgendaAction
                  type="button"
                  $variant="primary"
                  aria-label={`Gerenciar presenças do ${item.title}`}
                >
                  Gerenciar Presença
                </AgendaAction>
              </AgendaItem>
            ))}
          </AgendaList>
        </Box>

        <FeaturedTeamsCard>
          <FeaturedTeamsTitle>
            Subequipes em destaque
            {activeUniversity?.name ? ` - ${activeUniversity.name}` : ''}
          </FeaturedTeamsTitle>

          {!featuredSubteams.length && (
            <FeaturedTeamRow>
              <FeaturedTeamName>Nenhuma subequipe encontrada</FeaturedTeamName>
              <FeaturedBars aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => (
                  <FeaturedBar
                    key={`placeholder-${index}`}
                    $active={false}
                    $index={index}
                  />
                ))}
              </FeaturedBars>
              <FeaturedTeamTotal>0</FeaturedTeamTotal>
            </FeaturedTeamRow>
          )}

          {featuredSubteams.map((subteam) => {
            const maxMembers = Math.max(totalMembers, 1);
            const barCount = 9;
            const activeBars = Math.max(
              subteam.members > 0 ? 1 : 0,
              Math.ceil((subteam.members / maxMembers) * barCount),
            );

            return (
              <FeaturedTeamRow key={subteam.name}>
                <FeaturedTeamName>{subteam.name}</FeaturedTeamName>

                <FeaturedBars aria-hidden="true">
                  {Array.from({ length: barCount }, (_, index) => (
                    <FeaturedBar
                      key={`${subteam.name}-${index}`}
                      $active={index < activeBars}
                      $index={index}
                    />
                  ))}
                </FeaturedBars>

                <FeaturedTeamTotal>{subteam.members}</FeaturedTeamTotal>
              </FeaturedTeamRow>
            );
          })}
        </FeaturedTeamsCard>
      </MiddleSection>

      <BottomCard>
        <SectionHeading>Atalhos Rápidos</SectionHeading>
        <ShortcutBoxes>
          <ShortcutBox
            type="button"
            onClick={() => navigate('/manager/criar-evento')}
          >
            <CardIcon>
              <GrAddCircle />
            </CardIcon>
            Criar Novo Evento
          </ShortcutBox>

          <ShortcutBox
            type="button"
            onClick={() => navigate('/manager/cadastrar-membro')}
          >
            <CardIcon>
              <RiUserAddLine />
            </CardIcon>
            Adicionar Novo Membro
          </ShortcutBox>

          <ShortcutBox type="button">
            <CardIcon>
              <CgFileDocument />
            </CardIcon>
            Configurar Modelo de Certificado
          </ShortcutBox>
        </ShortcutBoxes>
      </BottomCard>
    </Content>
  );
}
