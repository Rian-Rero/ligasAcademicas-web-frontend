import styled from 'styled-components';

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

export const HeaderSection = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.2rem;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

export const HeaderTitle = styled.h1`
  color: #ffffffa2;
  line-height: 1;
  font-size: 1.8rem;
`;

export const HeaderSubtitle = styled.p`
  margin-top: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.45rem;
  max-width: 62rem;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1.3rem;
  white-space: nowrap;

  background: ${({ $variant }) =>
    $variant === 'warning'
      ? 'rgba(255, 183, 0, 0.14)'
      : 'rgba(0, 255, 128, 0.12)'};
  color: ${({ $variant }) => ($variant === 'warning' ? '#ffd56a' : '#a8ffbf')};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 1.5rem;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: clamp(1.6rem, 2vw, 2.2rem);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const Form = styled.form`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: clamp(1.6rem, 2vw, 2.2rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1.6rem, 1.8vw, 2rem);
  line-height: 1.1;
  letter-spacing: 0.03em;
`;

export const IdentityBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem;
  border-radius: 1.6rem;
  background: rgba(255, 255, 255, 0.05);

  div {
    display: grid;
    gap: 0.2rem;
  }

  strong {
    font-size: 1.8rem;
    color: #ffffff;
  }

  span {
    color: rgba(255, 255, 255, 0.72);
    font-size: 1.35rem;
  }
`;

export const Avatar = styled.div`
  width: 6.4rem;
  height: 6.4rem;
  border-radius: 50%;
  flex-shrink: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;

  color: #ffffff;
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center / cover no-repeat`
      : 'radial-gradient(circle at top left, #57b8ff 10%, #0f2f6e 60%)'};

  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.1);
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.03);
`;

export const InfoLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: rgba(255, 255, 255, 0.62);
  font-size: 1.25rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

export const InfoValue = styled.strong`
  color: #ffffff;
  font-size: 1.5rem;
  line-height: 1.2;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const FormAction = styled.button`
  width: 100%;
  min-height: 4.2rem;
  border-radius: 4rem;
  border: 1px solid rgba(255, 255, 255, 0.42);

  background: linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8);
  color: #ffffff;
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;

  box-shadow:
    0 0.8rem 2rem rgba(0, 140, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
    box-shadow:
      0 1.1rem 2.4rem rgba(0, 140, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }

  &:disabled {
    cursor: not-allowed;
    transform: none;
    opacity: 0.85;
    filter: saturate(0.9);
    box-shadow:
      0 0.6rem 1.6rem rgba(0, 140, 255, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);
  }
`;

export const FormActionContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;
