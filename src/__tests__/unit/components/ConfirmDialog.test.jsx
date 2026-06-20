import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { renderWithProviders } from '../../helpers/renderWithProviders';

const defaultProps = {
  isOpen: true,
  title: 'Tem certeza?',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

function renderDialog(props = {}) {
  return renderWithProviders(<ConfirmDialog {...defaultProps} {...props} />);
}

describe('ConfirmDialog', () => {
  describe('visibility', () => {
    it('renders nothing when isOpen is false', () => {
      const { container } = renderDialog({ isOpen: false });
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the dialog when isOpen is true', () => {
      renderDialog();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('marks the dialog as modal via aria-modal', () => {
      renderDialog();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('content', () => {
    it('renders the title', () => {
      renderDialog({ title: 'Excluir registro' });
      expect(screen.getByText('Excluir registro')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
      renderDialog({ description: 'Esta ação não pode ser desfeita.' });
      expect(
        screen.getByText('Esta ação não pode ser desfeita.'),
      ).toBeInTheDocument();
    });

    it('renders children inside the dialog', () => {
      renderWithProviders(
        <ConfirmDialog {...defaultProps}>
          <p>Conteúdo adicional</p>
        </ConfirmDialog>,
      );
      expect(screen.getByText('Conteúdo adicional')).toBeInTheDocument();
    });

    it('renders confirm and cancel buttons with their labels', () => {
      renderDialog({ confirmLabel: 'Deletar', cancelLabel: 'Voltar' });
      expect(
        screen.getByRole('button', { name: 'Deletar' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Voltar' }),
      ).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onConfirm when the confirm button is clicked', () => {
      const onConfirm = vi.fn();
      renderDialog({ onConfirm });
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it('calls onCancel when the cancel button is clicked', () => {
      const onCancel = vi.fn();
      renderDialog({ onCancel });
      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('calls onCancel when the backdrop is clicked', () => {
      const onCancel = vi.fn();
      renderDialog({ onCancel });
      fireEvent.click(screen.getByRole('presentation'));
      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('does not call onCancel when clicking inside the dialog card', () => {
      const onCancel = vi.fn();
      renderDialog({ onCancel });
      fireEvent.click(screen.getByRole('dialog'));
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when the Escape key is pressed', () => {
      const onCancel = vi.fn();
      renderDialog({ onCancel });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onCancel).toHaveBeenCalledOnce();
    });
  });

  describe('loading state', () => {
    it('disables both buttons when isLoading is true', () => {
      renderDialog({ isLoading: true });
      const buttons = screen.getAllByRole('button');
      buttons.forEach((btn) => expect(btn).toBeDisabled());
    });

    it('enables buttons when isLoading is false', () => {
      renderDialog({ isLoading: false });
      const buttons = screen.getAllByRole('button');
      buttons.forEach((btn) => expect(btn).toBeEnabled());
    });
  });
});
