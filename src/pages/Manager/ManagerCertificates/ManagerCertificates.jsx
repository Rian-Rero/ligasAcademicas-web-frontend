import { AiOutlineTable } from 'react-icons/ai';
import { FaRegFilePdf } from 'react-icons/fa6';
import { MdOutlineFileUpload } from 'react-icons/md';
import { TbCertificate, TbFilePlus } from 'react-icons/tb';

import {
  Content,
  HeaderSection,
  HeaderTitle,
  Card,
  CardHeader,
  CardIcon,
  CardTitleGroup,
  HistoryContainer,
  HistoryTitle,
  HeaderWrapper,
  StyledTable,
  NameCell,
  StatusBadge,
  ActionLink,
  ActionButton,
  TopCards,
} from './Styles';

export default function ManagerCertificates() {
  return (
    <Content>
      <HeaderSection>
        <HeaderTitle>Gerenciar Certificados</HeaderTitle>
      </HeaderSection>

      <TopCards>
        <Card>
          <CardHeader>
            <CardIcon>
              <TbFilePlus />
            </CardIcon>
            <CardTitleGroup>
              <h2>Criar / Anexar Modelo</h2>
              <p>
                Desenhe um novo modelo base ou anexe o modelo oficial assinado
                para geração automática de todos os documentos.
              </p>
            </CardTitleGroup>
          </CardHeader>
          <ActionButton type="button">
            Criar ou anexar modelo oficial <MdOutlineFileUpload />
          </ActionButton>
        </Card>
        <Card>
          <CardHeader>
            <CardIcon>
              <TbCertificate />
            </CardIcon>
            <CardTitleGroup>
              <h2>Modelo Base Atual</h2>
              <p>
                Visualize o modelo base atualmente em uso para geração dos
                certificados. Certifique-se de que ele esteja atualizado e em
                conformidade com os padrões da liga.
              </p>
            </CardTitleGroup>
          </CardHeader>
          <ActionButton type="button">
            Visualizar PDF
            <FaRegFilePdf />
          </ActionButton>
        </Card>
      </TopCards>

      <HistoryContainer>
        <HeaderWrapper>
          <AiOutlineTable size={28} color="#a0aab4" />
          <HistoryTitle>Histórico de Modelos Base</HistoryTitle>
        </HeaderWrapper>

        <StyledTable>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Autor</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <NameCell>
                  <TbCertificate size={20} color="#a0aab4" />
                  v1
                </NameCell>
              </td>
              <td>Maio/2024</td>
              <td>João Silva</td>
              <td>
                <StatusBadge>Ativo</StatusBadge>
              </td>
              <td>
                <ActionLink>[Ver]</ActionLink>{' '}
                <ActionLink>[Redefinir]</ActionLink>
              </td>
            </tr>
          </tbody>
        </StyledTable>
      </HistoryContainer>
    </Content>
  );
}
