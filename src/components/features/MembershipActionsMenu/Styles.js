import { Dialog, Menu } from '@mui/material';
import styled from 'styled-components';

export const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 8px;
    background: linear-gradient(180deg, #0d1f3a 0%, #07162a 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
    padding: 0.25rem 0;
    min-width: 200px;
    color: ${({ theme }) => theme.colors.font.white};
  }

  .MuiMenuItem-root {
    padding: 0.5rem 1rem;
    color: ${({ theme }) => theme.colors.font.white};

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background: linear-gradient(180deg, #0f2342 0%, #081426 100%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    color: ${({ theme }) => theme.colors.font.white};
    border-radius: 12px;
  }
`;
