import PropTypes from 'prop-types';

import { Container, Logo, Message, NameTag, Title } from './Styles';
import logoSGLA from '../../../assets/logoSGLA.png';

export default function SystemLoading({ title, message, name }) {
  const parsedName = typeof name === 'string' ? name.trim() : '';

  return (
    <Container role="status" aria-live="polite">
      <Logo src={logoSGLA} alt="Logo SGLA" />
      <Title>{title}</Title>
      {parsedName ? <NameTag>{parsedName}</NameTag> : null}
      {message ? <Message>{message}</Message> : null}
    </Container>
  );
}

SystemLoading.defaultProps = {
  title: 'Carregando',
  message: '',
  name: '',
};

SystemLoading.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  name: PropTypes.string,
};
