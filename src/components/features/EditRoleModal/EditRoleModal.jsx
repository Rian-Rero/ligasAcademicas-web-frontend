import { useEffect, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styled from 'styled-components';

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 50;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @media (max-width: 768px) {
    width: 95%;
    max-width: calc(100% - 2rem);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  gap: 1rem;
`;

const Title = styled(Dialog.Title)`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;

  &:hover {
    color: #1a1a1a;
  }
`;

const Body = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a1a;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const ColorPickerGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const ColorPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #ddd;
  background-color: ${(props) => props.color};
`;

const ColorInput = styled.input`
  cursor: pointer;
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SaveButton = styled(Button)`
  flex: 1;
  background: #6366f1;
  color: white;

  &:hover:not(:disabled) {
    background: #4f46e5;
  }
`;

const CancelButton = styled(Button)`
  flex: 1;
  background: #e0e0e0;
  color: #1a1a1a;

  &:hover:not(:disabled) {
    background: #d0d0d0;
  }
`;

/**
 * Modal para editar papéis
 */
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
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
