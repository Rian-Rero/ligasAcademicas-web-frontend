import { FiCalendar } from 'react-icons/fi';
import { IoArrowForward } from 'react-icons/io5';
import { LiaUniversitySolid, LiaIdBadge } from 'react-icons/lia';
import { PiUserList, PiCertificateBold } from 'react-icons/pi';
import {
  TbSchool,
  TbUsersGroup,
  TbCertificate,
  TbHierarchy2,
  TbCalendarClock,
} from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import {
  Container,
  MainBlock,
  OverlayContent,
  HeroTitle,
  HeroSubtitle,
  CenteredButton,
  SystemVisualization,
  SystemImage,
  FloatingTag,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTextContent,
  FeatureTitle,
  FeatureDescription,
} from './Styles';
import coreSystemImage from '../../assets/coreSystem.png';
import { useGetLeagueMemberships } from '../../hooks/query/leagueMembership';
import useAuthStore from '../../stores/auth';
import { hasAdminRole, hasManagerRole } from '../../utils/roles';

function getDashboardPath(authUser, memberships = []) {
  const hasManagementMembership = memberships.some((membership) =>
    hasManagerRole(membership?.role),
  );

  if (hasAdminRole(authUser?.roleKeys)) {
    return '/admin/dashboard';
  }

  if (hasManagerRole(authUser?.roleKeys) || hasManagementMembership) {
    return '/manager/dashboard';
  }

  return '/student/dashboard';
}

export default function Home() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.auth?.user);
  const isAuthenticated = Boolean(authUser?._id);

  const { data: memberships = [] } = useGetLeagueMemberships({
    filters: { user: authUser?._id, isActive: true },
    enabled: isAuthenticated,
  });

  const handleAccessSystem = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    navigate(getDashboardPath(authUser, memberships));
  };

  return (
    <Container>
      <MainBlock>
        <SystemVisualization>
          <SystemImage
            src={coreSystemImage}
            alt="Visualização do Core System"
          />

          <OverlayContent>
            <HeroTitle>
              GERENCIAMENTO CENTRALIZADO
              <br />
              PARA LIGAS ACADÊMICAS
            </HeroTitle>
            <HeroSubtitle>
              O SGLA otimiza e unifica o ecossistema universitário, da gestão de
              ligas e subequipes à emissão automatizada de certificados.
            </HeroSubtitle>

            <CenteredButton onClick={handleAccessSystem}>
              Acessar sistema
              <IoArrowForward size={18} />
            </CenteredButton>
          </OverlayContent>

          <FloatingTag $top="44%" $left="8%" $color="blue">
            <span>
              <LiaUniversitySolid />
            </span>
            Universidade
          </FloatingTag>

          <FloatingTag $top="45%" $left="28.1%" $color="blue">
            <span>
              <TbSchool />
            </span>
            Liga
            <br />
            Acadêmica
          </FloatingTag>

          <FloatingTag $top="70%" $left="12%" $color="blue">
            <span>
              <LiaIdBadge />
            </span>
            Departamentos
            <br />
            Internos
          </FloatingTag>

          <FloatingTag $top="44%" $right="-5%" $color="orange">
            <span>
              <TbCertificate />
            </span>
            Certificados
          </FloatingTag>

          <FloatingTag $top="44%" $right="15.72%" $color="orange">
            <span role="img" aria-label="Eventos">
              <FiCalendar />
            </span>
            Eventos
          </FloatingTag>

          <FloatingTag $top="70%" $right="0%" $color="orange">
            <span role="img" aria-label="Membros">
              <TbUsersGroup />
            </span>
            Membros
          </FloatingTag>
        </SystemVisualization>
      </MainBlock>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>
            <TbHierarchy2 />
          </FeatureIcon>
          <FeatureTextContent>
            <FeatureTitle>HIERARQUIA SIMPLIFICADA</FeatureTitle>
            <FeatureDescription>
              Gerencie universidades, ligas e departamentos.
            </FeatureDescription>
          </FeatureTextContent>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <PiUserList />
          </FeatureIcon>
          <FeatureTextContent>
            <FeatureTitle>ORGANIZAÇÃO DE MEMBROS</FeatureTitle>
            <FeatureDescription>
              Alocações, cargos e permissões.
            </FeatureDescription>
          </FeatureTextContent>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <TbCalendarClock />
          </FeatureIcon>
          <FeatureTextContent>
            <FeatureTitle>EVENTOS E PRESENÇA</FeatureTitle>
            <FeatureDescription>
              Agendamento, locais e Dashboards de engajamento.
            </FeatureDescription>
          </FeatureTextContent>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <PiCertificateBold />
          </FeatureIcon>
          <FeatureTextContent>
            <FeatureTitle>CERTIFICADOS AUTOMÁTICOS</FeatureTitle>
            <FeatureDescription>
              Geração, assinatura e envio personalizados.
            </FeatureDescription>
          </FeatureTextContent>
        </FeatureCard>
      </FeaturesGrid>
    </Container>
  );
}
