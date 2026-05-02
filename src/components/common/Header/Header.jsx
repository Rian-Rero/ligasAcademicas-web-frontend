import { useEffect, useState } from 'react';

import { FiUser } from 'react-icons/fi';
import { IoClose, IoLogIn, IoMenu } from 'react-icons/io5';
import { TbLogout2 } from 'react-icons/tb';
import { useLocation, useNavigate } from 'react-router-dom';

import AvatarMenu from './AvatarMenu';
import {
  BrandArea,
  BrandInfo,
  BrandSubtitle,
  BrandTitle,
  Container,
  CtaLink,
  DesktopNav,
  HeaderActions,
  HeaderBadge,
  HeaderSurface,
  ItensBox,
  LogoLink,
  MenuButton,
  MobileActionButton,
  MobileCtaLink,
  MobileMenu,
  MobileNav,
  MobileNavItem,
  NavItem,
} from './Styles';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useLogout } from '../../../hooks/query/sessions';
import useAuthStore from '../../../stores/auth';
import { hasAdminRole, hasManagerRole } from '../../../utils/roles';
import OnlyLogo from '../OnlyLogo/OnlyLogo';

const publicNavigationLinks = [
  { to: '/', label: 'Início', end: true },
  { to: '/login', label: 'Entrar', end: false },
  { to: '/forgot-password', label: 'Recuperar senha', end: false },
];

function getCtaData(pathname) {
  if (pathname === '/login') {
    return { to: '/forgot-password', label: 'Recuperar senha' };
  }

  if (pathname === '/forgot-password') {
    return { to: '/login', label: 'Entrar' };
  }

  return { to: '/login', label: 'Acessar sistema' };
}

function getAuthenticatedContext(authUser, memberships = []) {
  const hasManagementMembership = memberships.some((membership) =>
    hasManagerRole(membership?.role),
  );

  if (hasAdminRole(authUser?.roleKeys)) {
    return {
      badge: 'Painel administrativo',
      dashboardTo: '/admin/dashboard',
      profileTo: '/admin/profile',
      dashboardLabel: 'Dashboard',
      profileLabel: 'Meu perfil',
    };
  }

  if (hasManagerRole(authUser?.roleKeys) || hasManagementMembership) {
    return {
      badge: 'Painel de gestão',
      dashboardTo: '/manager/dashboard',
      profileTo: '/manager/profile',
      dashboardLabel: 'Dashboard',
      profileLabel: 'Meu perfil',
    };
  }

  return {
    badge: 'Painel do estudante',
    dashboardTo: '/student/dashboard',
    profileTo: '/student/profile',
    dashboardLabel: 'Dashboard',
    profileLabel: 'Meu perfil',
  };
}

function getInitials(name) {
  if (!name) return 'AL';

  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase('pt-BR') || '')
    .join('');
}

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.auth?.user);

  const { mutate: logout } = useLogout({
    onSettled: () => navigate('/login', { replace: true }),
  });
  const { data: memberships = [] } = useGetLeagueMemberships({
    filters: { user: authUser?._id, isActive: true },
    enabled: Boolean(authUser?._id),
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const isAuthenticated = Boolean(authUser?._id);
  const ctaData = getCtaData(pathname);
  const authenticatedContext = isAuthenticated
    ? getAuthenticatedContext(authUser, memberships)
    : null;
  const desktopLinks = isAuthenticated
    ? [
        {
          to: authenticatedContext.dashboardTo,
          label: authenticatedContext.dashboardLabel,
          end: true,
        },
        {
          to: authenticatedContext.profileTo,
          label: authenticatedContext.profileLabel,
          end: false,
        },
      ]
    : publicNavigationLinks;

  return (
    <Container $compact={isAuthenticated}>
      <HeaderSurface $compact={isAuthenticated}>
        <ItensBox>
          <BrandArea>
            <LogoLink to="/" aria-label="Voltar para página inicial">
              <OnlyLogo customWidth="100%" customHeight="100%" />
            </LogoLink>

            <BrandInfo>
              <BrandTitle>SGLA</BrandTitle>
              <BrandSubtitle>
                {isAuthenticated
                  ? authenticatedContext.badge
                  : 'Sistema de Ligas Acadêmicas'}
              </BrandSubtitle>
            </BrandInfo>
          </BrandArea>

          <DesktopNav aria-label="Navegação principal">
            {desktopLinks.map(({ to, label, end }) => (
              <NavItem key={to} to={to} end={end}>
                {label}
              </NavItem>
            ))}
          </DesktopNav>

          <HeaderActions>
            <HeaderBadge>
              {isAuthenticated
                ? authenticatedContext.badge
                : 'Conectando ligas e universidades'}
            </HeaderBadge>

            {isAuthenticated ? (
              <AvatarMenu
                imageUrl={authUser?.image?.url}
                initials={getInitials(authUser?.name)}
                profileTo={authenticatedContext.profileTo}
                onLogout={() => logout()}
              />
            ) : (
              <CtaLink to={ctaData.to}>{ctaData.label}</CtaLink>
            )}

            <MenuButton
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls={isMobileMenuOpen ? 'mobile-navigation' : undefined}
              aria-label={
                isMobileMenuOpen
                  ? 'Fechar menu de navegação'
                  : 'Abrir menu de navegação'
              }
              onClick={() => setIsMobileMenuOpen((prevState) => !prevState)}
            >
              {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
            </MenuButton>
          </HeaderActions>
        </ItensBox>
      </HeaderSurface>

      {isMobileMenuOpen && (
        <MobileMenu id="mobile-navigation">
          <MobileNav aria-label="Navegação mobile">
            {desktopLinks.map(({ to, label, end }) => (
              <MobileNavItem
                key={to}
                to={to}
                end={end}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </MobileNavItem>
            ))}
          </MobileNav>

          <MobileCtaLink
            to={isAuthenticated ? authenticatedContext.profileTo : ctaData.to}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {isAuthenticated ? <FiUser /> : <IoLogIn />}
            {isAuthenticated
              ? authenticatedContext.profileLabel
              : ctaData.label}
          </MobileCtaLink>

          {isAuthenticated && (
            <MobileActionButton
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
              }}
            >
              <TbLogout2 /> Sair
            </MobileActionButton>
          )}
        </MobileMenu>
      )}
    </Container>
  );
}
