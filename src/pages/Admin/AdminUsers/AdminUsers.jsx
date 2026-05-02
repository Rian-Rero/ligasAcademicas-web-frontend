import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  adminUserDefaultValues,
  adminUserSchema,
  buildAdminUserErrorMessage,
} from './utils';
import { ConfirmDialog } from '../../../components/common';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import {
  useCreateLeagueMembership,
  useDeleteLeagueMembership,
  useGetLeagueMemberships,
  useUpdateLeagueMembership,
} from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import { useGetUniversities } from '../../../hooks/query/university';
import {
  useCreateUser,
  useDeleteUser,
  useGetUsers,
  useUpdateUserByManagement,
} from '../../../hooks/query/user';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast';
import {
  filterBySearch,
  formatRole,
  isSameId,
  normalizeId,
} from '../../Manager/utils';
import {
  ActionButton,
  ActionRow,
  Content,
  EmptyState,
  EntityBadge,
  EntityItem,
  EntityList,
  EntityMeta,
  EntityTitle,
  ErrorMessage,
  Field,
  FormCard,
  FormGrid,
  HeaderActions,
  HeaderSection,
  HeaderSubtitle,
  HeaderTitle,
  HelperText,
  Label,
  ListCard,
  PanelGrid,
  SearchBar,
  SearchIcon,
  SearchInput,
  SectionTitle,
  SelectInput,
  TextInput,
  MembershipsList,
  MembershipItem,
  MembershipMeta,
  MembershipActions,
  SmallActionButton,
  MembershipModeSelector,
  MembershipModeButton,
  MembershipPanel,
  MembershipPanelHeader,
  MembershipPanelTitle,
  MembershipTypeBadge,
  MembershipHelpBox,
} from '../Styles';

