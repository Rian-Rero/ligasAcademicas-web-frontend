import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SystemLoading from '../../../components/features/SystemLoading/SystemLoading';
import { renderWithProviders } from '../../helpers/renderWithProviders';

function renderLoading(props = {}) {
  return renderWithProviders(<SystemLoading {...props} />);
}

describe('SystemLoading', () => {
  it('renders the title text when provided', () => {
    renderLoading({ title: 'Carregando' });
    expect(screen.getByText('Carregando')).toBeInTheDocument();
  });

  it('renders a custom title', () => {
    renderLoading({ title: 'Processando dados' });
    expect(screen.getByText('Processando dados')).toBeInTheDocument();
  });

  it('renders the name tag when name is a non-empty string', () => {
    renderLoading({ name: 'João Silva' });
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('does not render the name tag when name is an empty string', () => {
    const { container } = renderLoading({ name: '' });
    // The title text exists but no separate name tag
    expect(container.querySelectorAll('[data-name]')).toHaveLength(0);
  });

  it('renders the message when provided', () => {
    renderLoading({ message: 'Aguarde, carregando dados...' });
    expect(
      screen.getByText('Aguarde, carregando dados...'),
    ).toBeInTheDocument();
  });

  it('has role="status" for screen-reader live region', () => {
    renderLoading();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the SGLA logo image', () => {
    renderLoading();
    expect(screen.getByAltText('Logo SGLA')).toBeInTheDocument();
  });

  it('ignores non-string names gracefully and renders nothing for the name tag', () => {
    renderLoading({ name: null });
    expect(screen.queryByText('null')).not.toBeInTheDocument();
  });

  it('does not render a <small> message element when message is empty', () => {
    const { container } = renderLoading({ message: '' });
    expect(container.querySelector('small')).not.toBeInTheDocument();
  });
});
