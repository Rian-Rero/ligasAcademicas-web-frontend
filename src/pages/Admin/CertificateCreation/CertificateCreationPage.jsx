import { useMemo, useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';

import {
  useCreateCertificate,
  useGetCertificates,
} from '../../../hooks/query/certificate';
import { useGetInactiveLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { notifyError, notifySuccess } from '../../../utils/toast';

const Container = styled(Box)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.font.white};
`;

const HeaderSection = styled(Box)`
  margin-bottom: 2rem;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.font.white};
  }
`;

const MembershipCard = styled(Card)`
  transition: all 0.3s ease;
  border-radius: 12px;
  background-color: #081426 !important;
  background-image: linear-gradient(
    180deg,
    #0f2342 0%,
    #081426 100%
  ) !important;
  border: 1px solid
    ${({ theme }) => theme?.palette?.divider || 'rgba(255, 255, 255, 0.14)'};
  color: ${({ theme }) => theme.colors.font.white};

  .MuiCardContent-root,
  .MuiTypography-root {
    color: ${({ theme }) => theme.colors.font.white};
  }

  &:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
    transform: translateY(-2px);
  }
`;

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background: linear-gradient(180deg, #0f2342 0%, #081426 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: ${({ theme }) => theme.colors.font.white};
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
    border-radius: 12px;
  }
`;

const MemberInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatusChip = styled(Chip)`
  font-weight: 600;
`;

const FormStack = styled(Stack)`
  gap: 1.5rem;
`;

function CertificateFormModal({
  open = false,
  onClose = () => {},
  membership = null,
  onSuccess = () => {},
}) {
  const textFieldSx = {
    '& .MuiInputLabel-root': {
      color: 'rgba(255,255,255,0.7)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'rgba(255,255,255,0.9)',
    },
    '& .MuiOutlinedInput-root': {
      color: '#ffffff',
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.25)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255,255,255,0.45)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#42a5f5',
      },
    },
    '& .MuiFormHelperText-root': {
      color: '#ffb4ab',
    },
  };

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      workLoadHours: '40',
      issueDate: new Date().toISOString().split('T')[0],
    },
  });

  const { mutateAsync: createCertificate, isPending } = useCreateCertificate({
    onSuccess: () => {
      notifySuccess('Certificado criado com sucesso!');
      reset();
      onClose();
      onSuccess();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Erro ao criar certificado');
    },
  });

  const onSubmit = async (data) => {
    if (!membership?._id) return;

    await createCertificate({
      leagueMembership: membership._id,
      workLoadHours: parseFloat(data.workLoadHours),
      issueDate: new Date(data.issueDate),
    });
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: '1.25rem',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        Gerar Certificado
      </DialogTitle>

      <DialogContent>
        <FormStack sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Membro: <strong>{membership?.user?.name}</strong>
          </Typography>

          <Controller
            name="workLoadHours"
            control={control}
            rules={{
              required: 'Horas é obrigatório',
              min: { value: 0.5, message: 'Deve ser maior que 0' },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="number"
                label="Horas de Trabalho"
                inputProps={{ step: '0.5', min: '0' }}
                fullWidth
                sx={textFieldSx}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="issueDate"
            control={control}
            rules={{ required: 'Data é obrigatória' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="date"
                label="Data de Emissão"
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={textFieldSx}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </FormStack>
      </DialogContent>

      <DialogActions
        sx={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <Button
          onClick={onClose}
          disabled={isPending}
          sx={{ color: 'rgba(255,255,255,0.9)' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Gerando...
            </>
          ) : (
            'Gerar Certificado'
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}

function CertificateCreationPage({ leagueId, universityId }) {
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [openCertForm, setOpenCertForm] = useState(false);

  const filters = leagueId
    ? { academicLeague: leagueId }
    : { university: universityId };

  const {
    data: inactiveMemberships = [],
    isLoading,
    isError,
    refetch: refetchInactiveMemberships,
  } = useGetInactiveLeagueMemberships({
    filters,
  });

  const inactiveMembershipIds = useMemo(
    () => inactiveMemberships.map((membership) => membership._id),
    [inactiveMemberships],
  );

  const {
    data: existingCertificates = [],
    isLoading: isLoadingCertificates,
    refetch: refetchCertificates,
  } = useGetCertificates({
    filters: { leagueMembership: inactiveMembershipIds },
    enabled: inactiveMembershipIds.length > 0,
    queryKey: ['certificates-for-inactive-memberships', inactiveMembershipIds],
  });

  const availableMembershipsForCertificate = useMemo(() => {
    const membershipsWithCertificate = new Set(
      existingCertificates.map((certificate) =>
        String(certificate.leagueMembership),
      ),
    );

    return inactiveMemberships.filter(
      (membership) => !membershipsWithCertificate.has(String(membership._id)),
    );
  }, [existingCertificates, inactiveMemberships]);

  const handleOpenCertForm = (membership) => {
    setSelectedMembership(membership);
    setOpenCertForm(true);
  };

  const handleCloseCertForm = () => {
    setOpenCertForm(false);
    setSelectedMembership(null);
  };

  const handleCertFormSuccess = () => {
    refetchInactiveMemberships();
    refetchCertificates();
    handleCloseCertForm();
  };

  if (isError) {
    return (
      <Container>
        <Alert severity="error">
          Erro ao carregar membros com ciclo encerrado. Tente novamente.
        </Alert>
      </Container>
    );
  }

  let content;

  if (isLoading || isLoadingCertificates) {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (availableMembershipsForCertificate.length === 0) {
    content = (
      <Alert severity="info">
        Nenhum membro pendente para emissão de certificado.
      </Alert>
    );
  } else {
    content = (
      <Grid container spacing={2}>
        {availableMembershipsForCertificate.map((membership) => (
          <Grid item xs={12} sm={6} md={4} key={membership._id}>
            <MembershipCard>
              <CardContent>
                <MemberInfo>
                  <Avatar
                    src={membership.user?.image?.url}
                    alt={membership.user?.name}
                    sx={{ width: 48, height: 48 }}
                  >
                    {membership.user?.name?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {membership.user?.name}
                    </Typography>
                    <StatusChip
                      label="Ciclo Encerrado"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Box>
                </MemberInfo>

                <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Função
                    </Typography>
                    <Typography variant="body2">{membership.role}</Typography>
                  </Box>

                  {membership.squad && (
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Equipe
                      </Typography>
                      <Typography variant="body2">
                        {membership.squad.name}
                      </Typography>
                    </Box>
                  )}

                  {membership.academicLeague && (
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Liga
                      </Typography>
                      <Typography variant="body2">
                        {membership.academicLeague.name}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon />}
                  fullWidth
                  onClick={() => handleOpenCertForm(membership)}
                >
                  Criar Certificado
                </Button>
              </CardContent>
            </MembershipCard>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Container>
      <HeaderSection>
        <h1>Gerar Certificados</h1>
        <Typography
          variant="body1"
          sx={{ mt: 0.5, color: 'rgba(255,255,255,0.72)' }}
        >
          Selecione membros com ciclo encerrado para gerar seus certificados
        </Typography>
      </HeaderSection>

      {content}

      {selectedMembership && (
        <CertificateFormModal
          open={openCertForm}
          onClose={handleCloseCertForm}
          membership={selectedMembership}
          onSuccess={handleCertFormSuccess}
        />
      )}
    </Container>
  );
}

export default CertificateCreationPage;
