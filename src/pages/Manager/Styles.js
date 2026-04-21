import styled from 'styled-components';

import {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  SideBarMenuItem as BaseSideBarMenuItem,
  SummaryCard as BaseSummaryCard,
  TopCards as BaseTopCards,
} from '../Student/Styles';

export {
  AgendaAction,
  AgendaInfo,
  AgendaItem,
  AgendaList,
  Avatar,
  BottomCards,
  Box,
  CardDate,
  CardIcon,
  CardTitle,
  CardValue,
  Container,
  Content,
  HeaderSection,
  HeaderTitle,
  MiddleSection,
  ProgressCircle,
  ProgressInfo,
  ProfileCard,
  QuickLink,
  SectionHeading,
  SideBar,
  SideBarMenu,
  SummaryCard,
  SummaryItem,
  TeamAvatar,
  TeamList,
  TeamMember,
} from '../Student/Styles';

export const TopCards = styled(BaseTopCards)`
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled(BaseCard)`
  padding: 1.2rem 1.3rem;
  min-height: 9.6rem;
`;

export const CardHeader = styled(BaseCardHeader)`
  font-size: 1.1rem;
  letter-spacing: 0.12em;
`;

export const FeaturedTeamsCard = styled(BaseSummaryCard)`
  padding: 2.2rem;
  gap: 1.8rem;
`;

export const FeaturedTeamsTitle = styled.h3`
  margin: 0;
  letter-spacing: 0.06em;
  font-size: clamp(1.65rem, 1.35vw, 2.1rem);
  font-weight: 700;
  color: #f2f5fb;
  line-height: 1.05;
`;

export const FeaturedTeamRow = styled.div`
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) auto auto;
  align-items: center;
  gap: 1.4rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FeaturedTeamName = styled.strong`
  font-size: clamp(1.5rem, 1.2vw, 2.1rem);
  line-height: 1;
  font-weight: 400;
  color: rgba(241, 245, 255, 0.92);
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
  font-size: clamp(2rem, 1.8vw, 3rem);
  line-height: 1;
  font-weight: 600;
  color: #f3f4f7;
`;

export const BottomCard = styled.div`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: 2rem;
  display: grid;
  gap: 1.4rem;
  margin-top: 2rem;
`;

export const ShortcutBoxes = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
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
  font-size: 1.8rem;
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

export const ManagerSideBarMenuItem = styled(BaseSideBarMenuItem)`
  ${(props) =>
    props.$active
      ? `
    background: rgba(246, 160, 79, 0.15);
    color: #f6a04f;
    border-right-color: #f6a04f;
    
    span:first-child {
      background: rgba(246, 160, 79, 0);
      color: #f6a04f;
    }
  `
      : ''}
`;
