import { useEffect, useState } from 'react';

import { IoClose, IoLogIn, IoMenu } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';

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
  MobileCtaLink,
  MobileMenu,
  MobileNav,
  MobileNavItem,
  NavItem,
} from './Styles';
import OnlyLogo from '../OnlyLogo/OnlyLogo';

const navigationLinks = [
  { to: '/', label: 'Início', end: true },
  { to: '/login', label: 'Entrar', end: false },
  { to: '/register', label: 'Cadastrar', end: false },
  { to: '/forgot-password', label: 'Recuperar senha', end: false },
];

function getCtaData(pathname) {
  if (pathname === '/login') {
    return { to: '/register', label: 'Criar conta' };
  }

  if (pathname === '/register') {
    return { to: '/login', label: 'Entrar' };
  }

  if (pathname === '/forgot-password') {
    return { to: '/login', label: 'Entrar' };
  }

  return { to: '/login', label: 'Acessar sistema' };
}

export default function Header() {
  const { pathname } = useLocation();
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

  const ctaData = getCtaData(pathname);

  return (
    <Container>
      <HeaderSurface>
        <ItensBox>
          <BrandArea>
            <LogoLink to="/" aria-label="Voltar para página inicial">
              <OnlyLogo customWidth="100%" customHeight="100%" />
            </LogoLink>

            <BrandInfo>
              <BrandTitle>SGLA</BrandTitle>
              <BrandSubtitle>Sistema de Ligas Acadêmicas</BrandSubtitle>
            </BrandInfo>
          </BrandArea>

          <DesktopNav aria-label="Navegação principal">
            {navigationLinks.map(({ to, label, end }) => (
              <NavItem key={to} to={to} end={end}>
                {label}
              </NavItem>
            ))}
          </DesktopNav>

          <HeaderActions>
            <HeaderBadge>Conectando ligas e universidades</HeaderBadge>

            <CtaLink to={ctaData.to}>{ctaData.label}</CtaLink>

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
            {navigationLinks.map(({ to, label, end }) => (
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
            to={ctaData.to}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoLogIn />
            {ctaData.label}
          </MobileCtaLink>
        </MobileMenu>
      )}
    </Container>
  );
}
