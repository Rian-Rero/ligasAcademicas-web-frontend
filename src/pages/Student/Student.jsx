import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiDownload,
  FiUsers,
  FiUser,
} from 'react-icons/fi';
import { TbCertificate, TbLayoutDashboard } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AgendaAction,
  AgendaInfo,
  AgendaItem,
  AgendaList,
  Avatar,
  BottomCards,
  Box,
  Card,
  CardIcon,
  CardDate,
  CardHeader,
  CardTitle,
  CardValue,
  Container,
  Content,
  HeaderSection,
  HeaderTitle,
  MiddleSection,
  ProgressCircle,
  ProgressInfo,
  ProfileCard,
  QuickLink,
  SectionHeading,
  SideBar,
  SideBarMenu,
  SideBarMenuItem,
  StatusBadge,
  SummaryCard,
  SummaryItem,
  TeamAvatar,
  TeamList,
  TeamMember,
  TopCards,
} from './Styles';

const navigation = [
  {
    label: 'Dashboard',
    icon: <TbLayoutDashboard />,
    path: '/student/dashboard',
  },
  {
    label: 'Meus Eventos',
    icon: <FiCalendar />,
    path: '/student/events',
  },
  {
    label: 'Meus Certificados',
    icon: <TbCertificate />,
    path: '/student/certificates',
  },
  {
    label: 'Minha Subequipe',
    icon: <FiUsers />,
    path: '/student/team',
  },
  {
    label: 'Meu Perfil',
    icon: <FiUser />,
    path: '/student/profile',
  },
];

const agenda = [
  {
    date: 'DD/MM',
    title: 'Título do Evento 1',
    location: 'Local do Evento 1',
    action: 'Inscrever-se',
    variant: 'primary',
  },
  {
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

const team = ['Nome do Membro 1', 'Nome do Membro 2', 'Nome do Membro 3'];

export default function Student() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container>
      <SideBar>
        <ProfileCard>
          <Avatar />
          <div>
            <strong>Nome do Aluno</strong>
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
          <div>
            <HeaderTitle>PÁGINA GERAL DO ALUNO</HeaderTitle>
            <StatusBadge>
              <FiCheckCircle /> Status do Membro
            </StatusBadge>
          </div>
        </HeaderSection>

        <TopCards>
          <Card>
            <CardIcon>
              <FiUsers />
            </CardIcon>
            <CardHeader>Subequipe:</CardHeader>
            <CardTitle>Nome da Equipe</CardTitle>
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
            <CardTitle>Nome do Evento</CardTitle>
            <CardDate>DD/MM</CardDate>
          </Card>
        </TopCards>

        <MiddleSection>
          <Box>
            <SectionHeading>Eventos e Reuniões</SectionHeading>
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
              <div>
                <strong>Minha subequipe</strong>
                <span> (Nome)</span>
              </div>
            </SectionHeading>
            <TeamList>
              {team.map((member) => (
                <TeamMember key={member}>
                  <TeamAvatar />
                  {member}
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
              <FiClipboard /> Ver todos os certificados <FiArrowRight />
            </QuickLink>
            <QuickLink type="button">
              <FiCalendar /> Ver calendário completo <FiArrowRight />
            </QuickLink>
          </SummaryCard>
        </BottomCards>
      </Content>
    </Container>
  );
}
