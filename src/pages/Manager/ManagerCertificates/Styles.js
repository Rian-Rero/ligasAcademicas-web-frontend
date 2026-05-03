import styled from 'styled-components';

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TopCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.8rem;
  min-height: 25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const HeaderSection = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
  margin-bottom: 1rem;
`;

export const HeaderTitle = styled.h1`
  color: #ffffffa2;
  line-height: 1;
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const HelperText = styled.p`
  margin: 0.8rem 0 0;
  color: rgba(255, 255, 255, 0.66);
  font-size: 1.35rem;
  line-height: 1.5;
  max-width: 72rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 2rem;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);

  svg {
    color: rgba(255, 255, 255, 0.3);
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.8rem;
    color: #fff;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.4rem;
    max-width: 40rem;
    line-height: 1.5;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const Label = styled.span`
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const fieldStyles = `
  width: 100%;
  min-height: 4.4rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(13, 22, 45, 0.65);
  color: #ffffff;
  padding: 0 1rem;
  font-size: 1.35rem;

  &:focus {
    outline: none;
    border-color: rgba(0, 163, 255, 0.85);
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.18);
  }
`;

export const TextInput = styled.input`
  ${fieldStyles}
`;

export const SelectInput = styled.select`
  ${fieldStyles}
`;

export const CardSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
`;

export const CardSummaryItem = styled.div`
  padding: 1rem 1.2rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const CardMeta = styled.span`
  display: block;
  color: rgba(255, 255, 255, 0.65);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
`;

export const CardValue = styled.strong`
  color: #ffffff;
  font-size: 1.9rem;
  font-weight: 700;
`;

export const DetailPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 1.4rem;
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;

  h3 {
    color: #fff;
    font-size: 1.6rem;
    margin: 0;
  }

  p {
    margin: 0.5rem 0 0;
    color: rgba(255, 255, 255, 0.62);
    font-size: 1.3rem;
  }
`;

export const DetailMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailMetaItem = styled.div`
  padding: 1rem 1.2rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const DetailMetaLabel = styled.span`
  display: block;
  color: rgba(255, 255, 255, 0.62);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
`;

export const DetailMetaValue = styled.strong`
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
`;

export const TableButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

export const TableButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  border: 1px solid
    ${({ $primary }) =>
      $primary ? 'rgba(0, 163, 255, 0.7)' : 'rgba(255, 255, 255, 0.12)'};
  background: ${({ $primary }) =>
    $primary ? 'rgba(0, 140, 255, 0.18)' : 'rgba(255, 255, 255, 0.05)'};
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: rgba(0, 163, 255, 0.85);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

export const TableEmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.62);
  font-size: 1.4rem;
`;

export const Card = styled.div`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CardIcon = styled.div`
  width: 9rem;
  height: 5rem;
  border-radius: 1.2rem;
  color: #ffffff;
  display: grid;
  place-items: start;

  svg {
    width: 3rem;
    height: 3rem;
  }
`;

export const CardTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  margin-top: 1rem;

  h2 {
    font-size: 2rem;
    color: #fff;
    margin: 0;
  }

  p {
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }
`;

export const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 1px solid transparent;
  border-radius: 1.6rem;
  padding: 2.4rem;
  gap: 2rem;
  width: 100%;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

export const HistoryTitle = styled.h2`
  font-size: 1.8rem;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin: 0;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 1.4rem;

  th {
    color: #a0aab4;
    font-weight: 500;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  td {
    color: rgba(255, 255, 255, 0.9);
    padding: 1.6rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
    padding-bottom: 0;
  }

  tbody tr {
    transition: background-color 0.18s ease;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

export const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: capitalize;

  color: ${({ $active }) => ($active ? '#2abf75' : '#e69b59')};
  border: 1px solid ${({ $active }) => ($active ? '#2abf75' : '#e69b59')};
  background: ${({ $active }) =>
    $active ? 'rgba(42, 191, 117, 0.08)' : 'rgba(230, 155, 89, 0.08)'};
`;

export const ActionLink = styled.span`
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  margin-right: 0.8rem;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

export const ActionButton = styled.button`
  padding: 1.2rem 2.4rem;
  border-radius: 1.2rem;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #196481, #4ebec6);
  box-shadow: 0 4px 15px rgba(79, 159, 165, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-self: center;
  justify-content: center;
  gap: 1rem;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 240, 255, 0.65);
    filter: brightness(1.1);
  }

  @media (max-width: 760px) {
    width: 100%;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`;
