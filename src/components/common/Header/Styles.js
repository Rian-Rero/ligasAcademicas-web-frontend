import styled from 'styled-components';

export const Container = styled.nav`
  display: flex;
  justify-content: center;
  height: 7rem;
  background-color: blue;
  border-radius: 0px 0px 1rem 1rem;
`;

export const ItensBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 6rem;
  padding: 10px 0;
  border-bottom: 1px groove black;
  > img {
    width: 10rem;
  }
`;
