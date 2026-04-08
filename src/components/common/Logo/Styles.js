import styled from 'styled-components';

export const Logo = styled.img`
  filter: drop-shadow(0 0 20px rgba(0, 140, 255, 0.25))
    drop-shadow(0 0 40px rgba(255, 140, 0, 0.15));
  width: ${(props) => props.$width ?? '100%'};
  height: ${(props) => props.$height ?? '100%'};
`;
