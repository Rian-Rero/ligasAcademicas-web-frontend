import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100dvh;
  min-height: 100vh;
  width: 100%;

  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;

  overflow: hidden;
  background: #06090f;

  /* Garante que o body não tenha overflow */
  > * {
    overflow: hidden;
  }

  @media (max-width: 768px) {
    min-height: 100dvh;
  }
`;
