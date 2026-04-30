import { useEffect, useMemo, useState } from 'react';

import {
  FiEdit,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiTrash2,
  FiUserPlus,
  FiXCircle,
} from 'react-icons/fi';
import { GrAddCircle } from 'react-icons/gr';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  ActionButton,
  ActionsRow,
  Content,
  CountBadge,
  Divider,
  EditButton,
  EmptyState,
  Field,
  FormGrid,
  HeaderSection,
  HeaderSubtitle,
  HeaderTitle,
  Label,
  MemberBadge,
  MemberEmail,
  MemberEditorRow,
  MemberItem,
  MemberList,
  MemberMeta,
  MemberRoleInput,
  MembersCard,
  MemberSectionTitle,
  MemberTitle,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  PanelGrid,
  SearchBar,
  SearchIcon,
  SearchInput,
  SectionTitle,
  SquadDescription,
  SquadItem,
  SquadList,
  SquadMeta,
  SquadsCard,
  SquadTitle,
  TextArea,
  TextInput,
} from './Styles';
import { ConfirmDialog } from '../../../components/common';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import {
  useGetLeagueMemberships,
  useUpdateLeagueMembership,
} from '../../../hooks/query/leagueMembership';
import {
  useCreateSquad,
  useDeleteSquad,
  useGetSquads,
  useUpdateSquad,
} from '../../../hooks/query/squad';
import { useGetUsersByIds } from '../../../hooks/query/user';
import useAuthStore from '../../../stores/auth';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast';
import {
  buildRequestErrorMessage,
  filterBySearch,
  formatRole,
  isSameId,
  mapById,
  normalizeId,
} from '../utils';

const initialFormState = {
  name: '',
  description: '',
  function: '',
};

function normalizeSquadFormValues(formState) {
  return {
    name: formState.name.trim(),
    description: formState.description.trim(),
    function: formState.function.trim(),
  };
}

