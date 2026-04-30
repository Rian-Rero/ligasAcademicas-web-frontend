import PropTypes from 'prop-types';
import { TbLogout2 } from 'react-icons/tb';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

import {
  Avatar,
  Container,
  LogoutButton,
  ProfileCard,
  SideBar,
  SideBarMenu,
  SideBarMenuItem,
} from './Styles';

/**
 * SideBarLayout - Componente genérico para todos os layouts com sidebar
 * Reutiliza a mesma estrutura para Student, Manager e Admin
 */
export default function SideBarLayout({ navigation, profileInfo, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { avatar, name, subtitle, avatarAlt } = profileInfo;

  return (
    <Container>
      <SideBar>
        <ProfileCard>
          <Avatar
            $imageUrl={avatar}
            role="img"
            aria-label={avatarAlt || 'Foto do perfil'}
          />
          <div>
            <strong>{name}</strong>
            <span>{subtitle}</span>
          </div>
        </ProfileCard>

        <SideBarMenu>
          {navigation.map(({ label, icon, path }) => (
            <SideBarMenuItem
              key={label}
              type="button"
              $active={location.pathname === path}
              onClick={() => navigate(path)}
              title={label}
            >
              <span>{icon}</span>
              {label}
            </SideBarMenuItem>
          ))}
        </SideBarMenu>

        <LogoutButton type="button" onClick={onLogout} title="Logout">
          <span>
            <TbLogout2 /> Sair
          </span>
        </LogoutButton>
      </SideBar>

      <Outlet />
    </Container>
  );
}

SideBarLayout.propTypes = {
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  profileInfo: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    avatarAlt: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};
