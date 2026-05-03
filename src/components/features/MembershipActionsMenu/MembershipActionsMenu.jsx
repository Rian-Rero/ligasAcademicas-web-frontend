import { useState } from 'react';

import {
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import styled from 'styled-components';

import {
  useEndLeagueMembership,
  useDeleteLeagueMembership,
} from '../../../hooks/query/leagueMembership';
import { notifyError, notifySuccess } from '../../../utils/toast';

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 8px;
  }
`;

function MembershipActionsMenu({
  membership = null,
  onActionSuccess = () => {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const endMutation = useEndLeagueMembership({
    onSuccess: () => {
      notifySuccess('Ciclo encerrado com sucesso!');
      setOpenDialog(false);
      setActionType(null);
      onActionSuccess();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Erro ao encerrar ciclo');
    },
  });

  const deleteMutation = useDeleteLeagueMembership({
    onSuccess: () => {
      notifySuccess('Membro expulso com sucesso!');
      setOpenDialog(false);
      setActionType(null);
      onActionSuccess();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Erro ao expulsar membro');
    },
  });

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action) => {
    setActionType(action);
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleConfirmAction = async () => {
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
    <>
      <IconButton size="small" onClick={handleOpenMenu} disabled={!membership}>
        <MoreVertIcon />
      </IconButton>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleActionClick('end')}>
          <StopIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          Encerrar Ciclo
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('expel')}>
          <DeleteIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'error.main' }} />
          Expulsar Membro
        </MenuItem>
      </StyledMenu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {actionType === 'end' ? 'Encerrar Ciclo' : 'Expulsar Membro'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Membro: <strong>{membership?.user?.name}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Função: <strong>{membership?.role}</strong>
              </Typography>
            </Box>

            {actionType === 'end' && (
              <Alert severity="info">
                Ao encerrar o ciclo, um histórico de função será registrado e o
                membro poderá receber um certificado de participação.
              </Alert>
            )}

            {actionType === 'expel' && (
              <Alert severity="warning">
                Ao expulsar o membro, sua participação será removida do sistema
                e não poderá ser recuperada.
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ padding: '1rem' }}>
          <Button onClick={() => setOpenDialog(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmAction}
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
      </Dialog>
    </>
  );
}

export default MembershipActionsMenu;
