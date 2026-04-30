import { FiCalendar, FiUsers, FiUser } from 'react-icons/fi';
import { TbCertificate, TbLayoutDashboard } from 'react-icons/tb';
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
        name: authUser?.name || 'Aluno',
        subtitle: activeUniversity?.name || 'Carregando...',
        avatarAlt: authUser?.name
          ? `Foto de ${authUser.name}`
          : 'Foto do aluno',
      }}
      onLogout={() => logout()}
    />
  );
}
