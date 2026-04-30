import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
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
} from '../Styles';

export default function AdminUsers() {
  const theme = useTheme();
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
  const [isDeleteUserConfirmOpen, setIsDeleteUserConfirmOpen] = useState(false);
  const [isDeleteMembershipConfirmOpen, setIsDeleteMembershipConfirmOpen] =
    useState(false);

  const { data: universities = [], refetch: refetchUniversities } =
    useGetUniversities();
  const { data: leagues = [], refetch: refetchLeagues } =
    useGetAcademicLeagues();
  const { data: squads = [], refetch: refetchSquads } = useGetSquads();
  const { data: users = [], refetch: refetchUsers } = useGetUsers();
  const { data: memberships = [], refetch: refetchMemberships } =
    useGetLeagueMemberships();

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
      user.globalRole,
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
    if (!selectedUser?._id) {
      reset(adminUserDefaultValues);
      return;
    }

    const leagueOfMembership = leagues.find((league) =>
      isSameId(league._id, selectedMembership?.academicLeague),
    );

    reset({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      globalRole: selectedUser.globalRole || 'league-member',
      emailVerified: selectedUser.emailVerified ? 'true' : 'false',
      membershipUniversity: normalizeId(leagueOfMembership?.university),
      academicLeague: normalizeId(selectedMembership?.academicLeague),
      role: selectedMembership?.role || '',
      squad: normalizeId(selectedMembership?.squad),
      isActive: selectedMembership?.isActive ? 'true' : 'false',
    });
  }, [leagues, reset, selectedMembership, selectedUser]);

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
      refetchUniversities(),
      refetchLeagues(),
      refetchSquads(),
      refetchUsers(),
      refetchMemberships(),
    ]);
  };

  const handleStartNewUser = () => {
    setSelectedUserId('');
    setSelectedMembershipId('');
    reset(adminUserDefaultValues);
  };

  const handleAddMembership = async () => {
    if (!selectedUser?._id) {
      notifyWarning('Selecione um usuario para criar um novo vinculo');
      return;
    }

    const values = getValues();
    const role = values.role.trim();

    if (!values.academicLeague || !values.squad || !role) {
      notifyWarning('Preencha liga, subequipe e papel para criar o vinculo');
      return;
    }

    try {
      const createdMembership = await createMembership({
        user: selectedUser._id,
        academicLeague: values.academicLeague,
        squad: values.squad,
        role,
        isActive: values.isActive === 'true',
      });

      await handleRefresh();
      setSelectedMembershipId(normalizeId(createdMembership?._id));
      notifySuccess('Vinculo criado com sucesso');
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
      notifySuccess('Vinculo removido com sucesso');
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
      notifySuccess('Usuario removido com sucesso');
    } catch (err) {
      notifyError(buildAdminUserErrorMessage(err));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const name = values.name.trim();
    const email = values.email.trim().toLocaleLowerCase('pt-BR');
    const globalRole = values.globalRole.trim() || 'league-member';
    const role = values.role.trim();

    try {
      if (selectedUser?._id) {
        if (selectedMembership?._id) {
          if (!values.academicLeague || !values.squad || !role) {
            notifyWarning(
              'Preencha liga, subequipe e papel para atualizar o vinculo',
            );
            return;
          }
        }

        await updateUserByManagement({
          _id: selectedUser._id,
          newUserData: {
            name,
            email,
            globalRole,
            emailVerified: values.emailVerified === 'true',
          },
        });

        if (selectedMembership?._id) {
          await updateMembership({
            _id: selectedMembership._id,
            inputData: {
              academicLeague: values.academicLeague,
              squad: values.squad,
              role,
              isActive: values.isActive === 'true',
            },
          });
        }

        await handleRefresh();
        notifySuccess('Usuario atualizado com sucesso');
        return;
      }

      const createdUser = await createUser({
        name,
        email,
        globalRole,
        emailVerified: values.emailVerified === 'true',
      });

      if (values.academicLeague || values.squad || role) {
        if (!values.academicLeague || !values.squad || !role) {
          notifyWarning(
            'Usuario criado. Para criar vinculo agora, preencha liga, subequipe e papel',
          );
        } else {
          await createMembership({
            user: createdUser._id,
            academicLeague: values.academicLeague,
            squad: values.squad,
            role,
            isActive: values.isActive === 'true',
          });
        }
      }

      await handleRefresh();
      setSelectedUserId(normalizeId(createdUser._id));
      notifySuccess('Usuario criado com sucesso');
    } catch (err) {
      notifyError(buildAdminUserErrorMessage(err));
    }
  });

  const formErrorMessage =
    errors.name?.message || errors.email?.message || errors.globalRole?.message;

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
            Filtre por universidade e liga para editar o perfil do usuario, o
            vinculo com a liga e o status de ativacao.
          </HeaderSubtitle>
        </div>

        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="search"
              placeholder="Buscar usuario"
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
              <EmptyState>Nenhum usuario encontrado.</EmptyState>
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
                    <span>{formatRole(user.globalRole)}</span>
                  </EntityMeta>
                </EntityItem>
              );
            })}
          </EntityList>
        </ListCard>

        <FormCard onSubmit={onSubmit}>
          <SectionTitle>
            {selectedUser?._id
              ? 'Editar usuario e vínculos'
              : 'Criar novo usuario (ou selecione um existente)'}
          </SectionTitle>

          <FormGrid>
            <Field $fullWidth>
              <Label>
                <FiUser /> Nome
              </Label>
              <TextInput {...register('name')} placeholder="Nome do usuario" />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>E-mail</Label>
              <TextInput
                type="email"
                {...register('email')}
                placeholder="E-mail do usuario"
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Perfil global</Label>
              <SelectInput {...register('globalRole')}>
                <option value="admin">Administrador</option>
                <option value="manager">Gestor</option>
                <option value="league-member">Membro de liga</option>
              </SelectInput>
              {errors.globalRole && (
                <ErrorMessage>{errors.globalRole.message}</ErrorMessage>
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
                  const squad = squads.find((item) =>
                    isSameId(item._id, membership.squad),
                  );

                  return (
                    <MembershipItem key={membership._id}>
                      <MembershipMeta>
                        <strong>{league?.name || 'Liga'}</strong>
                        <span>
                          {squad?.name || 'Sem subequipe'} —{' '}
                          {formatRole(membership.role)}
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
                        <SmallActionButton
                          type="button"
                          onClick={() =>
                            setSelectedMembershipId(normalizeId(membership._id))
                          }
                        >
                          Editar
                        </SmallActionButton>

                        <SmallActionButton
                          type="button"
                          onClick={async () => {
                            const ok = window.confirm('Remover este vínculo?');
                            if (!ok) return;
                            try {
                              await deleteMembership(membership._id);
                              await handleRefresh();
                              if (
                                isSameId(selectedMembershipId, membership._id)
                              ) {
                                setSelectedMembershipId('');
                              }
                              notifySuccess('Vínculo removido');
                            } catch (err) {
                              notifyError(buildAdminUserErrorMessage(err));
                            }
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

            <Field>
              <Label>Papel na liga</Label>
              <TextInput
                {...register('role')}
                placeholder="Ex.: presidente, membro..."
              />
              {errors.role && (
                <ErrorMessage>{errors.role.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Universidade do vinculo</Label>
              <SelectInput {...register('membershipUniversity')}>
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
              {errors.membershipUniversity && (
                <ErrorMessage>
                  {errors.membershipUniversity.message}
                </ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Liga</Label>
              <SelectInput {...register('academicLeague')}>
                <option value="">Selecione uma liga</option>
                {availableLeaguesForMembership.map((league) => (
                  <option key={league._id} value={normalizeId(league._id)}>
                    {league.name}
                  </option>
                ))}
              </SelectInput>
              {errors.academicLeague && (
                <ErrorMessage>{errors.academicLeague.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Subequipe</Label>
              <SelectInput {...register('squad')}>
                <option value="">Selecione uma subequipe</option>
                {availableSquads.map((squad) => (
                  <option key={squad._id} value={normalizeId(squad._id)}>
                    {squad.name}
                  </option>
                ))}
              </SelectInput>
              {errors.squad && (
                <ErrorMessage>{errors.squad.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Ativo</Label>
              <SelectInput {...register('isActive')}>
                <option value="true">Sim</option>
                <option value="false">Nao</option>
              </SelectInput>
              {errors.isActive && (
                <ErrorMessage>{errors.isActive.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <HelperText>
                {formErrorMessage ||
                  (selectedMembership
                    ? `Vinculo selecionado: ${selectedMembership.role} - ${selectedMembership.isActive ? 'ativo' : 'inativo'}`
                    : 'Usuários podem ter multiplos vínculos. Use Novo vinculo para adicionar quantos forem necessários.')}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton type="button" onClick={handleStartNewUser}>
              <FiPlus /> Novo usuario
            </ActionButton>
            <ActionButton
              type="button"
              onClick={handleAddMembership}
              disabled={isSaving || !selectedUser?._id}
            >
              <FiPlus /> Novo vinculo
            </ActionButton>
            <ActionButton
              type="button"
              $variant="warning"
              onClick={() => setIsDeleteMembershipConfirmOpen(true)}
              disabled={isSaving || !selectedMembership?._id}
            >
              <FiTrash2 /> Remover vinculo
            </ActionButton>
            <ActionButton
              type="button"
              $variant="warning"
              onClick={() => setIsDeleteUserConfirmOpen(true)}
              disabled={isSaving || !selectedUser?._id}
            >
              <FiTrash2 /> Remover usuario
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
              Salvar
            </ActionButton>
          </ActionRow>
        </FormCard>
      </PanelGrid>

      <ConfirmDialog
        isOpen={isDeleteMembershipConfirmOpen}
        title="Remover vinculo"
        description="Essa acao remove o vinculo selecionado do usuario com a liga e subequipe."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteMembership}
        onCancel={() => setIsDeleteMembershipConfirmOpen(false)}
        isLoading={isSaving}
      />

      <ConfirmDialog
        isOpen={isDeleteUserConfirmOpen}
        title="Remover usuario"
        description="Essa acao remove o usuario selecionado. Verifique dependencias antes de confirmar."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeleteUser}
        onCancel={() => setIsDeleteUserConfirmOpen(false)}
        isLoading={isSaving}
      />
    </Content>
  );
}
