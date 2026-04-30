import { FiCalendar, FiUser, FiUsers } from 'react-icons/fi';
import {
  TbBuildingCommunity,
  TbLayoutDashboard,
  TbSchool,
  TbUsersGroup,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { SideBarLayout } from '../../components/common';
import { useGetAcademicLeagues } from '../../hooks/query/academicLeague';
import { useLogout } from '../../hooks/query/sessions';
import { useGetUniversities } from '../../hooks/query/university';
import useAuthStore from '../../stores/auth';

const NAVIGATION = [
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
  const { mutate: logout } = useLogout({
    onSettled: () => navigate('/login', { replace: true }),
  });
  const authUser = useAuthStore((state) => state.auth?.user);

  const { data: universities = [] } = useGetUniversities();
  const { data: leagues = [] } = useGetAcademicLeagues();

  return (
    <SideBarLayout
      navigation={NAVIGATION}
      profileInfo={{
        avatar: authUser?.imageURL,
        name: authUser?.name || 'Administrador',
        subtitle: authUser?.globalRole
          ? `${authUser.globalRole} • ${universities.length} universidades • ${leagues.length} ligas`
          : 'Admin absoluto',
        avatarAlt: 'Foto do administrador',
      }}
      onLogout={() => logout()}
    />
  );
}
