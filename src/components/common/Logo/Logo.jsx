import PropTypes from 'prop-types';

import { Logo as LogoDiv } from './Styles';
import { Logo as logoImg } from '../../../assets';

export default function Logo({ customHeight, customWidth }) {
  return (
    <LogoDiv
      $width={customWidth}
      $height={customHeight}
      src={logoImg}
      alt="Logo da SGLA"
    />
  );
}

Logo.propTypes = {
  customHeight: PropTypes.string,
  customWidth: PropTypes.string,
};

Logo.defaultProps = {
  customHeight: undefined,
  customWidth: undefined,
};
