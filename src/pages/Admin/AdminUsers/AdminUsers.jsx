import { useEffect, useMemo, useState } from 'react';

import { FiRefreshCw, FiSave, FiSearch, FiUser } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import {
  useGetLeagueMemberships,
  useUpdateLeagueMembership,
} from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import { useGetUniversities } from '../../../hooks/query/university';
import {
  useGetUsers,
  useUpdateUserByManagement,
} from '../../../hooks/query/user';
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
} from '../Styles';

const initialFormState = {
  name: '',
  email: '',
  globalRole: '',
  emailVerified: false,
  academicLeague: '',
  role: '',
  squad: '',
  isActive: true,
};

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
  const [formState, setFormState] = useState(initialFormState);

  const { data: universities = [], refetch: refetchUniversities } =
    useGetUniversities();
  const { data: leagues = [], refetch: refetchLeagues } =
    useGetAcademicLeagues();
  const { data: squads = [], refetch: refetchSquads } = useGetSquads();
  const { data: users = [], refetch: refetchUsers } = useGetUsers();
  const { data: memberships = [], refetch: refetchMemberships } =
    useGetLeagueMemberships();

  const { mutateAsync: updateUserByManagement, isPending: isUpdatingUser } =
    useUpdateUserByManagement();
  const { mutateAsync: updateMembership, isPending: isUpdatingMembership } =
    useUpdateLeagueMembership();

  const filteredLeagues = useMemo(
    () =>
      selectedUniversityId
        ? leagues.filter((league) =>
            isSameId(league.university, selectedUniversityId),
          )
        : leagues,
    [leagues, selectedUniversityId],
  );

  const filteredMemberships = useMemo(
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
      filteredMemberships.reduce((acc, membership) => {
        const userId = normalizeId(membership.user);
        acc[userId] = acc[userId] || [];
        acc[userId].push(membership);
        return acc;
      }, {}),
    [filteredMemberships],
  );

  const filteredUsers = useMemo(() => {
    const usersWithMemberships = users.filter((user) =>
      filteredMemberships.some((membership) =>
        isSameId(membership.user, user._id),
      ),
    );

    return filterBySearch(usersWithMemberships, searchTerm, (user) => [
      user.name,
      user.email,
      user.globalRole,
    ]);
  }, [filteredMemberships, searchTerm, users]);

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
    if (!filteredUsers.length) {
      setSelectedUserId('');
      setSelectedMembershipId('');
      return;
    }

    const hasSelectedUser = filteredUsers.some((user) =>
      isSameId(user._id, selectedUserId),
    );

    if (!hasSelectedUser) {
      setSelectedUserId(normalizeId(filteredUsers[0]._id));
    }
  }, [filteredUsers, selectedUserId]);

  const selectedUser = useMemo(
    () => users.find((user) => isSameId(user._id, selectedUserId)) || null,
    [selectedUserId, users],
  );

  const selectedUserMemberships = useMemo(
    () => membershipsByUser[normalizeId(selectedUser?._id)] || [],
    [membershipsByUser, selectedUser?._id],
  );

  useEffect(() => {
    if (!selectedUserMemberships.length) {
      setSelectedMembershipId('');
      return;
    }

    const hasSelectedMembership = selectedUserMemberships.some((membership) =>
      isSameId(membership._id, selectedMembershipId),
    );

    if (!hasSelectedMembership) {
      setSelectedMembershipId(normalizeId(selectedUserMemberships[0]._id));
    }
  }, [selectedMembershipId, selectedUserMemberships]);

  const selectedMembership = useMemo(
    () =>
      selectedUserMemberships.find((membership) =>
        isSameId(membership._id, selectedMembershipId),
      ) || null,
    [selectedMembershipId, selectedUserMemberships],
  );

  useEffect(() => {
    if (!selectedUser) {
      setFormState(initialFormState);
      return;
    }

    setFormState({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      globalRole: selectedUser.globalRole || '',
      emailVerified: Boolean(selectedUser.emailVerified),
      academicLeague: normalizeId(selectedMembership?.academicLeague) || '',
      role: selectedMembership?.role || '',
      squad: normalizeId(selectedMembership?.squad) || '',
      isActive: selectedMembership
        ? Boolean(selectedMembership.isActive)
        : true,
    });
  }, [selectedMembership, selectedUser]);

  useEffect(() => {
    if (!formState.academicLeague) return;

    if (selectedUniversityId) {
      const belongsToUniversity = leagues.some(
        (league) =>
          isSameId(league._id, formState.academicLeague) &&
          isSameId(league.university, selectedUniversityId),
      );

      if (!belongsToUniversity) {
        setFormState((prevState) => ({ ...prevState, academicLeague: '' }));
      }
    }
  }, [formState.academicLeague, leagues, selectedUniversityId]);

  const availableSquads = useMemo(
    () =>
      squads.filter((squad) =>
        isSameId(squad.academicLeague, formState.academicLeague),
      ),
    [formState.academicLeague, squads],
  );

  useEffect(() => {
    if (!formState.academicLeague) return;

    const hasSelectedSquad = availableSquads.some((squad) =>
      isSameId(squad._id, formState.squad),
    );

    if (hasSelectedSquad) return;

    setFormState((prevState) => ({
      ...prevState,
      squad: normalizeId(availableSquads[0]?._id),
    }));
  }, [availableSquads, formState.academicLeague, formState.squad]);

  const handleTextChange = (field) => (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedUser?._id || !selectedMembership?._id) {
      notifyWarning('Selecione um usuário e um vínculo para editar');
      return;
    }

    const name = formState.name.trim();
    const email = formState.email.trim().toLocaleLowerCase('pt-BR');
    const globalRole = formState.globalRole.trim();
    const role = formState.role.trim();

    if (!name || !email || !formState.academicLeague || !role) {
      notifyWarning('Preencha os campos obrigatórios do usuário e do vínculo');
      return;
    }

    if (!formState.squad) {
      notifyWarning('Selecione uma subequipe para o vínculo');
      return;
    }

    try {
      await Promise.all([
        updateUserByManagement({
          _id: selectedUser._id,
          newUserData: {
            name,
            email,
            globalRole: globalRole || 'league-member',
            emailVerified: formState.emailVerified,
          },
        }),
        updateMembership({
          _id: selectedMembership._id,
          inputData: {
            academicLeague: formState.academicLeague,
            squad: formState.squad,
            role,
            isActive: formState.isActive,
          },
        }),
      ]);

      await Promise.all([
        refetchUniversities(),
        refetchLeagues(),
        refetchSquads(),
        refetchUsers(),
        refetchMemberships(),
      ]);
      notifySuccess('Usuário atualizado com sucesso');
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(err, 'Nao foi possivel atualizar o usuario'),
      );
    }
  };

  const isSaving = isUpdatingUser || isUpdatingMembership;

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>GERENCIAMENTO DE USUÁRIOS</HeaderTitle>
          <HeaderSubtitle>
            Filtre por universidade e liga para editar o perfil do usuário, o
            vínculo com a liga e o status de ativação.
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
          <ActionButton type="button" onClick={() => refetchUsers()}>
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
                    <span>{formatRole(user.globalRole)}</span>
                  </EntityMeta>
                </EntityItem>
              );
            })}
          </EntityList>
        </ListCard>

        <FormCard onSubmit={handleSave}>
          <SectionTitle>
            {selectedUser?._id ? 'Editar usuário' : 'Selecione um usuário'}
          </SectionTitle>

          <FormGrid>
            <Field $fullWidth>
              <Label>
                <FiUser /> Nome
              </Label>
              <TextInput
                value={formState.name}
                onChange={handleTextChange('name')}
                placeholder="Nome do usuário"
              />
            </Field>

            <Field $fullWidth>
              <Label>E-mail</Label>
              <TextInput
                type="email"
                value={formState.email}
                onChange={handleTextChange('email')}
                placeholder="E-mail do usuário"
              />
            </Field>

            <Field>
              <Label>Perfil global</Label>
              <SelectInput
                value={formState.globalRole}
                onChange={handleTextChange('globalRole')}
              >
                <option value="">Selecione</option>
                <option value="admin">Administrador</option>
                <option value="manager">Gestor</option>
                <option value="league-member">Membro de liga</option>
              </SelectInput>
            </Field>

            <Field>
              <Label>E-mail verificado</Label>
              <SelectInput
                value={formState.emailVerified ? 'true' : 'false'}
                onChange={(event) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    emailVerified: event.target.value === 'true',
                  }))
                }
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </SelectInput>
            </Field>

            <Field>
              <Label>Papel na liga</Label>
              <TextInput
                value={formState.role}
                onChange={handleTextChange('role')}
                placeholder="Ex.: presidente, membro..."
              />
            </Field>

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
                value={formState.academicLeague}
                onChange={handleTextChange('academicLeague')}
              >
                <option value="">Selecione uma liga</option>
                {filteredLeagues.map((league) => (
                  <option key={league._id} value={normalizeId(league._id)}>
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
                <option value="">Selecione uma subequipe</option>
                {availableSquads.map((squad) => (
                  <option key={squad._id} value={normalizeId(squad._id)}>
                    {squad.name}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field>
              <Label>Ativo</Label>
              <SelectInput
                value={formState.isActive ? 'true' : 'false'}
                onChange={(event) =>
                  setFormState((prevState) => ({
                    ...prevState,
                    isActive: event.target.value === 'true',
                  }))
                }
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </SelectInput>
            </Field>

            <Field $fullWidth>
              <HelperText>
                {selectedMembership
                  ? `Vínculo selecionado: ${selectedMembership.role} • ${selectedMembership.isActive ? 'ativo' : 'inativo'}`
                  : 'Escolha um usuário para editar seu vínculo na liga.'}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton
              type="submit"
              disabled={isSaving || !selectedUser?._id}
            >
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
    </Content>
  );
}
