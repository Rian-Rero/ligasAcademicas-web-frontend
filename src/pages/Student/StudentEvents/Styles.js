import styled from 'styled-components';

export {
  AgendaInfo,
  AgendaItem,
  AgendaList,
  Content,
  HeaderSection,
  HeaderTitle,
  SectionHeading,
} from '../StudentDashboard/Styles';

export const HeaderSubtitle = styled.p`
  margin-top: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.4rem;
  max-width: 64rem;
`;

const EVENT_BADGE_BACKGROUNDS = {
  confirmed: 'rgba(0, 255, 128, 0.16)',
  pending: 'rgba(0, 140, 255, 0.18)',
  default: 'rgba(255, 183, 0, 0.16)',
};

const EVENT_BADGE_COLORS = {
  confirmed: '#a8ffbf',
  pending: '#9ed6ff',
  default: '#ffd56a',
};

export const EventMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.6rem;
`;

export const EventBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: ${({ $variant }) =>
    EVENT_BADGE_BACKGROUNDS[$variant] ?? EVENT_BADGE_BACKGROUNDS.default};
  color: ${({ $variant }) =>
    EVENT_BADGE_COLORS[$variant] ?? EVENT_BADGE_COLORS.default};
`;

export const ConfirmButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 1.2rem;
  border: none;
  cursor: pointer;
  min-width: 16rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  background: ${({ $variant }) =>
    $variant === 'secondary'
      ? 'rgba(90, 117, 255, 0.2)'
      : 'linear-gradient(135deg, #196481, #4ebec6)'};
  box-shadow: ${({ $variant }) =>
    $variant === 'secondary'
      ? '0 8px 20px rgba(97, 112, 188, 0.2)'
      : '0 4px 15px rgba(79, 159, 165, 0.3)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $variant }) =>
      $variant === 'secondary'
        ? '0 12px 25px rgba(90, 117, 255, 0.4)'
        : '0 8px 25px rgba(0, 240, 255, 0.65)'};
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    filter: saturate(0.9);
  }

  @media (max-width: 760px) {
    width: 100%;
  }
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 1rem;
  border-radius: 1rem;
  color: rgba(255, 255, 255, 0.72);
  background: rgba(255, 255, 255, 0.04);
  font-size: 1.35rem;
`;
