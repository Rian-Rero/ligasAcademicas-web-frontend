import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

const fallbackToastTextColor = '#ffffff';
const fallbackToastFont = 'Open Sans, sans-serif';

export const StyledContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    width: min(92vw, 38rem);
    padding: 1rem;
  }

  .Toastify__toast {
    min-height: 6rem;
    padding: 1.2rem 1.4rem;
    border-radius: 1.6rem;
    border: 1px solid transparent;

    background:
      linear-gradient(165deg, rgba(7, 18, 35, 0.9), rgba(11, 29, 54, 0.64))
        padding-box,
      linear-gradient(
          130deg,
          rgba(0, 140, 255, 0.7),
          rgba(255, 140, 0, 0.58),
          rgba(255, 255, 255, 0.42)
        )
        border-box;

    box-shadow:
      0 1.2rem 2.8rem rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);

    backdrop-filter: blur(10px);
    color: ${({ theme }) =>
      theme?.colors?.font?.white ?? fallbackToastTextColor};
    font-family: ${({ theme }) => theme?.fonts?.openSans ?? fallbackToastFont};
    font-size: 1.45rem;
  }

  .Toastify__toast--success {
    border-left: 0.4rem solid #00d68f;
  }

  .Toastify__toast--error {
    border-left: 0.4rem solid #ff4d6d;
  }

  .Toastify__toast--warning {
    border-left: 0.4rem solid #ff9f1c;
  }

  .Toastify__toast--info {
    border-left: 0.4rem solid #38b6ff;
  }

  .Toastify__toast-body {
    margin: 0;
    padding: 0;
    line-height: 1.4;
    font-weight: 600;
  }

  .Toastify__toast-icon {
    width: 2rem;
    margin-inline-end: 1rem;
  }

  .Toastify__close-button {
    color: rgba(255, 255, 255, 0.84);
    opacity: 0.9;
  }

  .Toastify__close-button:hover {
    color: #ffffff;
  }

  .Toastify__progress-bar {
    height: 0.4rem;
    background: linear-gradient(90deg, #00b3ff 0%, #2b66ff 54%, #ff8c00 100%);
  }

  .Toastify__progress-bar--success {
    background: linear-gradient(90deg, #00b98a 0%, #00d68f 100%);
  }

  .Toastify__progress-bar--error {
    background: linear-gradient(90deg, #ff4d6d 0%, #ff758f 100%);
  }

  @media (max-width: 600px) {
    &&&.Toastify__toast-container {
      width: 100%;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 1rem;
    }

    .Toastify__toast {
      border-radius: 1.3rem;
      font-size: 1.35rem;
    }
  }
`;
