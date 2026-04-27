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

html,
body {
  scrollbar-width: thin;
  scrollbar-color: rgba(142, 97, 53, 0.59) rgba(255, 255, 255, 0.06);
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 0.55rem;
}

html::-webkit-scrollbar-track,
body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
}

html::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb {
  background: linear-gradient(
      rgba(139, 76, 34, 0.6),
      rgba(224, 137, 51, 0.59)
    )
    padding-box;
  border-radius: 999px;
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

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
`;
