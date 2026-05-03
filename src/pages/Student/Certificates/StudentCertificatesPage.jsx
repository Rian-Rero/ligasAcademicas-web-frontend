import { useEffect, useState } from 'react';

import {
  Download as DownloadIcon,
  FilePresent as FilePresentIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import styled from 'styled-components';

import { useGetCertificates } from '../../../hooks/query/certificate';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';

const Container = styled(Box)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderSection = styled(Box)`
  margin-bottom: 2rem;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }
`;

const CertificateCard = styled(Card)`
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
`;

const CertificateIcon = styled(Box)`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StatsContainer = styled(Stack)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatBox = styled(Box)`
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  text-align: center;
`;

function StudentCertificatesPage({ userId }) {
  const [membershipIds, setMembershipIds] = useState([]);

  const { data: memberships = [], isLoading: loadingMemberships } =
    useGetLeagueMemberships({
      filters: { user: userId, isActive: false },
    });

  const {
    data: certificates = [],
    isLoading: loadingCerts,
    isError,
  } = useGetCertificates({
    filters:
      membershipIds.length > 0
        ? { leagueMembership: { $in: membershipIds } }
        : {},
    enabled: membershipIds.length > 0,
  });

  useEffect(() => {
    if (memberships.length > 0) {
      setMembershipIds(memberships.map((m) => m._id));
    }
  }, [memberships]);

  const isLoading = loadingMemberships || loadingCerts;

  const handleDownloadCertificate = (certificate) => {
    if (certificate.pdfUrl) {
      window.open(certificate.pdfUrl, '_blank');
    }
  };

  if (isError) {
    return (
      <Container>
        <Alert severity="error">
          Erro ao carregar certificados. Tente novamente.
        </Alert>
      </Container>
    );
  }

  let content;

  if (isLoading) {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (certificates.length === 0) {
    content = (
      <Alert severity="info" icon={<FilePresentIcon />}>
        Você ainda não possui certificados. Participe de ligas e complete ciclos
        para receber seus certificados!
      </Alert>
    );
  } else {
    content = (
      <Grid container spacing={3}>
        {certificates.map((cert) => {
          const membership = memberships.find(
            (m) => m._id === cert.leagueMembership,
          );
          const issueDate = new Date(cert.issueDate);

          return (
            <Grid item xs={12} sm={6} md={4} key={cert._id}>
              <CertificateCard>
                <CardContent>
                  <CertificateIcon>
                    <FilePresentIcon
                      sx={{ fontSize: '2.5rem', color: '#1976d2' }}
                    />
                  </CertificateIcon>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Certificado de Participação
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 1 }}
                  >
                    {membership?.academicLeague?.name ||
                      membership?.university?.name ||
                      'Liga Acadêmica'}
                  </Typography>

                  <Chip
                    label={`${cert.workLoadHours} horas`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />

                  <StatsContainer>
                    <StatBox>
                      <Typography variant="caption" color="textSecondary">
                        Função
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {membership?.role}
                      </Typography>
                    </StatBox>

                    <StatBox>
                      <Typography variant="caption" color="textSecondary">
                        Data
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {issueDate.toLocaleDateString('pt-BR')}
                      </Typography>
                    </StatBox>
                  </StatsContainer>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadCertificate(cert)}
                    sx={{ mt: 2 }}
                  >
                    Baixar PDF
                  </Button>
                </CardContent>
              </CertificateCard>
            </Grid>
          );
        })}
      </Grid>
    );
  }

  return (
    <Container>
      <HeaderSection>
        <h1>Meus Certificados</h1>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
          Visualize e baixe seus certificados de participação
        </Typography>
      </HeaderSection>

      {content}
    </Container>
  );
}

export default StudentCertificatesPage;
