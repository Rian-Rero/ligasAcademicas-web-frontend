import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiUsers, FiUser } from 'react-icons/fi';
import { TbCertificate, TbLayoutDashboard, TbUsersGroup } from 'react-icons/tb';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  getAcademicLeagues,
  getLeagueMemberships,
  getUniversities,
} from '../../services/api/endpoints';
import useAuthStore from '../../stores/auth';
import {
  Avatar,
  Container,
  ProfileCard,
  SideBar,
  SideBarMenu,
  SideBarMenuItem,
} from '../StudentSideBarLayout/Styles';

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

export default function ManagerSideBarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useAuthStore((state) => state.auth?.user);

  const { data: memberships = [] } = useQuery({
    queryKey: ['league-memberships', authUser?._id, 'manager-sidebar'],
    queryFn: () =>
      getLeagueMemberships({ user: authUser?._id, isActive: true }),
    enabled: Boolean(authUser?._id),
  });

  const activeMembership = memberships[0];

  const { data: leagues = [] } = useQuery({
    queryKey: [
      'academic-leagues',
      activeMembership?.academicLeague,
      'manager-sidebar',
    ],
    queryFn: () =>
      getAcademicLeagues({ _id: activeMembership?.academicLeague }),
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const activeLeague = leagues[0];

  const { data: universities = [] } = useQuery({
    queryKey: ['universities', activeLeague?.university, 'manager-sidebar'],
    queryFn: () => getUniversities({ _id: activeLeague?.university }),
    enabled: Boolean(activeLeague?.university),
  });

  const activeUniversity = universities[0];

  return (
    <Container>
      <SideBar>
        <ProfileCard>
          <Avatar
            $imageUrl={authUser?.imageURL}
            role="img"
            aria-label="Foto do gestor"
          />
          <div>
            <strong>{authUser?.name || 'Nome do Gestor'}</strong>
            <span>
              {activeUniversity?.name || activeLeague?.name || 'Instituição'}
            </span>
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

      <Outlet />
    </Container>
  );
}
