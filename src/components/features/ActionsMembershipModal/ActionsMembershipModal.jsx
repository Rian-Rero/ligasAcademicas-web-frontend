import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';

import {
  useEndLeagueMembership,
  useDeleteLeagueMembership,
} from '../../../hooks/query/leagueMembership';
import { notifyError, notifySuccess } from '../../../utils/toast';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 12px;
  }
`;

const FormStack = styled(Stack)`
  gap: 1.5rem;
`;

function ActionsMembershipModal({
  open = false,
  onClose = () => {},
  membership = null,
  actionType = 'end',
  onSuccess = () => {},
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      workLoadHours: '',
      issueDate: new Date().toISOString().split('T')[0],
      reason: '',
    },
  });

  const endMutation = useEndLeagueMembership({
    onSuccess: () => {
      notifySuccess('Ciclo encerrado com sucesso!');
      reset();
      onClose();
      onSuccess();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Erro ao encerrar ciclo');
    },
  });

  const deleteMutation = useDeleteLeagueMembership({
    onSuccess: () => {
      notifySuccess('Membro expulso com sucesso!');
      reset();
      onClose();
      onSuccess();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Erro ao expulsar membro');
    },
  });

  const onSubmit = async () => {
    if (!membership?._id) return;

    if (actionType === 'end') {
      await endMutation.mutateAsync(membership._id);
    } else if (actionType === 'expel') {
      await deleteMutation.mutateAsync(membership._id);
    }
  };

  const isLoading = endMutation.isPending || deleteMutation.isPending;
  const actionButtonLabel =
    actionType === 'end' ? 'Encerrar Ciclo' : 'Expulsar';

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
        {actionType === 'end' ? 'Encerrar Ciclo' : 'Expulsar Membro'}
      </DialogTitle>

      <DialogContent>
        <FormStack sx={{ mt: 2 }}>
          {membership && (
            <>
              <Typography variant="body2" color="textSecondary">
                Membro: <strong>{membership.user?.name}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Função: <strong>{membership.role}</strong>
              </Typography>
            </>
          )}

          {actionType === 'end' && (
            <>
              <Alert severity="info">
                Ao encerrar o ciclo, um histórico de função será registrado e o
                membro poderá receber um certificado.
              </Alert>
              <Controller
                name="issueDate"
                control={control}
                rules={{ required: 'Data é obrigatória' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Data de Encerramento"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </>
          )}

          {actionType === 'expel' && (
            <>
              <Alert severity="warning">
                Ao expulsar o membro, sua participação será removida do sistema
                e não poderá ser recuperada.
              </Alert>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Motivo da Expulsão (opcional)"
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Digite o motivo..."
                  />
                )}
              />
            </>
          )}
        </FormStack>
      </DialogContent>

      <DialogActions sx={{ padding: '1rem' }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color={actionType === 'expel' ? 'error' : 'primary'}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Processando...
            </>
          ) : (
            actionButtonLabel
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

export default ActionsMembershipModal;
