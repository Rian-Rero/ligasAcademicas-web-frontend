import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  Description,
  InputsBox,
  Message,
  StyledWrapper,
  Title,
} from './Styles';
import { Logo } from '../../components/common';
import { notifySuccess } from '../../utils/toast';

export default function EmailConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    notifySuccess('Seu e-mail foi verificado');

    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container>
      <StyledWrapper>
        <Logo customHeight="60%" />
        <Box>
          <InputsBox>
            <Title>Confirmação de e-mail</Title>
            <Description>
              Seu endereço de e-mail foi verificado com sucesso.
            </Description>
            <Message>Agora você já pode acessar sua conta.</Message>
            <Button type="button" onClick={() => navigate('/login')}>
              Voltar para login
            </Button>
          </InputsBox>
        </Box>
      </StyledWrapper>
    </Container>
  );
}
