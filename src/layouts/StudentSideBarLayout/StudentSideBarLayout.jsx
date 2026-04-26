import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiUsers, FiUser } from 'react-icons/fi';
import { TbCertificate, TbLayoutDashboard } from 'react-icons/tb';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Container,
  ProfileCard,
  SideBar,
  SideBarMenu,
  SideBarMenuItem,
} from './Styles';
import {
  getAcademicLeagues,
  getLeagueMemberships,
  getUniversities,
} from '../../services/api/endpoints';
import useAuthStore from '../../stores/auth';

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

export default function StudentSideBarLayout() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const { data: universities = [] } = useQuery({
    queryKey: ['universities', activeLeague?.university],
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
            aria-label={
              authUser?.name ? `Foto de ${authUser.name}` : 'Foto do aluno'
            }
          />
          <div>
            <strong>{authUser?.name}</strong>
            <span>{activeUniversity?.name}</span>
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
