import PropTypes from 'prop-types';

import {
  Container,
  Label,
  InputWrapper,
  Input,
  ErrorMessage,
  Icon,
} from './Styles';

export default function FormInput({
  name,
  label,
  hideLabel,
  ariaLabel,
  placeholder,
  errors,
  register,
  rules,
  type,
  backgroundColor,
  borderRadius,
  borderString,
  customColor,
  icon: IconComponent,
}) {
  const errorMessage = errors?.[name]?.message;
  const errorMessageId = `${name}-error`;

  return (
    <Container>
      {label && (
        <Label htmlFor={name} $visuallyHidden={hideLabel}>
          {label}
        </Label>
      )}
      <InputWrapper>
        {IconComponent && <Icon as={IconComponent} />}
        <Input
          id={name}
          type={type}
          $error={!!errorMessage}
          placeholder={placeholder}
          aria-label={ariaLabel ?? label ?? placeholder}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? errorMessageId : undefined}
          {...register(name, rules)}
          $backgroundColor={backgroundColor}
          $borderString={borderString}
          $borderRadius={borderRadius}
          $customColor={customColor}
          noValidate
        />
      </InputWrapper>
      {errorMessage && (
        <ErrorMessage id={errorMessageId}>{errorMessage}</ErrorMessage>
      )}
    </Container>
  );
}

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hideLabel: PropTypes.bool,
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object,
  type: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.string,
  borderString: PropTypes.string,
  customColor: PropTypes.string,
  icon: PropTypes.elementType,
};

FormInput.defaultProps = {
  label: null,
  hideLabel: false,
  ariaLabel: null,
  icon: null,
  rules: {},
  type: 'text',
  backgroundColor: null,
  borderRadius: null,
  borderString: null,
  customColor: null,
};
