import styled from 'styled-components';

export const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export const MainBlock = styled.section`
  width: 100%;
  max-width: 1200px;
  max-height: 60rem;
  border-radius: 24px;
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 1px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(12px);
  overflow: hidden;
`;

export const SystemVisualization = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const SystemImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

export const OverlayContent = styled.div`
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 90%;
  z-index: 10;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2.1rem, 6vw, 4.3rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1),
    rgba(57, 150, 226, 0.84),
    rgba(255, 140, 0, 0.76)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 1.2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 700px;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`;

export const CenteredButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1e88e5;
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 0 20px rgba(30, 136, 229, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);

  &:hover {
    background: #1565c0;
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(30, 136, 229, 0.7);
  }
`;

export const FloatingTag = styled.div`
  position: absolute;
  top: ${(props) => props.$top || 'auto'};
  bottom: ${(props) => props.$bottom || 'auto'};
  left: ${(props) => props.$left || 'auto'};
  right: ${(props) => props.$right || 'auto'};
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  background:
    linear-gradient(rgb(16, 33, 75), rgb(2, 15, 46)) padding-box,
    linear-gradient(135deg, #055ea7 0%, #ad5503 100%) border-box;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid transparent;

  width: 14rem;
  height: 13rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);

  color: #e2e8f0;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.1;

  span {
    font-size: 2.5rem;
    color: ${(props) => (props.$color === 'orange' ? '#ffab4d' : '#56b6ff')};
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  min-height: 10rem;
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  border: 1px solid transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 2rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  backdrop-filter: blur(12px);
`;

export const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  font-size: 2.5rem;
  border: 1px solid transparent;
  background:
    linear-gradient(rgb(26, 49, 104), rgba(18, 22, 31, 1)) padding-box,
    linear-gradient(135deg, #008cff 0%, #f6a04f 100%) border-box;
  flex-shrink: 0;

  svg {
    color: #f4af5a;
  }
`;

export const FeatureTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const FeatureTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
`;

export const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.3rem;
  line-height: 1.4;
`;
