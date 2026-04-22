import { CgFileDocument } from 'react-icons/cg';
import { FiCalendar, FiUsers, FiUser } from 'react-icons/fi';
import { GrAddCircle } from 'react-icons/gr';
import { RiUserAddLine } from 'react-icons/ri';
import { TbCertificate, TbLayoutDashboard, TbUsersGroup } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';

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
  Avatar,
  Box,
  BottomCard,
  Card,
  CardIcon,
  CardHeader,
  CardValue,
  Container,
  Content,
  HeaderSection,
  HeaderTitle,
  MiddleSection,
  ProfileCard,
  SectionHeading,
  ShortcutBox,
  ShortcutBoxes,
  SideBar,
  SideBarMenu,
  SideBarMenuItem,
  TopCards,
} from './Styles';

const navigation = [
  {
    label: 'Dashboard',
    icon: <TbLayoutDashboard />,
    path: '/manager/dashboard',
  },
  {
    label: 'Membros',
    icon: <FiUsers />,
    path: '/manager/membros',
  },
  {
    label: 'Eventos',
    icon: <FiCalendar />,
    path: '/manager/eventos',
  },
  {
    label: 'Subequipes',
    icon: <TbUsersGroup />,
    path: '/manager/subequipes',
  },
  {
    label: 'Certificados',
    icon: <TbCertificate />,
    path: '/manager/certificados',
  },
  {
    label: 'Meu Perfil',
    icon: <FiUser />,
    path: '/manager/perfil',
  },
];

const agenda = [
  {
    date: 'DD/MM',
    title: 'Título do Evento 1',
    location: 'Local do Evento 1',
  },
  {
    date: 'DD/MM',
    title: 'Título do Evento 2',
    location: 'Local do Evento 2',
  },
];

const featuredSubteams = [
  { name: 'Cientifico', members: 25 },
  { name: 'Marketing', members: 18 },
  { name: 'Extensão', members: 20 },
];

export default function Manager() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container>
      <SideBar>
        <ProfileCard>
          <Avatar />
          <div>
            <strong>Nome do Gestor</strong>
            <span>Instituição</span>
          </div>
        </ProfileCard>

        <SideBarMenu>
          {navigation.map(({ label, icon, path }) => (
            <SideBarMenuItem
              key={label}
              type="button"
              $active={location.pathname === path}
              onClick={() => navigate(path)}
            >
              <span>{icon}</span>
              {label}
            </SideBarMenuItem>
          ))}
        </SideBarMenu>
      </SideBar>

      <Content>
        <HeaderSection>
          <HeaderTitle>PAINEL DE GESTÃO DA LIGA</HeaderTitle>
        </HeaderSection>

        <TopCards>
          <Card>
            <CardIcon>
              <FiUsers />
            </CardIcon>
            <CardHeader>TOTAL DE MEMBROS:</CardHeader>
            <CardValue>0</CardValue>
          </Card>

          <Card>
            <CardIcon>
              <FiCalendar />
            </CardIcon>
            <CardHeader>EVENTOS AGENDADOS:</CardHeader>
            <CardValue>0</CardValue>
          </Card>

          <Card>
            <CardIcon>
              <TbUsersGroup />
            </CardIcon>
            <CardHeader>SUBEQUIPES ATIVAS:</CardHeader>
            <CardValue>0</CardValue>
          </Card>

          <Card>
            <CardIcon>
              <TbCertificate />
            </CardIcon>
            <CardHeader>CERTIFICADOS EMITIDOS (MÊS):</CardHeader>
            <CardValue>0</CardValue>
          </Card>
        </TopCards>

        <MiddleSection>
          <Box>
            <SectionHeading>Próximos Eventos</SectionHeading>
            <AgendaList>
              {agenda.map((item) => (
                <AgendaItem key={item.title}>
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
            <FeaturedTeamsTitle>Subequipes em destaque</FeaturedTeamsTitle>
            {featuredSubteams.map((subteam) => {
              const maxMembers = 25;
              const barCount = 9;
              const activeBars = Math.max(
                1,
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
            <ShortcutBox type="button">
              <CardIcon>
                <GrAddCircle />
              </CardIcon>
              Criar Novo Evento
            </ShortcutBox>

            <ShortcutBox type="button">
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
    </Container>
  );
}
