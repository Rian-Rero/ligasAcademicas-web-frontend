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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
  margin-bottom: 1rem;
`;

export const HeaderTitle = styled.h1`
  color: #ffffffa2;
  line-height: 1;
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 2rem;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);

  svg {
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.8rem;
    color: #fff;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.4rem;
    max-width: 40rem;
    line-height: 1.5;
  }
`;

export const Card = styled.div`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CardIcon = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 1.2rem;
  background: rgba(0, 140, 255, 0.1);
  color: #ffffff;
  display: grid;
  place-items: center;

  svg {
    width: 3rem;
    height: 3rem;
  }
`;

export const CardTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  h2 {
    font-size: 1.8rem;
    color: #fff;
    margin: 0;
  }

  p {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 2rem;
`;

export const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  span {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 600;
  }

  strong {
    font-size: 1.6rem;
    color: #fff;
    font-weight: 500;

    small {
      font-size: 1.2rem;
      color: #57b8ff;
      font-weight: 600;
      margin-left: 0.5rem;
    }
  }
`;

export const HistoryContainer = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.6rem;
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const HistoryTitle = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
`;

export const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HistoryItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.85);
`;

export const Bullet = styled.span`
  width: 0.6rem;
  height: 0.6rem;
  background-color: #f6a04f;
  border-radius: 50%;
`;

export const ActiveBadge = styled.span`
  background: rgba(0, 140, 255, 0.15);
  color: #57b8ff;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: auto;
`;

export const ActionButton = styled.button`
  padding: 1.2rem 2.4rem;
  border-radius: 1.2rem;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #196481, #4ebec6);
  box-shadow: 0 4px 15px rgba(79, 159, 165, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 240, 255, 0.65);
    filter: brightness(1.1);
  }

  @media (max-width: 760px) {
    width: 100%;
  }
`;

export const InfoMessage = styled.div`
  padding: 1.6rem;
  background: ${(props) =>
    props.$type === 'active'
      ? 'rgba(0, 140, 255, 0.08)'
      : 'rgba(255, 255, 255, 0.03)'};
  border: 1px dashed
    ${(props) =>
      props.$type === 'active'
        ? 'rgba(0, 140, 255, 0.3)'
        : 'rgba(255, 255, 255, 0.15)'};
  border-radius: 1.2rem;
  text-align: center;
  color: ${(props) =>
    props.$type === 'active' ? '#57b8ff' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 1.4rem;
`;
