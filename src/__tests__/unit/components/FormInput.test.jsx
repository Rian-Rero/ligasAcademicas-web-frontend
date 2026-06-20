import { screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import FormInput from '../../../components/features/FormInput/FormInput';
import { renderWithProviders } from '../../helpers/renderWithProviders';

function Fixture({
  name = 'email',
  errors = {},
  placeholder = 'Digite aqui',
  ...props
}) {
  const { register } = useForm();
  return (
    <FormInput
      name={name}
      placeholder={placeholder}
      errors={errors}
      register={register}
      {...props}
    />
  );
}

function renderFixture(props = {}) {
  return renderWithProviders(<Fixture {...props} />);
}

describe('FormInput', () => {
  describe('label', () => {
    it('renders the label text when label prop is provided', () => {
      renderFixture({ label: 'Endereço de e-mail' });
      expect(screen.getByText('Endereço de e-mail')).toBeInTheDocument();
    });

    it('does not render a label element when label is omitted', () => {
      renderFixture();
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('associates label with input via htmlFor', () => {
      renderFixture({ name: 'username', label: 'Nome de usuário' });
      expect(screen.getByLabelText('Nome de usuário')).toBeInTheDocument();
    });
  });

  describe('input element', () => {
    it('renders an input with the given placeholder', () => {
      renderFixture({ placeholder: 'Seu e-mail' });
      expect(screen.getByPlaceholderText('Seu e-mail')).toBeInTheDocument();
    });

    it('renders a text input when type is "text"', () => {
      renderFixture({ type: 'text' });
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('renders input with type="password" when specified', () => {
      const { container } = renderFixture({ type: 'password' });
      expect(
        container.querySelector('input[type="password"]'),
      ).toBeInTheDocument();
    });

    it('sets aria-label to ariaLabel prop when provided', () => {
      renderFixture({ ariaLabel: 'Campo de senha' });
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-label',
        'Campo de senha',
      );
    });

    it('falls back aria-label to label when ariaLabel is absent', () => {
      renderFixture({ label: 'E-mail' });
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-label',
        'E-mail',
      );
    });
  });

  describe('error state', () => {
    it('displays error message when errors[name].message is set', () => {
      renderFixture({
        name: 'email',
        errors: { email: { message: 'E-mail inválido' } },
      });
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
    });

    it('does not display error when errors object is empty', () => {
      renderFixture({ name: 'email', errors: {} });
      expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
    });

    it('sets aria-invalid="true" when there is an error', () => {
      renderFixture({
        name: 'email',
        errors: { email: { message: 'Obrigatório' } },
      });
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('sets aria-invalid="false" when there is no error', () => {
      renderFixture({ name: 'email', errors: {} });
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'false',
      );
    });

    it('links input to error message via aria-describedby', () => {
      renderFixture({
        name: 'email',
        errors: { email: { message: 'Campo obrigatório' } },
      });
      const input = screen.getByRole('textbox');
      const errorEl = screen.getByText('Campo obrigatório');
      expect(input).toHaveAttribute('aria-describedby', errorEl.id);
    });
  });
});
