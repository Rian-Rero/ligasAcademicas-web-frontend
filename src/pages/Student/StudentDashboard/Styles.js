import styled from 'styled-components';

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

export const Card = styled.div`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: 1.2rem 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 10.5rem;
  position: relative;
`;

export const CardHeader = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
`;

export const CardTitle = styled.h2`
  font-size: 2rem;
  line-height: 1.1;
`;

export const CardValue = styled.p`
  font-size: 4.4rem;
  font-weight: 700;
  line-height: 0.9;
  color: #f6a04f;
`;

export const CardDate = styled.p`
  position: absolute;
  top: 1.2rem;
  right: 1.8rem;
  color: #f6a04f;
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
`;

export const Box = styled.div`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: 1.4rem;
`;

export const SectionHeading = styled.h3`
  font-size: 1.8rem;

  strong {
    font-size: 1.8rem;
  }

  span {
    color: rgba(255, 255, 255, 0.72);
    font-size: 1.5rem;
  }

  .members-subtitle {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0.35rem;
  }
`;

export const AgendaList = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const AgendaItem = styled.div`
  display: grid;
  grid-template-columns: ${({ $isEmpty }) =>
    $isEmpty ? '1fr' : '12rem minmax(0, 1fr) auto'};
  gap: 1.5rem;
  align-items: center;
  padding: 1.8rem;
  border-radius: 1.6rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

  ${({ $isEmpty }) =>
    $isEmpty &&
    `
      min-height: 8.5rem;
      text-align: center;
      justify-items: center;
    `}

  strong {
    font-size: 1.6rem;
  }

  span {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.4rem;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const AgendaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  strong {
    color: #8799b0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 1.2rem;
  }
`;

export const AgendaAction = styled.button`
  padding: 1rem 2rem;
  border-radius: 1.2rem;
  border: none;
  cursor: pointer;
  min-width: 16rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  background: ${(props) =>
    props.$variant === 'secondary'
      ? 'rgba(90, 117, 255, 0.2)'
      : 'linear-gradient(135deg, #196481, #4ebec6)'};
  box-shadow: ${(props) =>
    props.$variant === 'secondary'
      ? '0 8px 20px rgba(97, 112, 188, 0.2)'
      : '0 4px 15px rgba(79, 159, 165, 0.3)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$variant === 'secondary'
        ? '0 12px 25px rgba(90, 117, 255, 0.4)'
        : '0 8px 25px rgba(0, 240, 255, 0.65)'};
    filter: brightness(1.1);
  }

  @media (max-width: 760px) {
    width: 100%;
  }
`;

export const MiddleSection = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: 2rem;
  display: grid;
  gap: 1.4rem;
`;

export const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.4rem 1.5rem;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.03);

  strong {
    display: block;
    font-size: 1.4rem;
  }

  span {
    display: block;
    color: rgba(255, 255, 255, 0.68);
    margin-top: 0.3rem;
    font-size: 1.25rem;
  }

  button {
    display: grid;
    place-items: center;
    width: 8rem;
    height: 3.6rem;
    border-radius: 10rem;
    border: none;
    background: linear-gradient(135deg, #28718d, #4ebec6);
    box-shadow: 0 4px 15px rgba(79, 159, 165, 0.3);
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 240, 255, 0.65);
      filter: brightness(1.1);
    }

    svg {
      width: 2rem;
      height: 2rem;
    }
  }
`;

export const BottomCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.8rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-height: 13rem;
  overflow-y: auto;
  padding-right: 0.4rem;

  &::-webkit-scrollbar {
    width: 0.55rem;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
        rgba(139, 76, 34, 0.6),
        rgba(224, 137, 51, 0.59)
      )
      padding-box;
    border-radius: 999px;
  }
`;

export const SeeTeamLink = styled.button`
  display: flex-end;
  margin-top: 1rem;
  padding: 0.8rem 1.6rem;
  background: transparent;
  color: #f6a04f;
  border: none;
  font-size: 1.35rem;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border: none;
    filter: brightness(1.2);
  }
`;

export const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0);
  color: #fff;
  font-size: 1.4rem;
`;

export const TeamAvatar = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center / cover no-repeat`
      : 'radial-gradient(circle at top left, #57b8ff 10%, #0f2f6e 60%)'};
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

export const ProgressCircle = styled.div`
  width: 9rem;
  height: 9rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 140, 255, 0.18), transparent 62%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 auto;
`;

export const ProgressInfo = styled.div`
  text-align: center;

  strong {
    display: block;
    font-size: 1.45rem;
  }

  span {
    display: block;
    margin-top: 0.4rem;
    color: rgba(255, 255, 255, 0.68);
  }
`;

export const QuickLink = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.6rem;
  border-radius: 1.8rem;
  border: none;
  background: linear-gradient(135deg, #196481, #4ebec6);
  box-shadow: 0 4px 15px rgba(0, 240, 255, 0.3);
  color: #fff;
  font-size: 1.45rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 30px rgba(42, 168, 177, 0.65);
    filter: brightness(1.1);
  }

  svg {
    min-width: 2.4rem;
    min-height: 2.4rem;
  }
`;
