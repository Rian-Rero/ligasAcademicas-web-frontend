import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import {
  Body,
  CancelButton,
  CloseButton,
  ColorInput,
  ColorPickerGroup,
  ColorPreview,
  Content,
  Footer,
  FormGroup,
  Header,
  Input,
  Label,
  SaveButton,
  Textarea,
  Title,
  Overlay,
} from './Styles';
import { PermissionSelector } from '../PermissionSelector/PermissionSelector';

const roleFormSchema = z.object({
  name: z.string().trim().min(1, 'Nome do papel é obrigatório').max(255),
  key: z
    .string()
    .trim()
    .min(3, 'A chave precisa ter pelo menos 3 caracteres')
    .max(100)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'A chave deve conter apenas letras, números e underscores',
    ),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Cor inválida')
    .default('#6366F1'),
  priority: z.coerce
    .number({ invalid_type_error: 'Prioridade inválida' })
    .int('Prioridade deve ser um número inteiro')
    .min(0, 'Prioridade deve ser maior ou igual a zero'),
  permissions: z.array(z.string()).default([]),
});

const getDefaultValues = (role) => ({
  name: role?.name || '',
  key: role?.key || '',
  description: role?.description || '',
  color: role?.color || '#6366F1',
  priority: role?.priority ?? 0,
  permissions:
    role?.permissions?.map((permission) => permission?._id || permission) || [],
});

export function EditRoleModal({
  role,
  permissions = [],
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) {
  const defaultValues = useMemo(() => getDefaultValues(role), [role]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const selectedPermissions = useWatch({
    control,
    name: 'permissions',
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [defaultValues, isOpen, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const handlePermissionsChange = (nextSelected) => {
    const normalized = nextSelected.map((item) => item?._id || item);

    setValue('permissions', normalized, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = handleSubmit((values) => {
    onSave({
      ...values,
      permissions: values.permissions || [],
      description: values.description || '',
    });
  });

  const watchedColor = useWatch({
    control,
    name: 'color',
  });

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Header>
            <Title>{role ? 'Editar Papel' : 'Novo Papel'}</Title>
            <Dialog.Close asChild>
              <CloseButton type="button">
                <X size={24} />
              </CloseButton>
            </Dialog.Close>
          </Header>

          <form onSubmit={onSubmit}>
            <Body>
              <FormGroup>
                <Label htmlFor="name">Nome do Papel *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Gerenciador de Eventos"
                  {...register('name')}
                />
                {errors.name?.message && (
                  <small style={{ color: '#fda4af' }}>
                    {errors.name.message}
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="key">Chave (identificador único) *</Label>
                <Input
                  id="key"
                  placeholder="Ex: event_manager"
                  disabled={Boolean(role)}
                  {...register('key')}
                />
                {errors.key?.message && (
                  <small style={{ color: '#fda4af' }}>
                    {errors.key.message}
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição detalhada do papel..."
                  {...register('description')}
                />
                {errors.description?.message && (
                  <small style={{ color: '#fda4af' }}>
                    {errors.description.message}
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Cor de Representação</Label>
                <ColorPickerGroup>
                  <ColorPreview color={watchedColor || '#6366F1'} />
                  <div style={{ flex: 1 }}>
                    <ColorInput type="color" {...register('color')} />
                  </div>
                </ColorPickerGroup>
                {errors.color?.message && (
                  <small style={{ color: '#fda4af' }}>
                    {errors.color.message}
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="priority">Prioridade</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  {...register('priority')}
                />
                {errors.priority?.message && (
                  <small style={{ color: '#fda4af' }}>
                    {errors.priority.message}
                  </small>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Permissões do papel</Label>
                <PermissionSelector
                  permissions={permissions}
                  selectedPermissions={selectedPermissions || []}
                  onPermissionsChange={handlePermissionsChange}
                  searchPlaceholder="Buscar permissões para este papel..."
                />
              </FormGroup>
            </Body>

            <Footer>
              <CancelButton
                type="button"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </CancelButton>
              <SaveButton type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </SaveButton>
            </Footer>
          </form>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditRoleModal;