export default function ManagerSquads() {
  const theme = useTheme();
  const authUser = useAuthStore((state) => state.auth?.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedSquadId, setSelectedSquadId] = useState('');
  const [formState, setFormState] = useState(initialFormState);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [assigningMembershipId, setAssigningMembershipId] = useState('');
  const [memberRoleDrafts, setMemberRoleDrafts] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSquadId, setEditingSquadId] = useState('');
  const [editingMemberId, setEditingMemberId] = useState('');

  const managerMembershipsFilters = useMemo(
    () => ({ user: authUser?._id, isActive: true }),
    [authUser?._id],
  );

  const { data: managerMemberships = [] } = useGetLeagueMemberships({
    filters: managerMembershipsFilters,
    enabled: Boolean(authUser?._id),
  });

  const managerLeagueId = normalizeId(managerMemberships[0]?.academicLeague);

  const academicLeagueFilters = useMemo(
    () => ({ _id: managerLeagueId }),
    [managerLeagueId],
  );

  const { data: leagues = [] } = useGetAcademicLeagues({
    filters: academicLeagueFilters,
    enabled: Boolean(managerLeagueId),
  });

  const activeLeague = leagues[0];

  const squadsFilters = useMemo(
    () => ({ academicLeague: managerLeagueId }),
    [managerLeagueId],
  );

  const {
    data: squads = [],
    isLoading: isLoadingSquads,
    refetch: refetchSquads,
  } = useGetSquads({
    filters: squadsFilters,
    enabled: Boolean(managerLeagueId),
  });

  const leagueMembershipsFilters = useMemo(
    () => ({ academicLeague: managerLeagueId, isActive: true }),
    [managerLeagueId],
  );

  const {
    data: leagueMemberships = [],
    isLoading: isLoadingMemberships,
    refetch: refetchMemberships,
  } = useGetLeagueMemberships({
    filters: leagueMembershipsFilters,
    enabled: Boolean(managerLeagueId),
  });

  const memberIds = useMemo(
    () =>
      [
        ...new Set(
          leagueMemberships.map((membership) => normalizeId(membership.user)),
        ),
      ].filter(Boolean),
    [leagueMemberships],
  );

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useGetUsersByIds({
    userIds: memberIds,
    enabled: memberIds.length > 0,
  });

  const usersById = useMemo(() => mapById(users), [users]);

  const squadsById = useMemo(() => mapById(squads), [squads]);

  const membersPerSquad = useMemo(
    () =>
      leagueMemberships.reduce((acc, membership) => {
        const squadId = normalizeId(membership.squad);
        if (!squadId) return acc;

        acc[squadId] = (acc[squadId] || 0) + 1;
        return acc;
      }, {}),
    [leagueMemberships],
  );

  const members = useMemo(() => {
    return leagueMemberships
      .map((membership) => {
        const user = usersById[normalizeId(membership.user)];
        if (!user) return null;

        return {
          membership,
          user,
        };
      })
      .filter(Boolean)
      .sort((left, right) =>
        String(left.user.name || '').localeCompare(
          String(right.user.name || ''),
          'pt-BR',
        ),
      );
  }, [leagueMemberships, usersById]);

  const filteredSquads = useMemo(() => {
    return filterBySearch(squads, searchTerm, (squad) => [
      squad.name,
      squad.description,
      squad.function,
    ]);
  }, [searchTerm, squads]);

  useEffect(() => {
    setSelectedSquadId((prevSelectedId) => {
      if (!filteredSquads.length) {
        return prevSelectedId === '' ? prevSelectedId : '';
      }

      const hasSelectedSquad = filteredSquads.some((squad) =>
        isSameId(squad._id, prevSelectedId),
      );

      if (!hasSelectedSquad) {
        return normalizeId(filteredSquads[0]._id);
      }

      return prevSelectedId;
    });
  }, [filteredSquads]);

  useEffect(() => {
    setIsDeleteConfirmOpen(false);
  }, [selectedSquadId]);

  const squadsCount =
    filteredSquads.length === 1
      ? 'Subequipe (1)'
      : `Subequipes (${filteredSquads.length})`;

  const selectedSquad = useMemo(
    () => squads.find((squad) => isSameId(squad._id, selectedSquadId)) || null,
    [selectedSquadId, squads],
  );

  useEffect(() => {
    if (!selectedSquad) {
      setFormState(initialFormState);
      return;
    }

    setFormState({
      name: selectedSquad.name || '',
      description: selectedSquad.description || '',
      function: selectedSquad.function || '',
    });
  }, [selectedSquad]);

  const membersInSelectedSquad = useMemo(
    () =>
      members.filter(({ membership }) =>
        isSameId(membership.squad, selectedSquad?._id),
      ),
    [members, selectedSquad?._id],
  );

  useEffect(() => {
    setMemberRoleDrafts((prevState) => {
      const nextDrafts = { ...prevState };
      let hasChanges = false;

      membersInSelectedSquad.forEach(({ membership }) => {
        const membershipId = normalizeId(membership._id);
        const currentDraft = prevState[membershipId];
        const nextRole = currentDraft ?? membership.role ?? 'league-member';

        if (currentDraft !== nextRole) {
          nextDrafts[membershipId] = nextRole;
          hasChanges = true;
        }
      });

      return hasChanges ? nextDrafts : prevState;
    });
  }, [membersInSelectedSquad]);

  const membersForAllocation = useMemo(() => {
    return filterBySearch(members, memberSearchTerm, ({ membership, user }) => [
      user.name,
      user.email,
      membership.role,
    ]);
  }, [memberSearchTerm, members]);

  const membersNotInSelectedSquad = useMemo(() => {
    return membersForAllocation.filter(({ membership }) => {
      const squadId = normalizeId(membership.squad);

      return !isSameId(squadId, selectedSquad?._id);
    });
  }, [membersForAllocation, selectedSquad?._id]);

  const { mutateAsync: createSquad, isPending: isCreatingSquad } =
    useCreateSquad();

  const { mutateAsync: updateSquad, isPending: isUpdatingSquad } =
    useUpdateSquad();

  const { mutateAsync: deleteSquad, isPending: isDeletingSquad } =
    useDeleteSquad();

  const { mutateAsync: updateLeagueMembership, isPending: isUpdatingMember } =
    useUpdateLeagueMembership();

  const isLoading = isLoadingSquads || isLoadingMemberships || isLoadingUsers;
  const isSavingSquad = isCreatingSquad || isUpdatingSquad || isDeletingSquad;
  const isMutating = isSavingSquad || isUpdatingMember;

  const notifyRequestError = (err, fallback) => {
    notifyError(buildRequestErrorMessage(err, fallback));
  };

  const handleTextChange = (field) => (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchSquads(),
        refetchMemberships(),
        refetchUsers(),
      ]);
      notifySuccess('Dados de subequipes atualizados');
    } catch (err) {
      notifyRequestError(
        err,
        'Não foi possível atualizar os dados de subequipes',
      );
    }
  };

  const handleCreateSquad = async () => {
    if (!managerLeagueId) {
      notifyWarning('Não foi possível identificar a liga do gestor');
      return;
    }

    const {
      name,
      description,
      function: functionLabel,
    } = normalizeSquadFormValues(formState);

    if (name.length < 3 || description.length < 3) {
      notifyWarning(
        'Nome e descrição precisam ter pelo menos 3 caracteres para criar a subequipe',
      );
      return;
    }

    try {
      await createSquad({
        academicLeague: managerLeagueId,
        name,
        description,
        ...(functionLabel && { function: functionLabel }),
      });

      await refetchSquads();

      notifySuccess('Subequipe criada com sucesso');
      setFormState(initialFormState);
      setIsCreateModalOpen(false);
    } catch (err) {
      notifyRequestError(err, 'Não foi possível criar a subequipe');
    }
  };

  const handleSaveSquad = async () => {
    if (!editingSquadId) {
      notifyWarning('Selecione uma subequipe para salvar');
      return;
    }

    const {
      name,
      description,
      function: functionLabel,
    } = normalizeSquadFormValues(formState);

    if (name.length < 3 || description.length < 3) {
      notifyWarning(
        'Nome e descrição precisam ter pelo menos 3 caracteres para atualizar a subequipe',
      );
      return;
    }

    try {
      await updateSquad({
        _id: editingSquadId,
        inputData: {
          name,
          description,
          function: functionLabel,
        },
      });

      await refetchSquads();
      notifySuccess('Subequipe atualizada com sucesso');
      setFormState(initialFormState);
      setEditingSquadId('');
      setIsEditModalOpen(false);
    } catch (err) {
      notifyRequestError(
        err,
        'Não foi possível atualizar a subequipe selecionada',
      );
    }
  };

  const handleRequestDelete = () => {
    if (!editingSquadId) {
      notifyWarning('Selecione uma subequipe para remover');
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!editingSquadId) {
      setIsDeleteConfirmOpen(false);
      notifyWarning('Selecione uma subequipe para remover');
      return;
    }

    try {
      await deleteSquad(editingSquadId);
      await Promise.all([refetchSquads(), refetchMemberships()]);
      setIsDeleteConfirmOpen(false);
      notifySuccess('Subequipe removida com sucesso');
      setFormState(initialFormState);
      setEditingSquadId('');
      setIsEditModalOpen(false);
    } catch (err) {
      notifyRequestError(
        err,
        'Não foi possível remover a subequipe selecionada',
      );
    }
  };

  const handleOpenCreateModal = () => {
    setFormState(initialFormState);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (squadId) => {
    const squad = squads.find((s) => isSameId(s._id, squadId));
    if (squad) {
      setFormState({
        name: squad.name || '',
        description: squad.description || '',
        function: squad.function || '',
      });
      setEditingSquadId(normalizeId(squadId));
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setFormState(initialFormState);
    setEditingSquadId('');
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormState(initialFormState);
  };

  const handleAssignMember = async (membershipId) => {
    if (!selectedSquad?._id) {
      notifyWarning('Selecione uma subequipe para alocar membros');
      return;
    }

    setAssigningMembershipId(normalizeId(membershipId));

    try {
      await updateLeagueMembership({
        _id: membershipId,
        inputData: { squad: selectedSquad._id },
      });

      await refetchMemberships();
      notifySuccess('Membro alocado na subequipe com sucesso');
    } catch (err) {
      notifyRequestError(err, 'Não foi possível alocar o membro');
    } finally {
      setAssigningMembershipId('');
    }
  };

  const handleMemberRoleChange = (membershipId) => (event) => {
    const nextRole = event.target.value;

    setMemberRoleDrafts((prevState) => ({
      ...prevState,
      [normalizeId(membershipId)]: nextRole,
    }));
  };

  const handleSaveMemberRole = async (membershipId) => {
    const normalizedMembershipId = normalizeId(membershipId);
    const nextRole = String(
      memberRoleDrafts[normalizedMembershipId] || '',
    ).trim();

    if (!nextRole) {
      notifyWarning('Informe a função do membro antes de salvar');
      return;
    }

    try {
      await updateLeagueMembership({
        _id: membershipId,
        inputData: { role: nextRole },
      });

      await refetchMemberships();
      notifySuccess('Função do membro atualizada com sucesso');
    } catch (err) {
      notifyRequestError(err, 'Não foi possível atualizar a função do membro');
    }
  };

  const renderMembersAllocationList = (
    allocationMembers,
    emptyMessage,
    actionLabel,
  ) => (
    <MemberList>
      {!allocationMembers.length && <EmptyState>{emptyMessage}</EmptyState>}

      {allocationMembers.map(({ membership, user }) => {
        const currentSquadId = normalizeId(membership.squad);
        const isMemberInSelectedSquad = isSameId(
          currentSquadId,
          selectedSquad?._id,
        );
        const currentSquad = squadsById[currentSquadId];
        const isAssigning =
          assigningMembershipId === normalizeId(membership._id);

        return (
          <MemberItem key={`allocation-${membership._id}`}>
            <div>
              <MemberTitle>{user.name}</MemberTitle>
              <MemberEmail>{user.email}</MemberEmail>
              <MemberMeta>
                <MemberBadge>{formatRole(membership.role)}</MemberBadge>
                <MemberBadge
                  $variant={isMemberInSelectedSquad ? 'current' : undefined}
                >
                  {isMemberInSelectedSquad
                    ? 'Nesta subequipe'
                    : currentSquad?.name || 'Sem subequipe'}
                </MemberBadge>
              </MemberMeta>
            </div>

            <ActionButton
              type="button"
              onClick={() => handleAssignMember(membership._id)}
              disabled={isMutating || isMemberInSelectedSquad || isAssigning}
            >
              {isAssigning ? (
                <>
                  <ClipLoader
                    size={16}
                    color={theme.colors.white}
                    speedMultiplier={0.9}
                  />
                  Alocando...
                </>
              ) : (
                <>
                  <FiUserPlus /> {actionLabel}
                </>
              )}
            </ActionButton>
          </MemberItem>
        );
      })}
    </MemberList>
  );

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>SUBEQUIPES DA LIGA</HeaderTitle>
          <HeaderSubtitle>
            Crie, organize e atualize subequipes para distribuir melhor as
            funções da diretoria e dos membros da liga.
          </HeaderSubtitle>
        </div>

        <ActionButton
          type="button"
          onClick={handleRefresh}
          disabled={isLoading || isMutating}
        >
          <FiRefreshCw /> Atualizar dados
        </ActionButton>
      </HeaderSection>

      {!isLoading && !activeLeague && (
        <EmptyState>
          Nenhuma liga ativa foi encontrada para o seu usuário.
        </EmptyState>
      )}

      <SearchBar>
        <SearchIcon>
          <FiSearch />
        </SearchIcon>
        <SearchInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar subequipes por nome, descrição ou função"
          aria-label="Buscar subequipes"
        />
      </SearchBar>

      <PanelGrid>
        <SquadsCard>
          <SectionTitle>{squadsCount}</SectionTitle>

          <ActionButton
            type="button"
            onClick={handleOpenCreateModal}
            disabled={isMutating || !managerLeagueId}
          >
            <GrAddCircle /> Criar subequipe
          </ActionButton>

          <SquadList>
            {isLoading && <EmptyState>Carregando subequipes...</EmptyState>}

            {!isLoading && !filteredSquads.length && (
              <EmptyState>
                Nenhuma subequipe encontrada com esse filtro.
              </EmptyState>
            )}

            {!isLoading &&
              filteredSquads.map((squad) => {
                const isSelected = isSameId(squad._id, selectedSquadId);
                const totalMembers =
                  membersPerSquad[normalizeId(squad._id)] || 0;

                return (
                  <SquadItem key={squad._id} $active={isSelected}>
                    <div
                      style={{
                        cursor: 'pointer',
                        flex: 1,
                      }}
                      onClick={() => setSelectedSquadId(normalizeId(squad._id))}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedSquadId(normalizeId(squad._id));
                        }
                      }}
                    >
                      <SquadTitle>
                        <strong>{squad.name}</strong>
                        <CountBadge>{totalMembers} membros</CountBadge>
                      </SquadTitle>

                      <SquadDescription>
                        {squad.description || 'Sem descrição'}
                      </SquadDescription>

                      <SquadMeta>
                        <span>{squad.function || 'Função não definida'}</span>
                        <span>{activeLeague?.name || 'Liga não definida'}</span>
                      </SquadMeta>
                      <EditButton
                        type="button"
                        onClick={() => handleOpenEditModal(squad._id)}
                      >
                        <FiEdit /> Editar Subequipe
                      </EditButton>
                    </div>
                  </SquadItem>
                );
              })}
          </SquadList>
        </SquadsCard>

        <MembersCard>
          <SectionTitle>
            {selectedSquad
              ? `Membros em ${selectedSquad.name}`
              : 'Membros da subequipe'}
          </SectionTitle>

          {!selectedSquad && (
            <EmptyState>
              Selecione uma subequipe para visualizar os membros e fazer
              alocações.
            </EmptyState>
          )}

          {selectedSquad && (
            <>
              <MemberSectionTitle>
                Integrantes Atuais ({membersInSelectedSquad.length})
              </MemberSectionTitle>

              <MemberList>
                {!membersInSelectedSquad.length && (
                  <EmptyState>
                    Nenhum membro foi alocado nesta subequipe ainda.
                  </EmptyState>
                )}

                {membersInSelectedSquad.map(({ membership, user }) => (
                  <MemberItem key={membership._id}>
                    <div>
                      <MemberTitle>{user.name}</MemberTitle>
                      <MemberEmail>{user.email}</MemberEmail>
                      <MemberMeta>
                        <MemberBadge>{formatRole(membership.role)}</MemberBadge>
                        <MemberBadge $variant="current">
                          Nesta subequipe
                        </MemberBadge>
                      </MemberMeta>
                    </div>

                    <EditButton
                      type="button"
                      disabled={isUpdatingMember}
                      onClick={() =>
                        setEditingMemberId(
                          editingMemberId === membership._id
                            ? null
                            : membership._id,
                        )
                      }
                    >
                      <FiEdit /> Editar Função
                    </EditButton>
                    {editingMemberId === membership._id && (
                      <MemberEditorRow>
                        <MemberRoleInput
                          type="text"
                          value={
                            memberRoleDrafts[normalizeId(membership._id)] ?? ''
                          }
                          onChange={handleMemberRoleChange(membership._id)}
                          placeholder="Ex: Científico, Marketing, Extensão"
                        />
                        <ActionButton
                          type="button"
                          $variant="warning"
                          onClick={() => {
                            handleSaveMemberRole(membership._id);
                            setEditingMemberId(null);
                          }}
                        >
                          <FiSave /> Salvar Função
                        </ActionButton>
                      </MemberEditorRow>
                    )}
                  </MemberItem>
                ))}
              </MemberList>

              <Divider />

              <MemberSectionTitle>
                Alocar Membros ({membersNotInSelectedSquad.length})
              </MemberSectionTitle>

              <SearchBar>
                <SearchIcon>
                  <FiSearch />
                </SearchIcon>
                <SearchInput
                  value={memberSearchTerm}
                  onChange={(event) => setMemberSearchTerm(event.target.value)}
                  placeholder="Buscar por nome, e-mail ou papel"
                  aria-label="Buscar membros para alocar"
                />
              </SearchBar>

              {renderMembersAllocationList(
                membersNotInSelectedSquad,
                'Nenhum membro sem subequipe encontrado com esse filtro.',
                'Alocar nesta subequipe',
              )}
            </>
          )}
        </MembersCard>
      </PanelGrid>

      {isCreateModalOpen && (
        <ModalBackdrop onClick={handleCloseCreateModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <SectionTitle>Criar Subequipe</SectionTitle>
              <ModalCloseButton type="button" onClick={handleCloseCreateModal}>
                <FiXCircle />
              </ModalCloseButton>
            </ModalHeader>
            <ModalContent>
              <FormGrid>
                <Field>
                  <Label>Nome da Subequipe</Label>
                  <TextInput
                    type="text"
                    value={formState.name}
                    onChange={handleTextChange('name')}
                    placeholder="Ex: Científico"
                  />
                </Field>

                <Field>
                  <Label>Função principal</Label>
                  <TextInput
                    type="text"
                    value={formState.function}
                    onChange={handleTextChange('function')}
                    placeholder="Ex: Pesquisa e Produção Acadêmica"
                  />
                </Field>

                <Field $fullWidth>
                  <Label>Descrição</Label>
                  <TextArea
                    value={formState.description}
                    onChange={handleTextChange('description')}
                    placeholder="Descreva as responsabilidades da subequipe"
                  />
                </Field>

                <ActionsRow>
                  <ActionButton
                    type="button"
                    onClick={handleCloseCreateModal}
                    disabled={isCreatingSquad}
                  >
                    Cancelar
                  </ActionButton>
                  <ActionButton
                    type="button"
                    $variant="warning"
                    onClick={handleCreateSquad}
                    disabled={isCreatingSquad || !managerLeagueId}
                  >
                    {isCreatingSquad ? (
                      <>
                        <ClipLoader
                          size={16}
                          color={theme.colors.white}
                          speedMultiplier={0.9}
                        />
                        Criando...
                      </>
                    ) : (
                      <>
                        <GrAddCircle /> Criar
                      </>
                    )}
                  </ActionButton>
                </ActionsRow>
              </FormGrid>
            </ModalContent>
          </ModalContainer>
        </ModalBackdrop>
      )}

      {isEditModalOpen && (
        <ModalBackdrop onClick={handleCloseEditModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <SectionTitle>Editar Subequipe</SectionTitle>
              <ModalCloseButton type="button" onClick={handleCloseEditModal}>
                <FiXCircle />
              </ModalCloseButton>
            </ModalHeader>
            <ModalContent>
              <FormGrid>
                <Field>
                  <Label>Nome da Subequipe</Label>
                  <TextInput
                    type="text"
                    value={formState.name}
                    onChange={handleTextChange('name')}
                    placeholder="Ex: Científico"
                  />
                </Field>

                <Field>
                  <Label>Função Principal</Label>
                  <TextInput
                    type="text"
                    value={formState.function}
                    onChange={handleTextChange('function')}
                    placeholder="Ex: Pesquisa e Produção Acadêmica"
                  />
                </Field>

                <Field $fullWidth>
                  <Label>Descrição</Label>
                  <TextArea
                    value={formState.description}
                    onChange={handleTextChange('description')}
                    placeholder="Descreva as responsabilidades da subequipe"
                  />
                </Field>

                <ActionsRow>
                  <ActionButton
                    type="button"
                    onClick={handleCloseEditModal}
                    disabled={isSavingSquad}
                  >
                    Cancelar
                  </ActionButton>
                  <ActionButton
                    type="button"
                    $variant="danger"
                    onClick={handleRequestDelete}
                    disabled={isSavingSquad}
                  >
                    {isDeletingSquad ? (
                      <>
                        <ClipLoader
                          size={16}
                          color={theme.colors.white}
                          speedMultiplier={0.9}
                        />
                        Removendo...
                      </>
                    ) : (
                      <>
                        <FiTrash2 /> Remover
                      </>
                    )}
                  </ActionButton>
                  <ActionButton
                    type="button"
                    $variant="warning"
                    onClick={handleSaveSquad}
                    disabled={isSavingSquad}
                  >
                    {isUpdatingSquad ? (
                      <>
                        <ClipLoader
                          size={16}
                          color={theme.colors.white}
                          speedMultiplier={0.9}
                        />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <FiSave /> Salvar
                      </>
                    )}
                  </ActionButton>
                </ActionsRow>
              </FormGrid>
            </ModalContent>
          </ModalContainer>
        </ModalBackdrop>
      )}

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Remover subequipe"
        description={
          selectedSquad
            ? `Deseja remover a subequipe ${selectedSquad.name}? Essa ação não pode ser desfeita.`
            : ''
        }
        confirmLabel={isDeletingSquad ? 'Removendo...' : 'Remover'}
        cancelLabel="Cancelar"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingSquad}
      />
    </Content>
  );
}
