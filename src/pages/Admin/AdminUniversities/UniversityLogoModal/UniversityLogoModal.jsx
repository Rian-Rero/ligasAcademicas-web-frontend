import { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import { FiCamera, FiCheck, FiX } from 'react-icons/fi';
import { LuBuilding } from 'react-icons/lu';

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  PreviewContainer,
  PreviewImage,
  PreviewEmpty,
  ModalFooter,
  ModalButton,
} from './Styles';

export default function UniversityLogoModal({
  isOpen,
  onClose,
  previewUrl,
  isLoading,
  onConfirm,
  onSelectFile,
  universityName,
}) {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Logo da universidade</ModalTitle>
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
              <PreviewImage
                src={previewUrl}
                alt={
                  universityName
                    ? `Prévia da logo de ${universityName}`
                    : 'Prévia da logo da universidade'
                }
              />
            ) : (
              <PreviewEmpty>
                <LuBuilding />
                <strong>Sem logo selecionada</strong>
                <span>
                  Escolha uma imagem para visualizar antes de confirmar.
                </span>
              </PreviewEmpty>
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
            >
              <FiCamera /> Selecionar imagem
            </ModalButton>
          ) : null}
        </ModalBody>

        <ModalFooter>
          <ModalButton type="button" onClick={onClose} disabled={isLoading}>
            <FiX /> Cancelar
          </ModalButton>

          {previewUrl && (
            <ModalButton type="button" onClick={onConfirm} disabled={isLoading}>
              <FiCheck />
              {isLoading ? 'Enviando...' : 'Confirmar'}
            </ModalButton>
          )}
        </ModalFooter>
      </Modal>
    </ModalOverlay>
  );
}

UniversityLogoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  previewUrl: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onSelectFile: PropTypes.func.isRequired,
  universityName: PropTypes.string,
};

UniversityLogoModal.defaultProps = {
  previewUrl: '',
  universityName: '',
};
