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
  placeholder,
  errors,
  register,
  backgroundcolor,
  borderRadius,
  borderString,
  customColor,
  icon: IconComponent,
}) {
  const errorMessage = errors?.[name]?.message;

  return (
    <Container>
      {label && <Label htmlFor={name}>{label}</Label>}
      <InputWrapper>
        {IconComponent && <Icon as={IconComponent} />}
        <Input
          id={name}
          error={!!errorMessage}
          placeholder={placeholder}
          {...register(name)}
          backgroundcolor={backgroundcolor}
          borderString={borderString}
          borderradius={borderRadius}
          customColor={customColor}
        />
      </InputWrapper>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
}

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  backgroundcolor: PropTypes.string,
  borderRadius: PropTypes.string,
  borderString: PropTypes.string,
  customColor: PropTypes.string,
  icon: PropTypes.elementType,
};

FormInput.defaultProps = {
  label: null,
  icon: null,
  backgroundcolor: null,
  borderRadius: null,
  borderString: null,
  customColor: null,
};
