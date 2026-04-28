import { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import {
  Actions,
  Backdrop,
  DialogCard,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './Styles';

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isLoading,
  children,
}) {
  const confirmButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    let handleKeyDown;

    if (!isOpen) {
      lastFocusedRef.current?.focus();
    } else {
      lastFocusedRef.current = document.activeElement;

      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

      handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onCancel();
          return;
        }

        if (event.key !== 'Tab') return;

        const focusableElements = Array.from(
          dialogRef.current?.querySelectorAll(focusableSelector) || [],
        ).filter((element) => !element.hasAttribute('disabled'));

        if (!focusableElements.length) {
          event.preventDefault();
          dialogRef.current?.focus();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const isShiftPressed = event.shiftKey;

        const { activeElement } = document;

        if (isShiftPressed) {
          if (
            activeElement === firstElement ||
            !focusableElements.includes(activeElement)
          ) {
            event.preventDefault();
            lastElement.focus();
          }
          return;
        }

        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      confirmButtonRef.current?.focus();
    }

    return () => {
      if (handleKeyDown) {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <Backdrop role="presentation" onClick={onCancel}>
      <DialogCard
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {description && <DialogDescription>{description}</DialogDescription>}
          {children}
        </DialogContent>
        <Actions>
          {cancelLabel && (
            <button type="button" onClick={onCancel} disabled={isLoading}>
              {cancelLabel}
            </button>
          )}
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmLabel}
          </button>
        </Actions>
      </DialogCard>
    </Backdrop>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  confirmLabel: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  children: PropTypes.node,
};

ConfirmDialog.defaultProps = {
  description: '',
  cancelLabel: 'Cancelar',
  isLoading: false,
  children: null,
};
