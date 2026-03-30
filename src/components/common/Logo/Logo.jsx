import { Logo as LogoDiv } from './Styles';
import { Logo as logoImg } from '../../../assets';

export default function Logo({ customHeight, customWidth }) {
  return (
    <LogoDiv
      customWidth={customWidth}
      customHeight={customHeight}
      src={logoImg}
      alt="Logo da SGLA"
    />
  );
}
