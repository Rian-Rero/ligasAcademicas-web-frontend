import { useEffect, useMemo, useState } from 'react';

import {
  FiCheckCircle,
  FiKey,
  FiMail,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiShield,
  FiUser,
} from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  ActionButton,
  ActionsRow,
  Content,
  EditorCard,
  EmptyState,
  Field,
  FormGrid,
  HeaderSection,
  HeaderSubtitle,
  HeaderTitle,
  Label,
  MemberBadge,
  MemberEmail,
  MemberItem,
  MemberList,
  MemberMeta,
  MemberTitle,
  MembersCard,
  PanelGrid,
  SearchBar,
  SearchIcon,
  SearchInput,
  SectionTitle,
  SelectInput,
  TextInput,
  ToggleLabel,
  TogglesRow,
} from './Styles';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import {
  useGetLeagueMemberships,
  useUpdateLeagueMembership,
} from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import {
  useGetUsersByIds,
  useResetUserPasswordByManagement,
  useUpdateUserByManagement,
} from '../../../hooks/query/user';
import useAuthStore from '../../../stores/auth';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast';

const initialFormState = {
  name: '',
  email: '',
  globalRole: 'league-member',
  emailVerified: false,
  role: 'league-member',
  academicLeague: '',
  squad: '',
  isActive: true,
};

function normalizeId(value) {
  return String(value || '');
}

function isSameId(left, right) {
  return normalizeId(left) === normalizeId(right);
}

function buildRequestErrorMessage(err, fallback) {
  const responseMessage = err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' | ');
  }

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message;
  }

  return fallback;
}

function formatRole(role) {
  if (!role) return 'Não definido';

  return String(role)
    .replace(/[-_]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) =>
      word ? word[0].toLocaleUpperCase('pt-BR') + word.slice(1) : '',
    )
    .join(' ');
}

