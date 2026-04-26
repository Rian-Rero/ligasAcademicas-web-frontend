import styled from 'styled-components';

export const Container = styled.main`
  display: grid;
  grid-template-columns: minmax(18rem, 25rem) 1fr;
  gap: 2rem;
  min-height: calc(100dvh - 7rem);
  padding: clamp(2rem, 3vw, 3.2rem);
  width: min(100%, 160rem);
  margin: 0 auto;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const SideBar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  background: rgba(3, 13, 34, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  padding: 2rem;
  min-height: min(85vh, 80rem);
  width: 100%;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.18);
`;

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 1.8rem;
  border-radius: 2rem;
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  div {
    display: grid;
    gap: 0.35rem;
  }

  strong {
    font-size: 1.8rem;
    color: #ffffff;
  }

  span {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.3rem;
  }
`;

export const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center / cover no-repeat`
      : 'radial-gradient(circle at top left, #57b8ff 10%, #0f2f6e 60%)'};
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

export const SideBarMenu = styled.nav`
  display: grid;
  gap: 1.2rem;
`;

export const SideBarMenuItem = styled.button`
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 1.4rem;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: rgba(79, 32, 179, 0);
  border: none;
  border-right: 4px solid transparent;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.35rem;
  text-align: left;
  cursor: pointer;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background 180ms ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.12)
    );
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 220ms ease;
    z-index: 0;
  }

  span:first-child {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border: none;
    background: rgba(255, 255, 255, 0);
    color: rgba(255, 255, 255, 0.9);
    transition:
      background 180ms ease,
      color 180ms ease;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &:hover {
    background: rgba(246, 160, 79, 0.08);
    color: #f6a04f;
    border-right-color: #f6a04f;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &:hover span:first-child {
    background: rgba(246, 160, 79, 0);
    color: #f6a04f;
  }

  ${(props) =>
    props.$active
      ? `
    background: rgba(246, 160, 79, 0.15);
    color: #f6a04f;
    border-right-color: #f6a04f;
    transition: none;
    transform: none;

    &:hover {
      background: rgba(246, 160, 79, 0.15);
      color: #f6a04f;
      border-right-color: #f6a04f;
    }

    &::before {
      transform: scaleX(0);
      transition: none;
    }

    &:hover::before {
      transform: scaleX(0);
    }
    
    span:first-child {
      background: rgba(246, 160, 79, 0);
      color: #f6a04f;
      transition: none;
    }

    &:hover span:first-child {
      background: rgba(246, 160, 79, 0);
      color: #f6a04f;
      transition: none;
    }
  `
      : ''}
`;

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const HeaderSection = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

export const HeaderTitle = styled.h1`
  color: #ffffffa2;
  line-height: 1;
  font-size: 1.8rem;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.4rem;
  padding: 0.95rem 1.3rem;
  border-radius: 999px;
  background: rgba(0, 255, 128, 0.12);
  color: #a8ffbf;
  font-weight: 600;
  font-size: 1.35rem;
`;

export const TopCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.8rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const CardIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background: rgba(0, 140, 255, 0);
  color: #fff;
  display: grid;
  place-items: center;

  svg {
    width: 3.5rem;
    height: 3.5rem;
  }
`;
