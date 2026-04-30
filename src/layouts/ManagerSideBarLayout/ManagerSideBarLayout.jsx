import { FiCalendar, FiUsers, FiUser } from 'react-icons/fi';
import { GrAddCircle } from 'react-icons/gr';
import { TbCertificate, TbLayoutDashboard, TbUsersGroup } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { SideBarLayout } from '../../components/common';
import { useGetAcademicLeagues } from '../../hooks/query/academicLeague';
import { useGetLeagueMemberships } from '../../hooks/query/leagueMembership';
import { useLogout } from '../../hooks/query/sessions';
import { useGetUniversities } from '../../hooks/query/university';
import useAuthStore from '../../stores/auth';

const NAVIGATION = [
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
    label: 'Criar Evento',
    icon: <GrAddCircle />,
    path: '/manager/criar-evento',
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
  const { mutate: logout } = useLogout({
    onSettled: () => navigate('/login', { replace: true }),
  });
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

  return (
    <SideBarLayout
      navigation={NAVIGATION}
      profileInfo={{
        avatar: authUser?.imageURL,
        name: authUser?.name || 'Gestor',
        subtitle: activeUniversity?.name || activeLeague?.name || 'Instituição',
        avatarAlt: 'Foto do gestor',
      }}
      onLogout={() => logout()}
    />
  );
}
