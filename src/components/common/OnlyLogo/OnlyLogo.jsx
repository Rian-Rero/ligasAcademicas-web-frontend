import PropTypes from 'prop-types';

import { Logo as LogoDiv } from './Styles';
import { OnlyLogo as logoImg } from '../../../assets';

export default function OnlyLogo({ customHeight, customWidth }) {
  return (
    <LogoDiv
      $width={customWidth}
      $height={customHeight}
      src={logoImg}
      alt="Logo da SGLA"
    />
  );
}

OnlyLogo.propTypes = {
  customHeight: PropTypes.string,
  customWidth: PropTypes.string,
};

OnlyLogo.defaultProps = {
  customHeight: undefined,
  customWidth: undefined,
};
