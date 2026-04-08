import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
} from 'react-icons/ri';

import { StyledContainer } from './Styles';

const toastIconByType = {
  success: <RiCheckboxCircleFill color="#00d68f" size={20} />,
  error: <RiCloseCircleFill color="#ff4d6d" size={20} />,
  warning: <RiErrorWarningFill color="#ff9f1c" size={20} />,
  info: <RiInformationFill color="#38b6ff" size={20} />,
  default: <RiInformationFill color="#38b6ff" size={20} />,
};

function toastIcon({ type }) {
  return toastIconByType[type] ?? toastIconByType.default;
}

export default function AddToast() {
  return (
    <StyledContainer
      position="bottom-right"
      autoClose={4800}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnHover
      draggable
      icon={toastIcon}
    />
  );
}
