import { Container, Logo, Text } from './Styles';
import logoSGLA from '../../../assets/logoSGLA.png';

export default function SystemLoading() {
  return (
    <Container role="status" aria-live="polite">
      <Logo src={logoSGLA} alt="Logo SGLA" />
      <Text>Carregando...</Text>
    </Container>
  );
}
