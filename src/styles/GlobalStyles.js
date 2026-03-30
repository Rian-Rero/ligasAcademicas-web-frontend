import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

* {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  font-family: ${(props) => props.theme.fonts.openSans}, sans-serif;
  font-size: 1.4rem;

  background: #06090f;
  position: relative;
  color: #fff;

  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  top: -20%;
  left: -20%;
  width: 70%;
  height: 70%;

  background: radial-gradient(
    circle,
    rgba(0, 140, 255, 0.25),
    transparent 70%
  );

  filter: blur(120px);
  z-index: -1;
}

body::after {
  content: "";
  position: fixed;
  bottom: -20%;
  right: -20%;
  width: 70%;
  height: 70%;

  background: radial-gradient(
    circle,
    rgba(255, 140, 0, 0.25),
    transparent 70%
  );

  filter: blur(120px);
  z-index: -1;
}

html,
body,
#root {
  height: 100%;
}

html {
  scroll-behavior: smooth;
}
`;
