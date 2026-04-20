import { useEffect, useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  Description,
  InputsBox,
  Message,
  NameBadge,
  RedirectProgressBar,
  RedirectProgressFill,
  StyledWrapper,
  Title,
} from './Styles';
import { buildEmailConfirmationErrorMessage } from './utils';
import { Logo } from '../../components/common';
import { SystemLoading } from '../../components/features';
import { useVerifyUser } from '../../hooks/query/user';

const REDIRECT_DELAY_IN_MS = 2000;

function parseUserName(userName) {
  return typeof userName === 'string' ? userName.trim() : '';
}

function extractFirstName(userName) {
  const [firstName] = parseUserName(userName).split(' ');
  return firstName || '';
}

export default function EmailConfirmation() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [remainingMs, setRemainingMs] = useState(REDIRECT_DELAY_IN_MS);

  // Backend calls
  const {
    data: userName,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
  } = useVerifyUser({
    token,
    enabled: Boolean(token),
  });

  const parsedUserName = useMemo(() => parseUserName(userName), [userName]);
  const firstName = useMemo(() => extractFirstName(userName), [userName]);
  const secondsToRedirect = useMemo(
    () => Math.max(0, Math.ceil(remainingMs / 1000)),
    [remainingMs],
  );
  const redirectProgress = useMemo(() => {
    const elapsedMs = REDIRECT_DELAY_IN_MS - remainingMs;
    return Math.min((elapsedMs / REDIRECT_DELAY_IN_MS) * 100, 100);
  }, [remainingMs]);

  useEffect(() => {
    if (token) return undefined;

    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1400);

    return () => clearTimeout(timer);
  }, [navigate, token]);

  useEffect(() => {
    if (!isSuccess) return undefined;

    setRemainingMs(REDIRECT_DELAY_IN_MS);
    const startedAt = Date.now();

    const redirectTimer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, REDIRECT_DELAY_IN_MS);

    const countdownTimer = setInterval(() => {
      const elapsedMs = Date.now() - startedAt;
      const nextRemainingMs = Math.max(REDIRECT_DELAY_IN_MS - elapsedMs, 0);
      setRemainingMs(nextRemainingMs);
    }, 100);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
    };
  }, [isSuccess, navigate]);

  if (isLoading) {
    return (
      <SystemLoading
        title="Confirmando seu e-mail"
        name={parsedUserName}
        message="Estamos validando seus dados e liberando o acesso da sua conta."
      />
    );
  }

  if (isError) {
    return (
      <Container>
        <StyledWrapper>
          <Logo customHeight="60%" />
          <Box>
            <InputsBox>
              <Title>Não foi possível confirmar</Title>
              <Description>
                {buildEmailConfirmationErrorMessage(error)}
              </Description>
              <Message>
                Você pode voltar para o login e solicitar um novo link de
                confirmação.
              </Message>
              <Button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
              >
                Voltar para login
              </Button>
            </InputsBox>
          </Box>
        </StyledWrapper>
      </Container>
    );
  }

  if (!isSuccess) {
    return (
      <SystemLoading
        title="Quase lá"
        name={parsedUserName}
        message="Estamos finalizando a confirmação da sua conta."
      />
    );
  }

  return (
    <Container>
      <StyledWrapper>
        <Logo customHeight="60%" />
        <Box>
          <InputsBox>
            <Title>
              {firstName
                ? `Conta confirmada, ${firstName}!`
                : 'Conta confirmada!'}
            </Title>
            <Description>
              Seu endereço de e-mail foi verificado com sucesso.
            </Description>
            {parsedUserName ? <NameBadge>{parsedUserName}</NameBadge> : null}
            <Message>
              Agora você já pode acessar sua conta. Redirecionando em{' '}
              {secondsToRedirect}s.
            </Message>
            <RedirectProgressBar
              role="progressbar"
              aria-label="Progresso de redirecionamento"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(redirectProgress)}
            >
              <RedirectProgressFill style={{ width: `${redirectProgress}%` }} />
            </RedirectProgressBar>
            <Button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
            >
              Entrar no login agora
            </Button>
          </InputsBox>
        </Box>
      </StyledWrapper>
    </Container>
  );
}
