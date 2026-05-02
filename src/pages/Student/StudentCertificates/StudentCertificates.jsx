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

  const groupedLeagues = useMemo(() => {
    const map = {};

    allMemberships.forEach((membership) => {
      const { _id } = membership;
      const leagueId = normalizeId(
        membership.league?._id || membership.league || 'unica_liga',
      );

      if (!map[leagueId]) {
        map[leagueId] = {
          id: leagueId,
          certificate: null,
          membershipsHistory: [],
        };
      }

      map[leagueId].membershipsHistory.push(membership);

      if (!map[leagueId].certificate) {
        const cert = certificates.find((c) => {
          const certMembershipId = normalizeId(
            c.leagueMembership?._id || c.leagueMembership,
          );
          return certMembershipId === normalizeId(_id);
        });

        if (cert) {
          map[leagueId].certificate = cert;
        }
      }
    });

    return Object.values(map).map((group) => {
      const sortedHistory = [...group.membershipsHistory].sort((a, b) => {
        return String(b._id).localeCompare(String(a._id));
      });

      const activeMembership = sortedHistory.find((m) => m.isActive);

      let isLeagueActive = false;
      if (!group.certificate && activeMembership) {
        isLeagueActive = true;
      }

      let displayRole = 'N/A';
      if (isLeagueActive) {
        displayRole = activeMembership.role;
      } else if (sortedHistory.length > 0) {
        displayRole = sortedHistory[0].role;
      }

      return {
        ...group,
        isActive: isLeagueActive,
        currentRole: displayRole,
        mainActiveMembershipId: isLeagueActive ? activeMembership._id : null,
        membershipsHistory: sortedHistory,
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
        'Erro ao baixar o certificado.',
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

      {!isLoading && groupedLeagues.length === 0 && (
        <EmptyState>
          Nenhum vínculo ou liga foi encontrada para o seu usuário.
        </EmptyState>
      )}

      {!isLoading &&
        groupedLeagues.map((group) => {
          const {
            isActive,
            currentRole,
            certificate,
            id,
            membershipsHistory,
            mainActiveMembershipId,
          } = group;

          let cardSubText = 'Seu vínculo com a liga está inativo';
          let cardMainTitle = 'RESUMO DO MEU CERTIFICADO FINAL (SGLA)';
          if (isActive) {
            cardSubText = 'Seu vínculo com a liga está ativo';
            cardMainTitle = 'RESUMO DO MEU CERTIFICADO PARCIAL (SGLA)';
          }

          let issueDateText = 'N/A';
          if (isActive) {
            issueDateText = 'Em andamento';
          } else if (certificate?.issueDate) {
            const date = new Date(certificate.issueDate);
            issueDateText = !Number.isNaN(date.getTime())
              ? date.toLocaleDateString('pt-BR')
              : 'Data inválida';
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
                <FiDownload size={20} /> BAIXAR CERTIFICADO FINAL
              </ActionButton>
            );
          } else {
            actionArea = (
              <InfoMessage $type="inactive">
                Certificado final ainda não disponível para download.
              </InfoMessage>
            );
          }

          return (
            <Card key={id}>
              <CardHeader>
                <CardIcon>
                  <TbCertificate />
                </CardIcon>
                <CardTitleGroup>
                  <h2>{cardMainTitle}</h2>
                  <p>{cardSubText}</p>
                </CardTitleGroup>
              </CardHeader>

              <InfoGrid>
                <InfoBlock>
                  <span>{isActive ? 'Cargo Atual' : 'Último Cargo'}</span>
                  <strong>{currentRole}</strong>
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
                <HistoryTitle>Histórico de cargos na liga</HistoryTitle>
                <HistoryList>
                  {membershipsHistory.map((m) => {
                    const { _id, role } = m;
                    return (
                      <HistoryItem key={_id}>
                        <Bullet />
                        {role || 'Cargo não especificado'}
                        {_id === mainActiveMembershipId && (
                          <ActiveBadge>Ativo</ActiveBadge>
                        )}
                      </HistoryItem>
                    );
                  })}
                </HistoryList>
              </HistoryContainer>

              {actionArea}
            </Card>
          );
        })}
    </Content>
  );
}
