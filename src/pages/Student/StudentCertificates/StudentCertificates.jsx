import { useMemo } from 'react';

import { FiDownload } from 'react-icons/fi';
import { TbCertificate } from 'react-icons/tb';

import {
  Content,
  HeaderSection,
  HeaderTitle,
  EmptyState,
  Card,
  CardHeader,
  CardIcon,
  CardTitleGroup,
  InfoGrid,
  InfoBlock,
  HistoryContainer,
  HistoryTitle,
  HistoryList,
  HistoryItem,
  Bullet,
  ActiveBadge,
  ActionButton,
  InfoMessage,
} from './Styles';
import { useGetCertificates } from '../../../hooks/query/certificate';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import useAuthStore from '../../../stores/auth';
import { notifyError, notifySuccess } from '../../../utils/toast';

function normalizeId(value) {
  return String(value || '');
}

function buildRequestErrorMessage(err, fallback) {
  const responseMessage = err?.response?.data?.message;
  if (Array.isArray(responseMessage)) {
    return responseMessage.join(', ');
  }
  return responseMessage || fallback;
}

export default function StudentCertificates() {
  const user = useAuthStore((state) => state.auth?.user);
  const userId = normalizeId(user?._id);

  const { data: allMemberships = [], isLoading: isLoadingMemberships } =
    useGetLeagueMemberships({
      filters: { user: userId },
      enabled: Boolean(userId),
    });

  const { data: certificates = [], isLoading: isLoadingCertificates } =
    useGetCertificates({
      filters: { user: userId },
      enabled: Boolean(userId),
    });

  const isLoading = isLoadingMemberships || isLoadingCertificates;

  const membershipsWithCertificates = useMemo(() => {
    return allMemberships.map((membership) => {
      const matchedCertificate = certificates.find(
        (cert) =>
          normalizeId(cert.leagueMembership) === normalizeId(membership._id),
      );

      return {
        ...membership,
        certificate: matchedCertificate || null,
        history: membership.roleHistory || [
          {
            _id: membership._id,
            role: membership.role,
            isActive: membership.isActive,
          },
        ],
      };
    });
  }, [allMemberships, certificates]);

  const handleDownload = async (certificate) => {
    if (!certificate?.pdfUrl) {
      notifyError('URL do certificado não disponível');
      return;
    }

    try {
      const response = await fetch(certificate.pdfUrl);
      if (!response.ok) throw new Error('Erro ao baixar certificado');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificado-${certificate._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notifySuccess('Certificado baixado com sucesso!');
    } catch (err) {
      const message = buildRequestErrorMessage(
        err,
        'Erro ao baixar o certificado. Tente novamente',
      );
      notifyError(message);
    }
  };

  return (
    <Content>
      <HeaderSection>
        <HeaderTitle>MEUS CERTIFICADOS</HeaderTitle>
      </HeaderSection>

      {isLoading && <EmptyState>Carregando certificados...</EmptyState>}

      {!isLoading && membershipsWithCertificates.length === 0 && (
        <EmptyState>
          <TbCertificate size={64} />
          <h3>Nenhum vínculo ou certificado disponível</h3>
          <p>
            Você poderá acompanhar suas informações parciais ao entrar em uma
            liga. O certificado final será emitido após a sua desvinculação.
          </p>
        </EmptyState>
      )}

      {!isLoading &&
        membershipsWithCertificates.map((item) => {
          const { isActive, role, certificate, _id, history } = item;

          let issueDateText = 'N/A';
          if (isActive) {
            issueDateText = 'Em andamento';
          } else if (certificate?.issueDate) {
            const date = new Date(certificate.issueDate);
            issueDateText = !Number.isNaN(date.getTime())
              ? date.toLocaleDateString('pt-BR')
              : 'N/A';
          }

          let actionArea = null;
          if (isActive) {
            actionArea = (
              <InfoMessage $type="active">
                O download do certificado final estará disponível quando o
                vínculo com a liga for encerrado.
              </InfoMessage>
            );
          } else if (certificate?.pdfUrl) {
            actionArea = (
              <ActionButton onClick={() => handleDownload(certificate)}>
                <FiDownload size={20} />
                BAIXAR CERTIFICADO FINAL
              </ActionButton>
            );
          } else {
            actionArea = (
              <InfoMessage $type="inactive">
                Certificado final ainda não disponível para download
              </InfoMessage>
            );
          }

          return (
            <Card key={_id}>
              <CardHeader>
                <CardIcon>
                  <TbCertificate />
                </CardIcon>
                <CardTitleGroup>
                  <h2>
                    {isActive
                      ? 'RESUMO DO MEU CERTIFICADO PARCIAL (SGLA)'
                      : 'RESUMO DO MEU CERTIFICADO FINAL (SGLA)'}
                  </h2>
                  <p>
                    {isActive
                      ? 'Seu vínculo com a liga está ativo'
                      : 'Seu vínculo com a liga está inativo'}
                  </p>
                </CardTitleGroup>
              </CardHeader>

              <InfoGrid>
                <InfoBlock>
                  <span>Cargo Atual / Último Cargo</span>
                  <strong>{role || 'N/A'}</strong>
                </InfoBlock>

                <InfoBlock>
                  <span>Carga Horária Total</span>
                  <strong>
                    {certificate?.workLoadHours || 0}h
                    {isActive && <small>(Acumulando)</small>}
                  </strong>
                </InfoBlock>

                <InfoBlock>
                  <span>Data de Emissão</span>
                  <strong>{issueDateText}</strong>
                </InfoBlock>
              </InfoGrid>

              <HistoryContainer>
                <HistoryTitle>Histórico de Cargos na Liga</HistoryTitle>
                <HistoryList>
                  {history.map((m, index) => (
                    <HistoryItem key={m._id || index}>
                      <Bullet />
                      {m.role || 'Cargo não especificado'}
                      {m.isActive && <ActiveBadge>Ativo</ActiveBadge>}
                    </HistoryItem>
                  ))}
                </HistoryList>
              </HistoryContainer>

              {actionArea}
            </Card>
          );
        })}
    </Content>
  );
}
