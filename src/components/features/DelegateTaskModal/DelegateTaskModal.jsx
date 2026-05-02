import { useMemo, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import {
  Body,
  CancelButton,
  CloseButton,
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
  SelectWrapper,
  Select,
  DateInput,
  PriorityGroup,
  PriorityOption,
  ErrorMessage,
} from './Styles';
import { useCreateTask } from '../../../hooks/query/task';
import { useGetUsers } from '../../../hooks/query/user';
import { notifyError, notifySuccess } from '../../../utils/toast';

function buildRequestErrorMessage(err, fallback) {
  const responseMessage = err?.response?.data?.message;
  if (Array.isArray(responseMessage)) {
    return responseMessage.join(', ');
  }
  return responseMessage || fallback;
}

export default function DelegateTaskModal({
  isOpen,
  onClose,
  onSuccess = () => {},
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    assignedTo: '',
  });

  const [errors, setErrors] = useState({});

  const { data: users = [] } = useGetUsers({
    enabled: isOpen,
    onError: (err) => {
      const message = buildRequestErrorMessage(
        err,
        'Erro ao carregar usuários',
      );
      notifyError(message);
    },
  });

  const filteredUsers = useMemo(() => {
    // Filter out the current user and show only students or specific roles
    return users.filter((u) => u._id); // Can add more filters here
  }, [users]);

  const createTaskMutation = useCreateTask({
    onSuccess: () => {
      notifySuccess('Tarefa delegada com sucesso!');
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
        assignedTo: '',
      });
      setErrors({});
      onSuccess();
      onClose();
    },
    onError: (err) => {
      const message = buildRequestErrorMessage(err, 'Erro ao delegar tarefa');
      notifyError(message);
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Nome da tarefa é obrigatório';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.title.length > 120) {
      newErrors.title = 'Nome deve ter no máximo 120 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 3) {
      newErrors.description = 'Descrição deve ter pelo menos 3 caracteres';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de entrega é obrigatória';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Selecione um usuário';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      createTaskMutation.mutate(formData);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Header>
            <Title>📋 Delegar Tarefa</Title>
            <Dialog.Close asChild>
              <CloseButton>
                <X size={24} />
              </CloseButton>
            </Dialog.Close>
          </Header>

          <Body>
            <FormGroup>
              <Label htmlFor="title">Nome da Tarefa *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Relatório mensal"
                disabled={createTaskMutation.isPending}
              />
              {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva os detalhes da tarefa..."
                rows={4}
                disabled={createTaskMutation.isPending}
              />
              {errors.description && (
                <ErrorMessage>{errors.description}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="assignedTo">Delegar para *</Label>
              <SelectWrapper>
                <Select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  disabled={
                    createTaskMutation.isPending || filteredUsers.length === 0
                  }
                >
                  <option value="">Selecione um usuário...</option>
                  {filteredUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </Select>
              </SelectWrapper>
              {errors.assignedTo && (
                <ErrorMessage>{errors.assignedTo}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="dueDate">Data de Entrega *</Label>
              <DateInput
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                disabled={createTaskMutation.isPending}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.dueDate && <ErrorMessage>{errors.dueDate}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Prioridade</Label>
              <PriorityGroup>
                <PriorityOption
                  selected={formData.priority === 'LOW'}
                  onClick={() => setFormData({ ...formData, priority: 'LOW' })}
                  disabled={createTaskMutation.isPending}
                  color="#10b981"
                >
                  🟢 Baixa
                </PriorityOption>
                <PriorityOption
                  selected={formData.priority === 'MEDIUM'}
                  onClick={() =>
                    setFormData({ ...formData, priority: 'MEDIUM' })
                  }
                  disabled={createTaskMutation.isPending}
                  color="#f59e0b"
                >
                  🟡 Média
                </PriorityOption>
                <PriorityOption
                  selected={formData.priority === 'HIGH'}
                  onClick={() => setFormData({ ...formData, priority: 'HIGH' })}
                  disabled={createTaskMutation.isPending}
                  color="#ef4444"
                >
                  🔴 Alta
                </PriorityOption>
              </PriorityGroup>
            </FormGroup>
          </Body>

          <Footer>
            <CancelButton
              onClick={onClose}
              disabled={createTaskMutation.isPending}
            >
              Cancelar
            </CancelButton>
            <SaveButton
              onClick={handleSave}
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? 'Delegando...' : 'Delegar Tarefa'}
            </SaveButton>
          </Footer>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
