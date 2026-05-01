import styled from 'styled-components';

import { TopCards as BaseTopCards } from '../../Manager/ManagerDashboard/Styles';

export {
  AgendaAction,
  AgendaInfo,
  AgendaItem,
  AgendaList,
  FeaturedTeamsCard,
  FeaturedTeamsTitle,
  Box,
  BottomCard,
  Card,
  CardIcon,
  CardHeader,
  CardValue,
  Content,
  HeaderSection,
  HeaderTitle,
  MiddleSection,
  SectionHeading,
  ShortcutBoxes,
} from '../../Manager/ManagerDashboard/Styles';

export const TopCards = styled(BaseTopCards)`
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const BottomShortcutBoxes = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const FeaturedTeamName = styled.strong`
  font-size: clamp(1.6rem, 1.2vw, 1.4rem);
  line-height: 1;
  font-weight: 400;
  color: rgba(241, 245, 255, 0.92);
`;

export const FeaturedTeamRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
  margin-top: 0.8rem;
  margin-bottom: 1rem;
  gap: 10rem;
  padding: 1rem;
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 1.2rem;
`;

export const FeaturedBars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

export const FeaturedBar = styled.span`
  width: 1.2rem;
  height: 3.8rem;
  border-radius: 0.85rem;
  background: ${(props) =>
    props.$active
      ? [
          '#2f8fff',
          '#4b8ef2',
          '#6f8ecf',
          '#8b8da6',
          '#a08a7e',
          '#b98658',
          '#d0843f',
          '#e88831',
          '#f2982a',
        ][Math.min(props.$index, 8)]
      : 'rgba(137, 148, 177, 0.4)'};
  box-shadow: ${(props) =>
    props.$active ? '0 0 10px rgba(242, 152, 42, 0.2)' : 'none'};

  @media (max-width: 560px) {
    width: 1rem;
    height: 3.2rem;
  }
`;

export const FeaturedTeamTotal = styled.span`
  display: flex;
  align-items: center;
  justify-self: flex-end;
  font-size: clamp(2rem, 1.2vw, 1.4rem);
  line-height: 1;
  font-weight: 600;
  color: #f3f4f7;
`;

export const FeaturedRightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
`;

export const ShortcutBox = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 11rem;
  padding: 1.2rem 1.4rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(105, 161, 238, 0.83);
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.65rem;
  text-align: center;
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(19, 180, 255, 0.86);
    background: rgba(91, 181, 249, 0.89);
  }

  svg {
    min-width: 2.2rem;
    min-height: 3rem;
    margin-top: 0.1rem;
  }
`;
