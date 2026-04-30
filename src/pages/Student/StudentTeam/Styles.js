import styled from 'styled-components';

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const HeaderSection = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const HeaderTitle = styled.h1`
  color: #ffffffa2;
  line-height: 1;
  font-size: 1.8rem;
`;

export const ActionButton = styled.button`
  min-height: 4.3rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 0 1.2rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 700;
  cursor: pointer;

  background: linear-gradient(120deg, #008cff, #2b66ff 58%, #0b9de8);
  box-shadow: 0 0.8rem 2rem rgba(0, 140, 255, 0.28);

  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.82;
    cursor: not-allowed;
    transform: none;
    filter: saturate(0.9);
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 163, 255, 0.9);
    outline-offset: 2px;
  }
`;

export const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 1.2rem;
  display: inline-flex;
  color: rgba(255, 255, 255, 0.65);
  font-size: 1.5rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  min-height: 4.5rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(13, 22, 45, 0.65);
  color: #ffffff;
  padding: 0 1.2rem 0 3.8rem;
  font-size: 1.45rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.52);
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 163, 255, 0.8);
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.18);
  }
`;

export const SectionHeading = styled.h3`
  font-size: 1.8rem;
  display: grid;
  gap: 0.3rem;

  strong {
    font-size: 1.8rem;
  }

  span {
    display: grid;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.5rem;
  }

  .members-subtitle {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0.35rem;
    gap: 0.4rem;
    display: grid;
  }
`;

export const SummaryCard = styled.div`
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: 2rem;
  display: grid;
  gap: 1.4rem;
`;

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 30rem;
  overflow-y: auto;
  padding-right: 0.4rem;

  &::-webkit-scrollbar {
    width: 0.6rem;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.24);
    border-radius: 999px;
  }
`;

export const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  color: #fff;
  font-size: 1.7rem;
  border: 1px solid transparent;
  border-radius: 1.2rem;
`;

export const TeamAvatar = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center / cover no-repeat`
      : 'radial-gradient(circle at top left, #57b8ff 10%, #0f2f6e 60%)'};
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

export const ViewMemberProfileButton = styled.button`
  width: 15rem;
  height: 4rem;
  margin-left: auto;
  background: linear-gradient(135deg, #196481, #4ebec6);
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(42, 168, 177, 0.65);
    filter: brightness(1.1);
  }

  svg {
    min-width: 2.4rem;
    min-height: 2.4rem;
  }
`;

export const MemberModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(9, 15, 26, 0.72);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 1.5rem;
`;

export const MemberModalCard = styled.div`
  width: min(56rem, 100%);
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 2px solid transparent;
  border-radius: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55);
  padding: 2rem;
  display: grid;
  gap: 2rem;
  pointer-events: auto;
`;

export const MemberModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const MemberModalTitle = styled.h2`
  font-size: 1.9rem;
`;

export const MemberModalSubtitle = styled.span`
  display: block;
  margin-top: 0.4rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.3rem;
`;

export const MemberModalCloseButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 999px;
  padding: 0.6rem 1.6rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.16);
  }
`;

export const MemberModalBody = styled.div`
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 1.8rem;
  align-items: start;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const MemberModalAvatar = styled.div`
  width: 8.6rem;
  height: 8.6rem;
  border-radius: 50%;
  background: ${({ $imageUrl }) =>
    $imageUrl
      ? `url(${$imageUrl}) center / cover no-repeat`
      : 'radial-gradient(circle at top left, #57b8ff 10%, #0f2f6e 60%)'};
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
`;

export const MemberModalItem = styled.div`
  display: grid;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

export const MemberModalLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.55);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

export const MemberModalValue = styled.span`
  font-size: 1.5rem;
  color: #fff;
`;
