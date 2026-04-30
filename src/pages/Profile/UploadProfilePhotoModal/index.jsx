import { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import { FiCamera, FiCheck, FiX } from 'react-icons/fi';

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  PreviewContainer,
  PreviewImage,
  ModalFooter,
  ModalButton,
} from './Styles';

export default function UploadProfilePhotoModal({
  isOpen,
  onClose,
  previewUrl,
  isLoading,
  onConfirm,
  onSelectFile,
  userInitials,
}) {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Alterar foto de perfil</ModalTitle>
          <ModalCloseButton
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Fechar modal"
          >
            <FiX />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <PreviewContainer>
            {previewUrl ? (
              <PreviewImage src={previewUrl} alt="Prévia da foto" />
            ) : (
              <PreviewImage as="div" $isEmpty $initials={userInitials}>
                {userInitials}
              </PreviewImage>
            )}
          </PreviewContainer>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onSelectFile}
            style={{ display: 'none' }}
          />

          {!previewUrl ? (
            <ModalButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              $variant="primary"
            >
              <FiCamera /> Selecionar foto
            </ModalButton>
          ) : null}
        </ModalBody>

        <ModalFooter>
          <ModalButton
            type="button"
            onClick={onClose}
            disabled={isLoading}
            $variant="secondary"
          >
            <FiX /> Cancelar
          </ModalButton>

          {previewUrl && (
            <ModalButton
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              $variant="primary"
            >
              <FiCheck />
              {isLoading ? 'Enviando...' : 'Confirmar'}
            </ModalButton>
          )}
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  );
}

UploadProfilePhotoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  previewUrl: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onSelectFile: PropTypes.func.isRequired,
  userInitials: PropTypes.string.isRequired,
};

UploadProfilePhotoModal.defaultProps = {
  previewUrl: '',
};