export default function ManagerMembers() {
  const theme = useTheme();
  const authUser = useAuthStore((state) => state.auth?.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembershipId, setSelectedMembershipId] = useState('');
  const [formState, setFormState] = useState(initialFormState);

  const { data: managerMemberships = [] } = useGetLeagueMemberships({
    filters: { user: authUser?._id, isActive: true },
    enabled: Boolean(authUser?._id),
  });

  const managerLeagueId = normalizeId(managerMemberships[0]?.academicLeague);

  const {
    data: leagueMemberships = [],
    isLoading: isLoadingMemberships,
    refetch: refetchMemberships,
  } = useGetLeagueMemberships({
    filters: { academicLeague: managerLeagueId },
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

  const { data: leagues = [] } = useGetAcademicLeagues({
    filters: { _id: managerLeagueId },
    enabled: Boolean(managerLeagueId),
  });

  const { data: squads = [] } = useGetSquads({
    filters: { academicLeague: managerLeagueId },
    enabled: Boolean(managerLeagueId),
  });

  const usersById = useMemo(
    () =>
      users.reduce((acc, user) => {
        acc[normalizeId(user._id)] = user;
        return acc;
      }, {}),
    [users],
  );

  const squadsById = useMemo(
    () =>
      squads.reduce((acc, squad) => {
        acc[normalizeId(squad._id)] = squad;
        return acc;
      }, {}),
    [squads],
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

  const filteredMembers = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLocaleLowerCase('pt-BR');
    if (!normalizedQuery) return members;

    return members.filter(({ user, membership }) => {
      const role = String(membership.role || '').toLocaleLowerCase('pt-BR');
      const name = String(user.name || '').toLocaleLowerCase('pt-BR');
      const email = String(user.email || '').toLocaleLowerCase('pt-BR');
      return (
        name.includes(normalizedQuery) ||
        email.includes(normalizedQuery) ||
        role.includes(normalizedQuery)
      );
    });
  }, [members, searchTerm]);

  useEffect(() => {
    if (!filteredMembers.length) {
      setSelectedMembershipId('');
      return;
    }

    const hasSelectedMember = filteredMembers.some(({ membership }) =>
      isSameId(membership._id, selectedMembershipId),
    );

    if (!hasSelectedMember) {
      setSelectedMembershipId(normalizeId(filteredMembers[0].membership._id));
    }
  }, [filteredMembers, selectedMembershipId]);

  const selectedMember = useMemo(
    () =>
      members.find(({ membership }) =>
        isSameId(membership._id, selectedMembershipId),
      ) || null,
    [members, selectedMembershipId],
  );

  useEffect(() => {
    if (!selectedMember) {
      setFormState(initialFormState);
      return;
    }

    setFormState({
      name: selectedMember.user.name || '',
      email: selectedMember.user.email || '',
      globalRole: selectedMember.user.globalRole || 'league-member',
      emailVerified: Boolean(selectedMember.user.emailVerified),
      role: selectedMember.membership.role || 'league-member',
      academicLeague:
        normalizeId(selectedMember.membership.academicLeague) ||
        managerLeagueId,
      squad: normalizeId(selectedMember.membership.squad),
      isActive: Boolean(selectedMember.membership.isActive),
    });
  }, [managerLeagueId, selectedMember]);

  const availableSquads = useMemo(() => {
    if (!formState.academicLeague) return [];

    return squads.filter((squad) =>
      isSameId(squad.academicLeague, formState.academicLeague),
    );
  }, [formState.academicLeague, squads]);

  useEffect(() => {
    if (!formState.academicLeague) return;

    const hasSelectedSquad = availableSquads.some((squad) =>
      isSameId(squad._id, formState.squad),
    );

    if (hasSelectedSquad) return;

    const nextSquadId = normalizeId(availableSquads[0]?._id);

    setFormState((prevState) => {
      if (prevState.squad === nextSquadId) return prevState;
      return { ...prevState, squad: nextSquadId };
    });
  }, [availableSquads, formState.academicLeague, formState.squad]);

  const { mutateAsync: updateUserByManagement, isPending: isUpdatingUser } =
    useUpdateUserByManagement();

  const {
    mutateAsync: updateLeagueMembership,
    isPending: isUpdatingMembership,
  } = useUpdateLeagueMembership();

  const { mutateAsync: resetPassword, isPending: isResettingPassword } =
    useResetUserPasswordByManagement();

  const isSaving = isUpdatingUser || isUpdatingMembership;
  const isLoading = isLoadingMemberships || isLoadingUsers;

  const handleTextChange = (field) => (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  const handleToggle = (field) => (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: event.target.checked,
    }));
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchMemberships(), refetchUsers()]);
      notifySuccess('Lista de membros atualizada');
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Nao foi possivel atualizar a lista de membros',
        ),
      );
    }
  };

  const handleSaveMember = async () => {
    if (!selectedMember) return;

    const normalizedName = formState.name.trim();
    const normalizedEmail = formState.email.trim().toLocaleLowerCase('pt-BR');
    const normalizedGlobalRole = formState.globalRole.trim();
    const normalizedLeagueRole = formState.role.trim();

    if (!normalizedName || !normalizedEmail) {
      notifyWarning('Nome e e-mail são obrigatórios para atualizar o membro');
      return;
    }

    if (!formState.academicLeague) {
      notifyWarning('Selecione uma equipe (liga acadêmica) para o membro');
      return;
    }

    const [userUpdateResult, membershipUpdateResult] = await Promise.allSettled(
      [
        updateUserByManagement({
          _id: selectedMember.user._id,
          newUserData: {
            name: normalizedName,
            email: normalizedEmail,
            globalRole: normalizedGlobalRole || 'league-member',
            emailVerified: formState.emailVerified,
          },
        }),
        updateLeagueMembership({
          _id: selectedMember.membership._id,
          inputData: {
            academicLeague: formState.academicLeague,
            squad: formState.squad || null,
            role: normalizedLeagueRole || 'league-member',
            isActive: formState.isActive,
          },
        }),
      ],
    );

    try {
      await Promise.all([refetchMemberships(), refetchUsers()]);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'As alteracoes foram processadas, mas nao foi possivel atualizar os dados na tela',
        ),
      );
      return;
    }

    const userUpdateSucceeded = userUpdateResult.status === 'fulfilled';
    const membershipUpdateSucceeded =
      membershipUpdateResult.status === 'fulfilled';

    if (userUpdateSucceeded && membershipUpdateSucceeded) {
      notifySuccess('Membro atualizado com sucesso');
      return;
    }

    if (userUpdateSucceeded || membershipUpdateSucceeded) {
      notifyWarning(
        'As alteracoes foram aplicadas apenas parcialmente. Revise os dados atualizados e tente novamente para concluir a operacao',
      );
      return;
    }

    const error =
      userUpdateResult.status === 'rejected'
        ? userUpdateResult.reason
        : membershipUpdateResult.reason;

    notifyError(
      buildRequestErrorMessage(error, 'Nao foi possivel salvar as alteracoes'),
    );
  };

  const handleResetPassword = async () => {
    if (!selectedMember?.user?._id) {
      notifyWarning('Selecione um membro para resetar a senha');
      return;
    }

    try {
      const result = await resetPassword(selectedMember.user._id);
      const emailTarget = result?.email || selectedMember.user.email;

      notifySuccess(`Nova senha enviada para ${emailTarget}`);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Não foi possível resetar a senha do membro',
        ),
      );
    }
  };

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>MEMBROS DA LIGA</HeaderTitle>
          <HeaderSubtitle>
            Gerencie dados de conta, status de verificação, papel e vínculo dos
            membros.
          </HeaderSubtitle>
        </div>

        <ActionButton
          type="button"
          onClick={handleRefresh}
          disabled={isLoading || isSaving || isResettingPassword}
        >
          <FiRefreshCw /> Atualizar lista
        </ActionButton>
      </HeaderSection>

      <SearchBar>
        <SearchIcon>
          <FiSearch />
        </SearchIcon>
        <SearchInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar por nome, e-mail ou função"
          aria-label="Buscar membros"
        />
      </SearchBar>

      <PanelGrid>
        <MembersCard>
          <SectionTitle>Membros ({filteredMembers.length})</SectionTitle>

          <MemberList>
            {isLoading && <EmptyState>Carregando membros...</EmptyState>}

            {!isLoading && !filteredMembers.length && (
              <EmptyState>Nenhum membro encontrado com esse filtro.</EmptyState>
            )}

            {!isLoading &&
              filteredMembers.map(({ membership, user }) => {
                const memberSquad = squadsById[normalizeId(membership.squad)];
                const isSelected = isSameId(
                  membership._id,
                  selectedMembershipId,
                );

                return (
                  <MemberItem
                    key={membership._id}
                    type="button"
                    $active={isSelected}
                    onClick={() =>
                      setSelectedMembershipId(normalizeId(membership._id))
                    }
                  >
                    <MemberTitle>
                      <span>{user.name}</span>
                      <MemberBadge
                        $variant={user.emailVerified ? 'ok' : 'warn'}
                      >
                        {user.emailVerified ? 'Verificado' : 'Pendente'}
                      </MemberBadge>
                    </MemberTitle>

                    <MemberEmail>{user.email}</MemberEmail>

                    <MemberMeta>
                      <span>{formatRole(membership.role)}</span>
                      <span>
                        {memberSquad?.name || 'Sem subequipe'}
                        {membership.isActive ? '' : ' - Inativo'}
                      </span>
                    </MemberMeta>
                  </MemberItem>
                );
              })}
          </MemberList>
        </MembersCard>

        <EditorCard>
          <SectionTitle>Editar membro</SectionTitle>

          {!selectedMember && (
            <EmptyState>
              Selecione um membro na lista para editar dados e permissões.
            </EmptyState>
          )}

          {selectedMember && (
            <FormGrid>
              <Field>
                <Label>
                  <FiUser /> Nome completo
                </Label>
                <TextInput
                  type="text"
                  value={formState.name}
                  onChange={handleTextChange('name')}
                />
              </Field>

              <Field>
                <Label>
                  <FiMail /> E-mail
                </Label>
                <TextInput
                  type="email"
                  value={formState.email}
                  onChange={handleTextChange('email')}
                />
              </Field>

              <Field>
                <Label>
                  <FiShield /> Papel global
                </Label>
                <SelectInput
                  value={formState.globalRole}
                  onChange={handleTextChange('globalRole')}
                >
                  <option value="league-member">Membro</option>
                  <option value="manager">Gestor</option>
                  <option value="admin">Administrador</option>
                </SelectInput>
              </Field>

              <Field>
                <Label>
                  <FiCheckCircle /> Papel na liga
                </Label>
                <TextInput
                  type="text"
                  value={formState.role}
                  onChange={handleTextChange('role')}
                  placeholder="Ex: membro, diretor, coordenador"
                />
              </Field>

              <Field>
                <Label>Equipe (Liga Acadêmica)</Label>
                <SelectInput
                  value={formState.academicLeague}
                  onChange={handleTextChange('academicLeague')}
                >
                  <option value="">Selecione a equipe</option>
                  {leagues.map((league) => (
                    <option key={league._id} value={league._id}>
                      {league.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field>
                <Label>Subequipe</Label>
                <SelectInput
                  value={formState.squad}
                  onChange={handleTextChange('squad')}
                >
                  <option value="">Selecione a subequipe</option>
                  {availableSquads.map((squad) => (
                    <option key={squad._id} value={squad._id}>
                      {squad.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <TogglesRow>
                <ToggleLabel>
                  <input
                    type="checkbox"
                    checked={formState.emailVerified}
                    onChange={handleToggle('emailVerified')}
                  />
                  E-mail verificado
                </ToggleLabel>

                <ToggleLabel>
                  <input
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={handleToggle('isActive')}
                  />
                  Vínculo ativo na liga
                </ToggleLabel>
              </TogglesRow>

              <ActionsRow>
                <ActionButton
                  type="button"
                  $variant="warning"
                  onClick={handleResetPassword}
                  disabled={isSaving || isResettingPassword}
                >
                  {isResettingPassword ? (
                    <>
                      <ClipLoader
                        size={16}
                        color={theme.colors.white}
                        speedMultiplier={0.9}
                      />
                      Enviando nova senha...
                    </>
                  ) : (
                    <>
                      <FiKey /> Resetar senha e enviar por e-mail
                    </>
                  )}
                </ActionButton>

                <ActionButton
                  type="button"
                  $variant="primary"
                  onClick={handleSaveMember}
                  disabled={isSaving || isResettingPassword}
                >
                  {isSaving ? (
                    <>
                      <ClipLoader
                        size={16}
                        color={theme.colors.white}
                        speedMultiplier={0.9}
                      />
                      Salvando alterações...
                    </>
                  ) : (
                    <>
                      <FiSave /> Salvar alterações
                    </>
                  )}
                </ActionButton>
              </ActionsRow>
            </FormGrid>
          )}
        </EditorCard>
      </PanelGrid>
    </Content>
  );
}
