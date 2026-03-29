import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    font: {
      white: '#ffffff',
      black: '#000000',
    },
    white: '#ffffff',
    grey: '#808080',
    black: '#000000',
  },

  fonts: {
    openSans: 'Open Sans, sans-serif;',
  },
};

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

Theme.propTypes = {
  children: PropTypes.node.isRequired,
};
