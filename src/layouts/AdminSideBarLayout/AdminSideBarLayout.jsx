import { FiCalendar, FiShield, FiUser, FiUsers } from 'react-icons/fi';
import {
  TbBuildingCommunity,
  TbLayoutDashboard,
  TbLogout2,
  TbSchool,
  TbUsersGroup,
} from 'react-icons/tb';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useGetAcademicLeagues } from '../../hooks/query/academicLeague';
import { useLogout } from '../../hooks/query/sessions';
import { useGetUniversities } from '../../hooks/query/university';
import useAuthStore from '../../stores/auth';
import {
  Avatar,
  Container,
  LogoutButton,
  ProfileCard,
  SideBar,
  SideBarMenu,
  SideBarMenuItem,
} from '../StudentSideBarLayout/Styles';

const navigation = [
  {
    label: 'Dashboard',
    icon: <TbLayoutDashboard />,
    path: '/admin/dashboard',
  },
  {
    label: 'Universidades',
    icon: <TbBuildingCommunity />,
    path: '/admin/universidades',
  },
  {
    label: 'Ligas Acadêmicas',
    icon: <TbSchool />,
    path: '/admin/ligas-academicas',
  },
  {
    label: 'Subequipes',
    icon: <TbUsersGroup />,
    path: '/admin/subequipes',
  },
  {
    label: 'Eventos',
    icon: <FiCalendar />,
    path: '/admin/eventos',
  },
  {
    label: 'Usuários',
    icon: <FiUsers />,
    path: '/admin/usuários',
  },
  {
    label: 'Meu Perfil',
    icon: <FiUser />,
    path: '/admin/perfil',
  },
];

export default function AdminSideBarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: logout } = useLogout({
    onSettled: () => navigate('/login', { replace: true }),
  });
  const authUser = useAuthStore((state) => state.auth?.user);

  const { data: universities = [] } = useGetUniversities();
  const { data: leagues = [] } = useGetAcademicLeagues();

  return (
    <Container>
      <SideBar>
        <ProfileCard>
          <Avatar
            $imageUrl={authUser?.imageURL}
            role="img"
            aria-label="Foto do administrador"
          />
          <div>
            <strong>{authUser?.name || 'Administrador'}</strong>
            <span>
              <FiShield />
              <em>
                {authUser?.globalRole || 'Admin absoluto'} •{' '}
                {universities.length} universidades • {leagues.length} ligas
              </em>
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

        <LogoutButton type="button" onClick={() => logout()}>
          <span>
            <TbLogout2 /> Sair
          </span>
        </LogoutButton>
      </SideBar>

      <Outlet />
    </Container>
  );
}
