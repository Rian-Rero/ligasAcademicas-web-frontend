import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: #f3f4f7;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  letter-spacing: 0.01em;
`;

export const SearchBox = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  font-size: clamp(1rem, 1.2vw, 1.1rem);
  width: 100%;
  max-width: 400px;
  color: #f3f4f7;
  background: linear-gradient(
    165deg,
    rgba(8, 22, 44, 0.78),
    rgba(11, 29, 54, 0.68)
  );
  border: 1px solid rgba(167, 206, 255, 0.38);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 10px 24px rgba(0, 0, 0, 0.24);
  transition: all 0.25s ease;
  min-height: 3rem;

  &::placeholder {
    color: rgba(225, 239, 255, 0.72);
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 140, 255, 0.75);
    box-shadow:
      0 0 0 3px rgba(0, 140, 255, 0.22),
      0 12px 28px rgba(0, 0, 0, 0.28);
    background: linear-gradient(
      165deg,
      rgba(10, 27, 54, 0.9),
      rgba(12, 34, 66, 0.82)
    );
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 1rem;
    min-height: 2.8rem;
  }
`;

export const PermissionList = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(clamp(280px, 30vw, 420px), 1fr)
  );
  gap: clamp(0.8rem, 1.5vw, 1.4rem);
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 0.6rem;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg,
      rgba(246, 160, 79, 0.6),
      rgba(47, 143, 255, 0.6)
    );
    transition: background 0.3s ease;
    border-radius: 999px;

    &:hover {
      background: linear-gradient(
        180deg,
        rgba(246, 160, 79, 0.85),
        rgba(47, 143, 255, 0.85)
      );
    }
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    max-height: 55vh;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-height: 50vh;
    gap: 1rem;
  }
`;

export const PermissionCard = styled.div`
  padding: clamp(1.2rem, 2vw, 2rem);
  border: 1px solid transparent;
  border-radius: 1.5rem;
  border: 1.5px solid transparent;
  background:
    linear-gradient(160deg, rgba(11, 22, 42, 0.95), rgba(8, 18, 34, 0.95))
      padding-box,
    linear-gradient(120deg, rgba(47, 143, 255, 0.42), rgba(246, 160, 79, 0.32))
      border-box;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    filter 0.3s ease;
     border-color 0.3s ease;
   cursor: pointer;
  box-shadow:
    0 1.2rem 2.4rem rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
   position: relative;
   overflow: hidden;

   &::before {
     content: '';
     position: absolute;
     inset: 0;
     background: linear-gradient(135deg, rgba(47, 143, 255, 0.05), rgba(246, 160, 79, 0.03));
     pointer-events: none;
     opacity: 0;
     transition: opacity 0.3s ease;
   }

  &:hover {
     transform: translateY(-4px);
     filter: brightness(1.06);
     box-shadow:
       0 1.6rem 3.2rem rgba(0, 0, 0, 0.4),
       inset 0 1px 0 rgba(255, 255, 255, 0.08);

     &::before {
       opacity: 1;
     }
  }

  &.selected {
     border-color: rgba(47, 143, 255, 0.9);
     background:
       linear-gradient(160deg, rgba(15, 31, 58, 0.98), rgba(10, 20, 38, 0.98))
         padding-box,
       linear-gradient(120deg, rgba(47, 143, 255, 0.7), rgba(246, 160, 79, 0.55))
         border-box;
    box-shadow:
       0 1.2rem 2.4rem rgba(47, 143, 255, 0.28),
       0 0 0 2px rgba(47, 143, 255, 0.2),
       inset 0 1px 0 rgba(255, 255, 255, 0.12);

     &::before {
       opacity: 1;
     }

     @media (max-width: 768px) {
       padding: 1.4rem;
     }
  }
`;

export const PermissionTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  font-size: clamp(1rem, 1.3vw, 1.3rem);
  font-weight: 700;
  letter-spacing: 0.01em;
`;

export const PermissionKey = styled.p`
  margin: 0.35rem 0;
  color: #7dc2ff;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: clamp(0.85rem, 1.1vw, 1rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.4;
`;

export const PermissionModule = styled.p`
  margin: 0.35rem 0;
  color: rgba(241, 245, 255, 0.75);
  font-size: clamp(0.85rem, 1vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.01em;
`;

export const PermissionDescription = styled.p`
  margin: 0.8rem 0 0 0;
  color: rgba(241, 245, 255, 0.82);
  font-size: clamp(0.85rem, 1vw, 1rem);
  line-height: 1.4;
  font-weight: 400;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(241, 245, 255, 0.68);

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;
