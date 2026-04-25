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

export default function StudentSideBar() {
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

      <Outlet />
    </Container>
  );
}