export default function AdminUsers() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [selectedUniversityId, setSelectedUniversityId] = useState(
    searchParams.get('university') || '',
  );
  const [selectedLeagueId, setSelectedLeagueId] = useState(
    searchParams.get('league') || '',
  );
  const [membershipMode, setMembershipMode] = useState('league');
  const [isDeleteUserConfirmOpen, setIsDeleteUserConfirmOpen] = useState(false);
  const [isDeleteMembershipConfirmOpen, setIsDeleteMembershipConfirmOpen] =
    useState(false);

  const { data: universities = [] } = useGetUniversities();
  const { data: leagues = [] } = useGetAcademicLeagues();
  const { data: squads = [] } = useGetSquads();
  const { data: users = [] } = useGetUsers();
  const { data: memberships = [] } = useGetLeagueMemberships();

  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();
  const { mutateAsync: updateUserByManagement, isPending: isUpdatingUser } =
    useUpdateUserByManagement();
  const { mutateAsync: createMembership, isPending: isCreatingMembership } =
    useCreateLeagueMembership();
  const { mutateAsync: deleteMembership, isPending: isDeletingMembership } =
    useDeleteLeagueMembership();
  const { mutateAsync: updateMembership, isPending: isUpdatingMembership } =
    useUpdateLeagueMembership();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminUserSchema),
    defaultValues: adminUserDefaultValues,
  });

  const membershipUniversity = watch('membershipUniversity');
  const academicLeague = watch('academicLeague');

  const filteredLeagues = useMemo(
    () =>
      selectedUniversityId
        ? leagues.filter((league) =>
            isSameId(league.university, selectedUniversityId),
          )
        : leagues,
    [leagues, selectedUniversityId],
  );

  const scopedMemberships = useMemo(
    () =>
      memberships.filter((membership) => {
        const matchesLeague =
          !selectedLeagueId ||
          isSameId(membership.academicLeague, selectedLeagueId);
        const league = leagues.find((item) =>
          isSameId(item._id, membership.academicLeague),
        );
        const matchesUniversity =
          !selectedUniversityId ||
          isSameId(league?.university, selectedUniversityId);
        return matchesLeague && matchesUniversity;
      }),
    [leagues, memberships, selectedLeagueId, selectedUniversityId],
  );

  const membershipsByUser = useMemo(
    () =>
      memberships.reduce((acc, membership) => {
        const userId = normalizeId(membership.user);
        acc[userId] = acc[userId] || [];
        acc[userId].push(membership);
        return acc;
      }, {}),
    [memberships],
  );

  const filteredUsers = useMemo(() => {
    const hasScopeFilters = Boolean(selectedUniversityId || selectedLeagueId);
    const usersInScope = hasScopeFilters
      ? users.filter((user) =>
          scopedMemberships.some((membership) =>
            isSameId(membership.user, user._id),
          ),
        )
      : users;

    return filterBySearch(usersInScope, searchTerm, (user) => [
      user.name,
      user.email,
    ]);
  }, [
    scopedMemberships,
    searchTerm,
    selectedLeagueId,
    selectedUniversityId,
    users,
  ]);

  useEffect(() => {
    if (!selectedUniversityId) return;

    const hasSelectedLeague = filteredLeagues.some((league) =>
      isSameId(league._id, selectedLeagueId),
    );

    if (!hasSelectedLeague) {
      setSelectedLeagueId('');
    }
  }, [filteredLeagues, selectedLeagueId, selectedUniversityId]);

  useEffect(() => {
    const hasSelectedUser = filteredUsers.some((user) =>
      isSameId(user._id, selectedUserId),
    );

    if (!hasSelectedUser && selectedUserId) {
      setSelectedUserId('');
      setSelectedMembershipId('');
      reset(adminUserDefaultValues);
    }
  }, [filteredUsers, reset, selectedUserId]);

  const selectedUser = useMemo(
    () => users.find((user) => isSameId(user._id, selectedUserId)) || null,
    [selectedUserId, users],
  );

  const selectedUserMemberships = useMemo(
    () => membershipsByUser[normalizeId(selectedUser?._id)] || [],
    [membershipsByUser, selectedUser?._id],
  );

  useEffect(() => {
    if (!selectedUser?._id) {
      setSelectedMembershipId('');
      return;
    }

    const hasSelectedMembership = selectedUserMemberships.some((membership) =>
      isSameId(membership._id, selectedMembershipId),
    );

    if (!hasSelectedMembership) {
      setSelectedMembershipId(normalizeId(selectedUserMemberships[0]?._id));
    }
  }, [selectedMembershipId, selectedUser?._id, selectedUserMemberships]);

  const selectedMembership = useMemo(
    () =>
      selectedUserMemberships.find((membership) =>
        isSameId(membership._id, selectedMembershipId),
      ) || null,
    [selectedMembershipId, selectedUserMemberships],
  );

  useEffect(() => {
    if (!selectedMembership?._id) {
      setMembershipMode('league');
      return;
    }

    setMembershipMode(
      selectedMembership.academicLeague ? 'league' : 'university',
    );
  }, [selectedMembership]);

  useEffect(() => {
    if (!selectedUser?._id) {
      reset(adminUserDefaultValues);
      return;
    }
    const leagueOfMembership = leagues.find((league) =>
      isSameId(league._id, selectedMembership?.academicLeague),
    );

    // Prefer university from league when membership references an academicLeague,
    // otherwise fall back to membership.university (university-only membership)
    const membershipUniversityId =
      leagueOfMembership?.university || selectedMembership?.university;

    reset({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      emailVerified: selectedUser.emailVerified ? 'true' : 'false',
      membershipUniversity: normalizeId(membershipUniversityId),
      academicLeague: normalizeId(selectedMembership?.academicLeague),
      role: selectedMembership?.role || '',
      squad: normalizeId(selectedMembership?.squad),
      isActive: selectedMembership?.isActive ? 'true' : 'false',
    });
  }, [leagues, reset, selectedMembership, selectedUser]);

  useEffect(() => {
    if (membershipMode === 'university') {
      setValue('academicLeague', '');
      setValue('squad', '');
    }
  }, [membershipMode, setValue]);

  const availableLeaguesForMembership = useMemo(
    () =>
      membershipUniversity
        ? leagues.filter((league) =>
            isSameId(league.university, membershipUniversity),
          )
        : leagues,
    [membershipUniversity, leagues],
  );

  useEffect(() => {
    if (!academicLeague) return;

    const hasLeague = availableLeaguesForMembership.some((league) =>
      isSameId(league._id, academicLeague),
    );

    if (!hasLeague) {
      setValue('academicLeague', '');
      setValue('squad', '');
    }
  }, [academicLeague, availableLeaguesForMembership, setValue]);

  const availableSquads = useMemo(
    () =>
      squads.filter((squad) => isSameId(squad.academicLeague, academicLeague)),
    [academicLeague, squads],
  );

  const buildMembershipPayload = (values, userId) => {
    const payload = {
      user: normalizeId(userId),
      membershipType: membershipMode,
      university: normalizeId(values.membershipUniversity),
      role: values.role.trim(),
      isActive: values.isActive === 'true',
    };

    if (membershipMode === 'league') {
      payload.academicLeague = normalizeId(values.academicLeague);
      payload.squad = normalizeId(values.squad);
    }

    return payload;
  };

  const validateMembershipValues = (values) => {
    if (!values.membershipUniversity) {
      notifyWarning('Selecione uma universidade para o vínculo');
      return false;
    }

    if (!values.role?.trim()) {
      notifyWarning('Informe um cargo ou descrição para o vínculo');
      return false;
    }

    if (membershipMode === 'league') {
      if (!values.academicLeague) {
        notifyWarning('Selecione uma liga para o vínculo com liga');
        return false;
      }

      if (!values.squad) {
        notifyWarning('Selecione uma subequipe para o vínculo com liga');
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const currentSquad = getValues('squad');
    if (!academicLeague || !currentSquad) return;

    const hasSelectedSquad = availableSquads.some((squad) =>
      isSameId(squad._id, currentSquad),
    );

    if (!hasSelectedSquad) {
      setValue('squad', '');
    }
  }, [academicLeague, availableSquads, getValues, setValue]);

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries(['universities']),
      queryClient.invalidateQueries(['academic-leagues']),
      queryClient.invalidateQueries(['squads']),
      queryClient.invalidateQueries(['users']),
      queryClient.invalidateQueries(['league-memberships']),
    ]);
  };

  const handleStartNewUser = () => {
    setSelectedUserId('');
    setSelectedMembershipId('');
    setMembershipMode('league');
    reset(adminUserDefaultValues);
  };

  const handleAddMembership = async () => {
    if (!selectedUser?._id) {
      notifyWarning('Selecione um usuário para criar um novo vínculo');
      return;
    }

    const values = getValues();
    if (!validateMembershipValues(values)) {
      return;
    }

    try {
      const createdMembership = await createMembership(
        buildMembershipPayload(values, selectedUser._id),
      );

      if (!createdMembership || !createdMembership._id) {
        notifyError('Não foi possível criar o vínculo');
        return;
      }

      await handleRefresh();
      setSelectedMembershipId(normalizeId(createdMembership._id));
      notifySuccess('Vínculo criado com sucesso');
    } catch (err) {
      notifyError(buildAdminUserErrorMessage(err));
    }
  };

  const handleConfirmDeleteMembership = async () => {
    if (!selectedMembership?._id) return;

    try {
      await deleteMembership(selectedMembership._id);
      await handleRefresh();
      setSelectedMembershipId('');
      setIsDeleteMembershipConfirmOpen(false);
      notifySuccess('vínculo removido com sucesso');
    } catch (err) {
      notifyError(buildAdminUserErrorMessage(err));
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!selectedUser?._id) return;

    try {
      await deleteUser(selectedUser._id);
      await handleRefresh();
      handleStartNewUser();
      setIsDeleteUserConfirmOpen(false);
      notifySuccess('Usuário removido com sucesso');
    } catch (err) {
      notifyError(buildAdminUserErrorMessage(err));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const name = values.name.trim();
    const email = values.email.trim().toLocaleLowerCase('pt-BR');
    const role = values.role.trim();
    const hasMembershipInput = Boolean(
      values.membershipUniversity ||
      values.academicLeague ||
      values.squad ||
      role,
    );

    try {
      if (selectedUser?._id) {
        if (selectedMembership?._id && !validateMembershipValues(values)) {
          return;
        }

        await updateUserByManagement({
          _id: selectedUser._id,
          newUserData: {
            name,
            email,
            emailVerified: values.emailVerified === 'true',
          },
        });

        if (selectedMembership?._id) {
          await updateMembership({
            _id: selectedMembership._id,
            inputData: buildMembershipPayload(values, selectedUser._id),
          });
        } else if (hasMembershipInput) {
          if (!validateMembershipValues(values)) return;
          await createMembership(
            buildMembershipPayload(values, selectedUser._id),
          );
        }

        await handleRefresh();
        notifySuccess('Usuário atualizado com sucesso');
        return;
      }

      const createdUser = await createUser({
        name,
        email,
        emailVerified: values.emailVerified === 'true',
      });

      if (hasMembershipInput) {
        if (!validateMembershipValues(values)) return;
        await createMembership(buildMembershipPayload(values, createdUser._id));
      }

      await handleRefresh();
      setSelectedUserId(normalizeId(createdUser._id));
      notifySuccess('Usuário criado com sucesso');
    } catch (err) {
      notifyError(buildAdminUserErrorMessage(err));
    }
  });

  const formErrorMessage = errors.name?.message || errors.email?.message;

  const isSaving =
    isCreatingUser ||
    isDeletingUser ||
    isUpdatingUser ||
    isCreatingMembership ||
    isDeletingMembership ||
    isUpdatingMembership;

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>GERENCIAMENTO DE USUARIOS</HeaderTitle>
          <HeaderSubtitle>
            Filtre por universidade e liga para editar o perfil do usuário, o
            vínculo com a liga e o status de ativacao.
          </HeaderSubtitle>
        </div>

        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="search"
              placeholder="Buscar usuário"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBar>
          <ActionButton type="button" onClick={handleRefresh}>
            <FiRefreshCw /> Atualizar
          </ActionButton>
        </HeaderActions>
      </HeaderSection>

      <PanelGrid>
        <ListCard>
          <SectionTitle>Usuários ({filteredUsers.length})</SectionTitle>

          <FormGrid>
            <Field>
              <Label>Universidade</Label>
              <SelectInput
                value={selectedUniversityId}
                onChange={(event) =>
                  setSelectedUniversityId(event.target.value)
                }
              >
                <option value="">Todas</option>
                {universities.map((university) => (
                  <option
                    key={university._id}
                    value={normalizeId(university._id)}
                  >
                    {university.name}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field>
              <Label>Liga</Label>
              <SelectInput
                value={selectedLeagueId}
                onChange={(event) => setSelectedLeagueId(event.target.value)}
              >
                <option value="">Todas</option>
                {filteredLeagues.map((league) => (
                  <option key={league._id} value={normalizeId(league._id)}>
                    {league.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </FormGrid>

          <EntityList>
            {!filteredUsers.length && (
              <EmptyState>Nenhum usuário encontrado.</EmptyState>
            )}

            {filteredUsers.map((user) => {
              const userMemberships =
                membershipsByUser[normalizeId(user._id)] || [];

              return (
                <EntityItem
                  key={user._id}
                  type="button"
                  $active={isSameId(user._id, selectedUserId)}
                  onClick={() => setSelectedUserId(normalizeId(user._id))}
                >
                  <EntityTitle>
                    <strong>{user.name}</strong>
                    <EntityBadge>{userMemberships.length} vínculos</EntityBadge>
                  </EntityTitle>
                  <EntityMeta>
                    <span>{user.email}</span>
                    <span>{formatRole(user.roleKeys?.[0])}</span>
                  </EntityMeta>
                </EntityItem>
              );
            })}
          </EntityList>
        </ListCard>

        <FormCard onSubmit={onSubmit}>
          <SectionTitle>
            {selectedUser?._id
              ? 'Editar usuário e vínculos'
              : 'Criar novo usuário (ou selecione um existente)'}
          </SectionTitle>

          <FormGrid>
            <Field $fullWidth>
              <Label>
                <FiUser /> Nome
              </Label>
              <TextInput {...register('name')} placeholder="Nome do usuário" />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>E-mail</Label>
              <TextInput
                type="email"
                {...register('email')}
                placeholder="E-mail do usuário"
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>Vínculos atuais</Label>
              <MembershipsList>
                {!selectedUser?._id && (
                  <HelperText>
                    Selecione um usuário para ver vínculos.
                  </HelperText>
                )}

                {selectedUser?._id && selectedUserMemberships.length === 0 && (
                  <EmptyState>Usuário não possui vínculos.</EmptyState>
                )}

                {selectedUserMemberships.map((membership) => {
                  const league = leagues.find((item) =>
                    isSameId(item._id, membership.academicLeague),
                  );
                  const university = universities.find((item) =>
                    isSameId(
                      item._id,
                      membership.university || league?.university,
                    ),
                  );
                  const squad = squads.find((item) =>
                    isSameId(item._id, membership.squad),
                  );
                  const isLeagueMembership = Boolean(membership.academicLeague);

                  return (
                    <MembershipItem key={membership._id}>
                      <MembershipMeta>
                        <strong>
                          {isLeagueMembership
                            ? league?.name || 'Liga'
                            : university?.name || 'Universidade'}
                        </strong>
                        <span>
                          {isLeagueMembership
                            ? `${squad?.name || 'Sem subequipe'} • ${formatRole(membership.role)}`
                            : `${formatRole(membership.role)} • vínculo direto à universidade`}
                        </span>
                        <span
                          style={{
                            fontSize: '1rem',
                            color: 'rgba(255,255,255,0.6)',
                          }}
                        >
                          {membership.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </MembershipMeta>

                      <MembershipActions>
                        <MembershipTypeBadge>
                          {isLeagueMembership
                            ? 'Liga + subequipe'
                            : 'Universidade'}
                        </MembershipTypeBadge>
                        <SmallActionButton
                          type="button"
                          onClick={() => {
                            setSelectedMembershipId(
                              normalizeId(membership._id),
                            );
                            // focus the role input so user can start editing quickly
                            setTimeout(() => {
                              const el = document.querySelector(
                                'input[name="role"], select[name="membershipUniversity"]',
                              );
                              if (el) el.focus();
                            }, 50);
                          }}
                        >
                          Editar
                        </SmallActionButton>

                        <SmallActionButton
                          type="button"
                          onClick={() => {
                            setSelectedMembershipId(
                              normalizeId(membership._id),
                            );
                            setIsDeleteMembershipConfirmOpen(true);
                          }}
                        >
                          Remover
                        </SmallActionButton>
                      </MembershipActions>
                    </MembershipItem>
                  );
                })}
              </MembershipsList>
            </Field>

            <Field>
              <Label>E-mail verificado</Label>
              <SelectInput {...register('emailVerified')}>
                <option value="true">Sim</option>
                <option value="false">Nao</option>
              </SelectInput>
              {errors.emailVerified && (
                <ErrorMessage>{errors.emailVerified.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>Tipo de vínculo</Label>
              <MembershipModeSelector>
                <MembershipModeButton
                  type="button"
                  $active={membershipMode === 'university'}
                  onClick={() => setMembershipMode('university')}
                >
                  <strong>Universidade</strong>
                  <span>Vincule o usuário só à universidade, sem liga.</span>
                </MembershipModeButton>

                <MembershipModeButton
                  type="button"
                  $active={membershipMode === 'league'}
                  onClick={() => setMembershipMode('league')}
                >
                  <strong>Liga + subequipe</strong>
                  <span>Crie um vínculo completo com liga e subequipe.</span>
                </MembershipModeButton>
              </MembershipModeSelector>
            </Field>

            <MembershipPanel>
              <MembershipPanelHeader>
                <MembershipPanelTitle>
                  <strong>
                    {membershipMode === 'league'
                      ? 'Vínculo com liga'
                      : 'Vínculo direto com universidade'}
                  </strong>
                  <span>
                    {membershipMode === 'league'
                      ? 'Universidade é herdada da liga e a subequipe é obrigatória.'
                      : 'A universidade é o único vínculo necessário. Liga e subequipe ficam ocultas.'}
                  </span>
                </MembershipPanelTitle>

                <MembershipTypeBadge>
                  {membershipMode === 'league'
                    ? 'Modo liga'
                    : 'Modo universidade'}
                </MembershipTypeBadge>
              </MembershipPanelHeader>

              <FormGrid>
                <Field $fullWidth>
                  <Label>Universidade</Label>
                  <SelectInput {...register('membershipUniversity')}>
                    <option value="">Selecione uma universidade</option>
                    {universities.map((university) => (
                      <option
                        key={university._id}
                        value={normalizeId(university._id)}
                      >
                        {university.name}
                      </option>
                    ))}
                  </SelectInput>
                  {errors.membershipUniversity && (
                    <ErrorMessage>
                      {errors.membershipUniversity.message}
                    </ErrorMessage>
                  )}
                </Field>

                {membershipMode === 'league' ? (
                  <>
                    <Field>
                      <Label>Liga</Label>
                      <SelectInput {...register('academicLeague')}>
                        <option value="">Selecione uma liga</option>
                        {availableLeaguesForMembership.map((league) => (
                          <option
                            key={league._id}
                            value={normalizeId(league._id)}
                          >
                            {league.name}
                          </option>
                        ))}
                      </SelectInput>
                      {errors.academicLeague && (
                        <ErrorMessage>
                          {errors.academicLeague.message}
                        </ErrorMessage>
                      )}
                    </Field>

                    <Field>
                      <Label>Subequipe</Label>
                      <SelectInput {...register('squad')}>
                        <option value="">Selecione uma subequipe</option>
                        {availableSquads.map((squad) => (
                          <option
                            key={squad._id}
                            value={normalizeId(squad._id)}
                          >
                            {squad.name}
                          </option>
                        ))}
                      </SelectInput>
                      {errors.squad && (
                        <ErrorMessage>{errors.squad.message}</ErrorMessage>
                      )}
                    </Field>
                  </>
                ) : (
                  <Field $fullWidth>
                    <MembershipHelpBox>
                      Selecione apenas a universidade. Esse modo é ideal para
                      usuários que não pertencem a uma liga específica.
                    </MembershipHelpBox>
                  </Field>
                )}

                <Field>
                  <Label>
                    {membershipMode === 'league'
                      ? 'Cargo na liga'
                      : 'Cargo / descrição do vínculo'}
                  </Label>
                  <TextInput
                    {...register('role')}
                    placeholder={
                      membershipMode === 'league'
                        ? 'Ex.: presidente, membro...'
                        : 'Ex.: administrativo, contato...'
                    }
                  />
                  {errors.role && (
                    <ErrorMessage>{errors.role.message}</ErrorMessage>
                  )}
                </Field>

                <Field>
                  <Label>Status</Label>
                  <SelectInput {...register('isActive')}>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </SelectInput>
                  {errors.isActive && (
                    <ErrorMessage>{errors.isActive.message}</ErrorMessage>
                  )}
                </Field>
              </FormGrid>
            </MembershipPanel>

            <Field $fullWidth>
              <HelperText>
                {formErrorMessage ||
                  (selectedMembership
                    ? `Editando vínculo: ${selectedMembership.role} • ${selectedMembership.isActive ? 'ativo' : 'inativo'}`
                    : 'Preencha os campos acima e use “Adicionar vínculo”. Você pode salvar o usuário sem criar vínculo, ou criar vínculo só com universidade.')}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton type="button" onClick={handleStartNewUser}>
              <FiPlus /> Novo usuário
            </ActionButton>
            <ActionButton
              type="button"
              onClick={handleAddMembership}
              disabled={isSaving || !selectedUser?._id}
            >
              <FiPlus /> Adicionar vínculo
            </ActionButton>
            <ActionButton
              type="button"
              $variant="warning"
              onClick={() => setIsDeleteMembershipConfirmOpen(true)}
              disabled={isSaving || !selectedMembership?._id}
            >
              <FiTrash2 /> Remover vínculo
            </ActionButton>
            <ActionButton
              type="button"
              $variant="warning"
              onClick={() => setIsDeleteUserConfirmOpen(true)}
              disabled={isSaving || !selectedUser?._id}
            >
              <FiTrash2 /> Remover usuário
            </ActionButton>
            <ActionButton type="submit" disabled={isSaving}>
              {isSaving ? (
                <ClipLoader
                  size={16}
                  color={theme.colors.white}
                  speedMultiplier={0.9}
                />
              ) : (
                <FiSave />
              )}
              Salvar usuário
            </ActionButton>
          </ActionRow>
        </FormCard>
      </PanelGrid>

      <ConfirmDialog
        isOpen={isDeleteMembershipConfirmOpen}
        title="Remover vínculo"
        description="Essa acao remove o vínculo selecionado do usuário com a liga e subequipe."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteMembership}
        onCancel={() => setIsDeleteMembershipConfirmOpen(false)}
        isLoading={isSaving}
      />

      <ConfirmDialog
        isOpen={isDeleteUserConfirmOpen}
        title="Remover usuário"
        description="Essa acao remove o usuário selecionado. Verifique dependencias antes de confirmar."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteUser}
        onCancel={() => setIsDeleteUserConfirmOpen(false)}
        isLoading={isSaving}
      />
    </Content>
  );
}
