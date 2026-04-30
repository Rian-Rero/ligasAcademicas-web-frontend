import { useMemo } from 'react';

import { CgFileDocument } from 'react-icons/cg';
import { FiUsers } from 'react-icons/fi';
import { GrAddCircle } from 'react-icons/gr';
import { TbBuildingCommunity, TbSchool, TbUsersGroup } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import {
  BottomCard,
  Box,
  Card,
  CardHeader,
  CardIcon,
  CardValue,
  Content,
  FeaturedBar,
  FeaturedBars,
  FeaturedTeamsCard,
  FeaturedTeamName,
  FeaturedTeamRow,
  FeaturedTeamTotal,
  FeaturedTeamsTitle,
  HeaderSection,
  HeaderTitle,
  MiddleSection,
  SectionHeading,
  ShortcutBox,
  ShortcutBoxes,
  TopCards,
} from './Styles';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetUniversities } from '../../../hooks/query/university';
import { useGetUsers } from '../../../hooks/query/user';

const fallbackHighlights = [
  { name: 'Universidades', value: 'cadastre e organize instituições' },
  { name: 'Ligas', value: 'mantenha áreas e descrições atualizadas' },
  { name: 'Usuários', value: 'controle acesso e vínculos' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: universities = [] } = useGetUniversities();
  const { data: leagues = [] } = useGetAcademicLeagues();
  const { data: users = [] } = useGetUsers();
  const { data: memberships = [] } = useGetLeagueMemberships();

  const activeMemberships = useMemo(
    () => memberships.filter((membership) => membership.isActive),
    [memberships],
  );

  const summary = [
    {
      label: 'Universidades cadastradas',
      value: universities.length,
      icon: <TbBuildingCommunity />,
    },
    {
      label: 'Ligas acadêmicas',
      value: leagues.length,
      icon: <TbSchool />,
    },
    {
      label: 'Usuários na base',
      value: users.length,
      icon: <FiUsers />,
    },
    {
      label: 'Vínculos ativos',
      value: activeMemberships.length,
      icon: <TbUsersGroup />,
    },
  ];

  const highlights = useMemo(() => {
    if (!universities.length && !leagues.length) return fallbackHighlights;

    return [
      {
        name: universities[0]?.name || 'Universidade principal',
        value: `${universities.length} instituições em operação`,
      },
      {
        name: leagues[0]?.name || 'Liga em destaque',
        value: `${leagues.length} ligas com gestão centralizada`,
      },
      {
        name: 'Gestão de usuários',
        value: `${users.length} perfis disponíveis para administração`,
      },
    ];
  }, [leagues, universities, users.length]);

  return (
    <Content>
      <HeaderSection>
        <HeaderTitle>PAINEL DE ADMINISTRAÇÃO ABSOLUTA</HeaderTitle>
      </HeaderSection>

      <TopCards>
        {summary.map((item) => (
          <Card key={item.label}>
            <CardIcon>{item.icon}</CardIcon>
            <CardHeader>{item.label.toUpperCase()}</CardHeader>
            <CardValue>{item.value}</CardValue>
          </Card>
        ))}
      </TopCards>

      <MiddleSection>
        <Box>
          <SectionHeading>Visão geral da operação</SectionHeading>
          <div>
            {highlights.map((item, index) => (
              <FeaturedTeamRow key={item.name}>
                <FeaturedTeamName>{item.name}</FeaturedTeamName>
                <FeaturedBars aria-hidden="true">
                  {Array.from({ length: 9 }, (_, barIndex) => (
                    <FeaturedBar
                      key={`${item.name}-${barIndex}`}
                      $active={barIndex <= index + 5}
                      $index={barIndex}
                    />
                  ))}
                </FeaturedBars>
                <FeaturedTeamTotal>{index + 1}</FeaturedTeamTotal>
              </FeaturedTeamRow>
            ))}
          </div>
        </Box>

        <FeaturedTeamsCard>
          <FeaturedTeamsTitle>Acessos rápidos</FeaturedTeamsTitle>
          <ShortcutBoxes>
            <ShortcutBox
              type="button"
              onClick={() => navigate('/admin/universidades')}
            >
              <TbBuildingCommunity />
              Universidades
            </ShortcutBox>
            <ShortcutBox
              type="button"
              onClick={() => navigate('/admin/ligas-academicas')}
            >
              <TbSchool />
              Ligas
            </ShortcutBox>
            <ShortcutBox
              type="button"
              onClick={() => navigate('/admin/usuarios')}
            >
              <FiUsers />
              Usuários
            </ShortcutBox>
          </ShortcutBoxes>
        </FeaturedTeamsCard>
      </MiddleSection>

      <BottomCard>
        <SectionHeading>Próximas ações</SectionHeading>
        <ShortcutBoxes>
          <ShortcutBox
            type="button"
            onClick={() => navigate('/admin/universidades')}
          >
            <GrAddCircle />
            Nova universidade
          </ShortcutBox>
          <ShortcutBox
            type="button"
            onClick={() => navigate('/admin/ligas-academicas')}
          >
            <CgFileDocument />
            Nova liga
          </ShortcutBox>
          <ShortcutBox
            type="button"
            onClick={() => navigate('/admin/usuarios')}
          >
            <TbUsersGroup />
            Gerenciar usuários
          </ShortcutBox>
        </ShortcutBoxes>
      </BottomCard>
    </Content>
  );
}
