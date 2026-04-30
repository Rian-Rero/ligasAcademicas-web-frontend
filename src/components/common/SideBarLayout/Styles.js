import styled from 'styled-components';

/**
 * Container - Layout principal com grid responsivo
 * Sem scroll vertical - usa altura máxima disponível
 */
export const Container = styled.main`
  display: grid;
  grid-template-columns: minmax(16rem, 22rem) 1fr;
  gap: clamp(1.5rem, 2vw, 2rem);

  min-height: calc(100dvh - 7rem);
  max-height: calc(100dvh - 7rem);
  overflow: hidden;

  padding: clamp(1.5rem, 2vw, 2.5rem);
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(14rem, 18rem) 1fr;
    gap: clamp(1rem, 1.5vw, 1.5rem);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    min-height: calc(100dvh - 5rem);
    max-height: calc(100dvh - 5rem);
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0.75rem;
  }
`;

/**
 * SideBar - Barra lateral com navegação
 * Responsiva com flex para adaptar ao conteúdo
 */
export const SideBar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: clamp(1.2rem, 2vw, 1.8rem);

  background: rgba(3, 13, 34, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: clamp(1.2rem, 2vw, 2rem);
  padding: clamp(1.5rem, 2vw, 2rem);

  max-height: calc(100dvh - 9rem);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;

  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.18);

  /* Scrollbar customizado */
  scrollbar-width: thin;
  scrollbar-color: rgba(246, 160, 79, 0.5) rgba(255, 255, 255, 0.08);

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(246, 160, 79, 0.5);
    border-radius: 10px;

    &:hover {
      background: rgba(246, 160, 79, 0.7);
    }
  }

  @media (max-width: 768px) {
    max-height: auto;
    overflow: visible;
  }
`;

/**
 * ProfileCard - Cartão de perfil do usuário
 */
export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(1rem, 1.5vw, 1.5rem);
  padding: clamp(1.2rem, 1.5vw, 1.8rem);
  border-radius: clamp(1.2rem, 2vw, 2rem);

  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;

  div {
    display: grid;
    gap: 0.35rem;
    width: 100%;
  }

  strong {
    font-size: clamp(1.4rem, 2vw, 1.8rem);
    color: #ffffff;
    word-break: break-word;
  }

  span {
    color: rgba(255, 255, 255, 0.5);
    font-size: clamp(1.1rem, 1.5vw, 1.3rem);
    word-break: break-word;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;

    em {
      font-style: normal;
      color: rgba(255, 255, 255, 0.6);
      font-size: clamp(0.9rem, 1.2vw, 1.1rem);
    }

    svg {
      font-size: 1em;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;

    strong {
      font-size: 1.4rem;
    }

    span {
      font-size: 1.1rem;

      em {
        font-size: 0.9rem;
      }
    }
  }
`;

/**
 * Avatar - Imagem de perfil circular
 */
export const Avatar = styled.div`
  width: clamp(4.5rem, 8vw, 6rem);
  height: clamp(4.5rem, 8vw, 6rem);
  border-radius: 50%;
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center / cover no-repeat`
      : 'radial-gradient(circle at top left, #57b8ff 10%, #0f2f6e 60%)'};
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

/**
 * SideBarMenu - Container da navegação
 */
export const SideBarMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: clamp(0.8rem, 1.5vw, 1.2rem);
  flex: 1;
`;

/**
 * SideBarMenuItem - Itens de menu da sidebar
 */
export const SideBarMenuItem = styled.button`
  position: relative;
  overflow: hidden;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  border-radius: clamp(1rem, 1.5vw, 1.4rem);
  gap: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(0.8rem, 1vw, 1rem) clamp(0.9rem, 1.2vw, 1.2rem);

  background: rgba(79, 32, 179, 0);
  border: none;
  border-right: 3px solid transparent;

  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1.1rem, 1.5vw, 1.35rem);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

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
    width: clamp(2.5rem, 4vw, 3rem);
    height: clamp(2.5rem, 4vw, 3rem);
    min-width: clamp(2.5rem, 4vw, 3rem);

    border: none;
    background: rgba(255, 255, 255, 0);
    color: rgba(255, 255, 255, 0.9);
    transition:
      background 180ms ease,
      color 180ms ease;

    font-size: 1.2em;
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

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.75rem 0.9rem;
    gap: 0.75rem;
    border-right-width: 2px;
  }
`;

/**
 * LogoutButton - Botão de logout
 */
export const LogoutButton = styled.button`
  position: relative;
  overflow: hidden;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: clamp(1rem, 1.5vw, 1.4rem);
  gap: 0.75rem;
  padding: clamp(0.8rem, 1vw, 1rem) clamp(0.9rem, 1.2vw, 1.2rem);

  background: linear-gradient(
    135deg,
    rgba(220, 53, 69, 0.2),
    rgba(220, 53, 69, 0.1)
  );
  border: 2px solid rgba(220, 53, 69, 0.3);

  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1.1rem, 1.5vw, 1.35rem);
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;

  transition: all 180ms ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(220, 53, 69, 0.3),
      rgba(220, 53, 69, 0.1)
    );
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 220ms ease;
    z-index: 0;
  }

  span {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    svg {
      font-size: 1.2em;
    }
  }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(220, 53, 69, 0.4),
      rgba(220, 53, 69, 0.3)
    );
    border-color: rgba(220, 53, 69, 0.6);
    color: #ff6b7a;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.75rem 0.9rem;
  }
`;
