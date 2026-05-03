import { useRef } from 'react';

import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import styled from 'styled-components';

const ReportContainer = styled(Paper)`
  padding: 3rem;
  margin: 2rem 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid #1976d2;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const UniversityInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UniversityLogo = styled(Avatar)`
  width: 80px !important;
  height: 80px !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 2rem;
`;

const TitleSection = styled(Box)`
  text-align: center;
  margin: 3rem 0;
`;

const CertificateTitle = styled(Typography)`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const RecipientSection = styled(Box)`
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.05) 0%,
    rgba(25, 118, 210, 0.02) 100%
  );
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem 0;
  border-left: 4px solid #1976d2;
`;

const RecipientName = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1976d2;
`;

const BodyText = styled(Typography)`
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: justify;
  margin: 2rem 0;
  color: #424242;
`;

const StatsGrid = styled(Grid)`
  margin: 2rem 0;
`;

const StatCard = styled(Card)`
  text-align: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1976d2;
`;

const FooterSection = styled(Box)`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-around;
  text-align: center;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const SignatureBox = styled(Box)`
  min-width: 150px;
`;

const SignatureLine = styled(Box)`
  border-top: 2px solid #000;
  margin: 1rem 0;
`;

const ActionsContainer = styled(Stack)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

function CertificateReport({
  certificate,
  membership,
  onClose = () => {},
  onDownload = () => {},
}) {
  const reportRef = useRef();

  if (!certificate || !membership) {
    return null;
  }

  const issueDate = new Date(certificate.issueDate);
  const universityLogo = membership.university?.logo?.url;
  const universityName = membership.university?.name || 'Instituição';

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (reportRef.current) {
      printWindow.document.write(reportRef.current.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box ref={reportRef} sx={{ '@media print': { backgroundColor: '#fff' } }}>
        <ReportContainer>
          <HeaderContainer>
            <UniversityInfo>
              <UniversityLogo src={universityLogo} alt={universityName}>
                {universityName[0]}
              </UniversityLogo>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {universityName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Sistema de Gerenciamento de Ligas Acadêmicas
                </Typography>
              </Box>
            </UniversityInfo>

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="textSecondary">
                Certificado Nº
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {certificate._id}
              </Typography>
            </Box>
          </HeaderContainer>

          <TitleSection>
            <CertificateTitle>Certificado de Participação</CertificateTitle>
            <Typography variant="subtitle1" color="textSecondary">
              Reconhecimento de contribuição acadêmica
            </Typography>
          </TitleSection>

          <RecipientSection>
            <Typography variant="caption" color="textSecondary">
              Este certificado é conferido a:
            </Typography>
            <RecipientName>{membership.user?.name}</RecipientName>
          </RecipientSection>

          <BodyText>
            Por este instrumento, certificamos que {membership.user?.name}{' '}
            participou ativamente das atividades da{' '}
            <strong>
              {membership.academicLeague?.name || membership.university?.name}
            </strong>
            , exercendo a função de <strong>{membership.role}</strong>{' '}
            {membership.squad && (
              <>
                na equipe <strong>{membership.squad.name}</strong>
              </>
            )}
            , contribuindo significativamente para o desenvolvimento de
            competências técnicas e comportamentais. Este certificado atesta o
            cumprimento de <strong>{certificate.workLoadHours} horas</strong> de
            trabalho em suas respectivas atribuições.
          </BodyText>

          <StatsGrid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent>
                  <StatValue>{certificate.workLoadHours}</StatValue>
                  <Typography variant="body2" color="textSecondary">
                    Horas
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent>
                  <StatValue>{membership.role}</StatValue>
                  <Typography variant="body2" color="textSecondary">
                    Função
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent>
                  <StatValue>{issueDate.getFullYear()}</StatValue>
                  <Typography variant="body2" color="textSecondary">
                    Ano
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard>
                <CardContent>
                  <StatValue>{issueDate.toLocaleDateString('pt-BR')}</StatValue>
                  <Typography variant="body2" color="textSecondary">
                    Data de Emissão
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </StatsGrid>

          <FooterSection>
            <SignatureBox>
              <Typography variant="caption" color="textSecondary">
                Emitido em
              </Typography>
              <SignatureLine />
              <Typography variant="caption">
                {issueDate.toLocaleDateString('pt-BR')}
              </Typography>
            </SignatureBox>

            <SignatureBox>
              <SignatureLine />
              <Typography variant="caption">
                Assinatura do Responsável
              </Typography>
            </SignatureBox>

            <SignatureBox>
              <Typography variant="caption" color="textSecondary">
                Certificado Autêntico
              </Typography>
              <SignatureLine />
              <Typography variant="caption">Administração</Typography>
            </SignatureBox>
          </FooterSection>
        </ReportContainer>
      </Box>

      <ActionsContainer>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => onDownload(certificate)}
        >
          Baixar PDF
        </Button>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Imprimir
        </Button>
        {onClose && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CloseIcon />}
            onClick={onClose}
          >
            Fechar
          </Button>
        )}
      </ActionsContainer>
    </Box>
  );
}

export default CertificateReport;
