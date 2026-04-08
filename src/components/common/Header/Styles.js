import { Link, NavLink } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const textGlow = keyframes`
  0%,
  100% {
    text-shadow: 0 0 0 transparent;
  }

  50% {
    text-shadow: 0 0 16px rgba(0, 140, 255, 0.4);
  }
`;

const activeLinkStyle = css`
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.4);
  background: linear-gradient(
    130deg,
    rgba(0, 140, 255, 0.35),
    rgba(255, 140, 0, 0.2)
  );

  box-shadow:
    0 0 1.4rem rgba(0, 140, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
`;

export const Container = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  padding: clamp(1rem, 1.8vw, 1.6rem) clamp(1.2rem, 2.8vw, 3.2rem) 0;
`;

export const HeaderSurface = styled.div`
  width: min(120rem, 100%);
  border-radius: 2.4rem;
  border: 1px solid transparent;

  background:
    linear-gradient(160deg, rgba(6, 14, 27, 0.9), rgba(11, 29, 54, 0.68))
      padding-box,
    linear-gradient(
        120deg,
        rgba(0, 140, 255, 0.72),
        rgba(255, 140, 0, 0.62),
        rgba(255, 255, 255, 0.3)
      )
      border-box;

  box-shadow:
    0 1.5rem 3.4rem rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);

  backdrop-filter: blur(12px);
  animation: ${slideDown} 0.4s ease;
`;

export const ItensBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(1.2rem, 1.5vw, 2rem);

  width: 100%;
  min-height: 8.2rem;
  padding: 1.2rem clamp(1.2rem, 2vw, 2rem);

  @media (max-width: 920px) {
    grid-template-columns: auto auto;
    justify-content: space-between;
    min-height: 7.2rem;
  }
`;

export const BrandArea = styled.div`
  display: inline-flex;
  align-items: center;
  gap: clamp(0.8rem, 1.1vw, 1.4rem);
`;

export const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: clamp(4.4rem, 5.6vw, 6rem);
  aspect-ratio: 340 / 673;
  flex: 0 0 auto;

  @media (min-width: 921px) {
    height: clamp(5rem, 5.8vw, 6.8rem);
  }

  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(1.06);
  }

  &:focus-visible {
    outline: none;
    filter: brightness(1.08);
  }
`;

export const BrandInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.1rem;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const BrandTitle = styled.strong`
  color: #ffffff;
  font-size: clamp(1.45rem, 1.5vw, 1.7rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  animation: ${textGlow} 5s ease infinite;
`;

export const BrandSubtitle = styled.span`
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(1.1rem, 1.2vw, 1.25rem);
  font-weight: 600;
  letter-spacing: 0.02em;
`;

export const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;

  @media (max-width: 920px) {
    display: none;
  }
`;

export const NavItem = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.8rem;
  padding: 0.7rem 1.35rem;
  border-radius: 999px;
  border: 1px solid transparent;

  color: rgba(255, 255, 255, 0.76);
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;

  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.34);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: none;
    ${activeLinkStyle}
  }

  &.active {
    ${activeLinkStyle}
  }
`;

export const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(0.7rem, 1vw, 1.2rem);
`;

export const HeaderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.8rem;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  color: rgba(255, 255, 255, 0.84);
  font-size: 1.22rem;
  font-weight: 700;
  letter-spacing: 0.02em;

  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.07),
    rgba(255, 255, 255, 0.03)
  );

  @media (max-width: 1180px) {
    display: none;
  }
`;

export const CtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.8rem;
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);

  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-decoration: none;

  background: linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8);

  box-shadow:
    0 0.8rem 1.8rem rgba(0, 140, 255, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);

  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
    box-shadow:
      0 1.1rem 2.2rem rgba(0, 140, 255, 0.38),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.36),
      0 1.1rem 2.2rem rgba(0, 140, 255, 0.38);
  }

  @media (max-width: 920px) {
    display: none;
  }
`;

export const MenuButton = styled.button`
  display: none;

  @media (max-width: 920px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 1.2rem;
    border: 1px solid rgba(255, 255, 255, 0.32);

    color: #ffffff;
    font-size: 2rem;
    background: rgba(255, 255, 255, 0.07);
    cursor: pointer;

    transition:
      transform 0.2s ease,
      background 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.11);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.35);
    }
  }
`;

export const MobileMenu = styled.div`
  display: none;

  @media (max-width: 920px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    width: min(120rem, 100%);
    margin-top: 0.8rem;
    padding: 1.2rem;
    border-radius: 1.8rem;
    border: 1px solid rgba(255, 255, 255, 0.2);

    background: linear-gradient(
      150deg,
      rgba(8, 20, 40, 0.96),
      rgba(11, 29, 54, 0.84)
    );

    box-shadow:
      0 1.2rem 2.8rem rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.14);

    backdrop-filter: blur(10px);
    overflow: hidden;
    animation: ${slideDown} 0.2s ease;
  }
`;

export const MobileNav = styled.nav`
  display: grid;
  gap: 0.65rem;
`;

export const MobileNavItem = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  min-height: 4rem;
  padding: 0 1.2rem;
  border-radius: 1.2rem;
  border: 1px solid transparent;

  color: rgba(255, 255, 255, 0.82);
  font-size: 1.44rem;
  font-weight: 700;
  text-decoration: none;

  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;

  &:focus-visible {
    outline: none;
    ${activeLinkStyle}
  }

  &.active {
    ${activeLinkStyle}
  }
`;

export const MobileCtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 4rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);

  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 800;
  text-decoration: none;

  background: linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8);

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 140, 255, 0.36);
  }
`;
