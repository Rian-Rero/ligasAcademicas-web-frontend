import { Box, Card, Chip, Dialog, Stack } from '@mui/material';
import styled from 'styled-components';

export const Container = styled(Box)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.font.white};
`;

export const HeaderSection = styled(Box)`
  margin-bottom: 2rem;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.font.white};
  }
`;

export const MembershipCard = styled(Card)`
  transition: all 0.3s ease;
  border-radius: 12px;
  background-color: #081426 !important;
  background-image: linear-gradient(
    180deg,
    #0f2342 0%,
    #081426 100%
  ) !important;
  border: 1px solid
    ${({ theme }) => theme?.palette?.divider || 'rgba(255, 255, 255, 0.14)'};
  color: ${({ theme }) => theme.colors.font.white};

  .MuiCardContent-root,
  .MuiTypography-root {
    color: ${({ theme }) => theme.colors.font.white};
  }

  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
    transform: translateY(-2px);
  }
`;

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background: linear-gradient(180deg, #0f2342 0%, #081426 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: ${({ theme }) => theme.colors.font.white};
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
    border-radius: 12px;
  }
`;

export const MemberInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StatusChip = styled(Chip)`
  font-weight: 600;
`;

export const FormStack = styled(Stack)`
  gap: 1.5rem;
`;
