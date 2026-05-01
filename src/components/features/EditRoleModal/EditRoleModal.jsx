import { useEffect, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

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

export function EditRoleModal({
  role,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    color: '#6366F1',
    priority: 0,
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        key: role.key || '',
        description: role.description || '',
        color: role.color || '#6366F1',
        priority: role.priority || 0,
      });
    }
  }, [role]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Header>
            <Title>{role ? 'Editar Papel' : 'Novo Papel'}</Title>
            <Dialog.Close asChild>
              <CloseButton>
                <X size={24} />
              </CloseButton>
            </Dialog.Close>
          </Header>

          <Body>
            <FormGroup>
              <Label htmlFor="name">Nome do Papel *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Gerenciador de Eventos"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="key">Chave (identificador único) *</Label>
              <Input
                id="key"
                name="key"
                value={formData.key}
                onChange={handleInputChange}
                placeholder="Ex: event_manager"
                disabled={!!role}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descrição detalhada do papel..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Cor de Representação</Label>
              <ColorPickerGroup>
                <ColorPreview color={formData.color} />
                <div style={{ flex: 1 }}>
                  <ColorInput
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
              </ColorPickerGroup>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="priority">Prioridade</Label>
              <Input
                id="priority"
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleInputChange}
                min="0"
              />
            </FormGroup>
          </Body>

          <Footer>
            <CancelButton onClick={onClose} disabled={isLoading}>
              Cancelar
            </CancelButton>
            <SaveButton onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </SaveButton>
          </Footer>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditRoleModal;
