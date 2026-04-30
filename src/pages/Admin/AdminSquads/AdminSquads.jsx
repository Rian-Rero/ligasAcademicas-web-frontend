import { useEffect, useMemo, useState } from 'react';

import {
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import { ConfirmDialog } from '../../../components/common';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import {
  useCreateSquad,
  useDeleteSquad,
  useGetSquads,
  useUpdateSquad,
} from '../../../hooks/query/squad';
import { useGetUniversities } from '../../../hooks/query/university';
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from '../../../utils/toast';
import {
  buildRequestErrorMessage,
  filterBySearch,
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
  TextArea,
  TextInput,
} from '../Styles';
import {
  adminSquadDefaultValues,
  useAdminSquadForm,
} from './useAdminSquadForm';

export default function AdminSquads() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSquadId, setSelectedSquadId] = useState('');
  const [filterUniversityId, setFilterUniversityId] = useState('');
  const [filterLeagueId, setFilterLeagueId] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data: universities = [], refetch: refetchUniversities } =
    useGetUniversities();
  const { data: leagues = [], refetch: refetchLeagues } =
    useGetAcademicLeagues();
  const { data: squads = [], refetch: refetchSquads } = useGetSquads();
  const { data: memberships = [], refetch: refetchMemberships } =
    useGetLeagueMemberships();

  const { mutateAsync: createSquad, isPending: isCreating } = useCreateSquad();
  const { mutateAsync: updateSquad, isPending: isUpdating } = useUpdateSquad();
  const { mutateAsync: deleteSquad, isPending: isDeleting } = useDeleteSquad();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useAdminSquadForm();

  const formUniversity = watch('university');
  const formAcademicLeague = watch('academicLeague');

  const availableLeagues = useMemo(
    () =>
      filterUniversityId
        ? leagues.filter((league) =>
            isSameId(league.university, filterUniversityId),
          )
        : leagues,
    [filterUniversityId, leagues],
  );

  const filteredSquads = useMemo(() => {
    const byScope = squads.filter((squad) => {
      if (!filterUniversityId && !filterLeagueId) return true;

      const league = leagues.find((item) =>
        isSameId(item._id, squad.academicLeague),
      );
      const matchesUniversity =
        !filterUniversityId || isSameId(league?.university, filterUniversityId);
      const matchesLeague =
        !filterLeagueId || isSameId(squad.academicLeague, filterLeagueId);

      return matchesUniversity && matchesLeague;
    });

    return filterBySearch(byScope, searchTerm, (squad) => [
      squad.name,
      squad.description,
      squad.function,
    ]);
  }, [filterLeagueId, filterUniversityId, leagues, searchTerm, squads]);

  useEffect(() => {
    if (!filterUniversityId || !filterLeagueId) return;

    const hasLeague = availableLeagues.some((league) =>
      isSameId(league._id, filterLeagueId),
    );
    if (!hasLeague) setFilterLeagueId('');
  }, [availableLeagues, filterLeagueId, filterUniversityId]);

  useEffect(() => {
    const hasSelectedSquad = filteredSquads.some((squad) =>
      isSameId(squad._id, selectedSquadId),
    );

    if (!hasSelectedSquad && selectedSquadId) {
      setSelectedSquadId('');
    }
  }, [filteredSquads, selectedSquadId]);

  useEffect(() => {
    setIsDeleteConfirmOpen(false);
  }, [selectedSquadId]);

  const selectedSquad = useMemo(
    () => squads.find((squad) => isSameId(squad._id, selectedSquadId)) || null,
    [selectedSquadId, squads],
  );

  useEffect(() => {
    if (!selectedSquad) {
      reset(adminSquadDefaultValues);
      return;
    }

    const squadLeague = leagues.find((league) =>
      isSameId(league._id, selectedSquad.academicLeague),
    );

    reset({
      university: normalizeId(squadLeague?.university),
      academicLeague: normalizeId(selectedSquad.academicLeague),
      name: selectedSquad.name || '',
      description: selectedSquad.description || '',
      function: selectedSquad.function || '',
    });
  }, [leagues, reset, selectedSquad]);

  const availableLeaguesForForm = useMemo(
    () =>
      formUniversity
        ? leagues.filter((league) =>
            isSameId(league.university, formUniversity),
          )
        : leagues,
    [formUniversity, leagues],
  );

  useEffect(() => {
    if (!formAcademicLeague) return;

    const hasLeague = availableLeaguesForForm.some((league) =>
      isSameId(league._id, formAcademicLeague),
    );

    if (!hasLeague) {
      setValue('academicLeague', '');
    }
  }, [availableLeaguesForForm, formAcademicLeague, setValue]);

  const handleCreateNew = () => {
    setSelectedSquadId('');
    reset(adminSquadDefaultValues);
  };

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      academicLeague: values.academicLeague,
      name: values.name.trim(),
      description: values.description.trim(),
      function: values.function?.trim() || '',
    };

    try {
      if (selectedSquad?._id) {
        await updateSquad({ _id: selectedSquad._id, inputData: payload });
        notifySuccess('Subequipe atualizada com sucesso');
      } else {
        await createSquad(payload);
        notifySuccess('Subequipe criada com sucesso');
      }

      await Promise.all([
        refetchUniversities(),
        refetchLeagues(),
        refetchSquads(),
        refetchMemberships(),
      ]);

      handleCreateNew();
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(err, 'Nao foi possivel salvar a subequipe'),
      );
    }
  });

  const handleOpenUsers = () => {
    const currentLeague = getValues('academicLeague');
    const currentUniversity = getValues('university');

    if (!currentLeague) {
      notifyWarning('Selecione uma liga para abrir seus usuarios');
      return;
    }

    navigate({
      pathname: '/admin/usuarios',
      search: `?${createSearchParams({
        university: currentUniversity,
        league: currentLeague,
      })}`,
    });
  };

  const handleRequestDelete = () => {
    if (!selectedSquad?._id) {
      notifyWarning('Selecione uma subequipe para remover');
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSquad?._id) return;

    try {
      await deleteSquad(selectedSquad._id);
      notifySuccess('Subequipe removida com sucesso');
      await Promise.all([
        refetchUniversities(),
        refetchLeagues(),
        refetchSquads(),
        refetchMemberships(),
      ]);
      handleCreateNew();
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(err, 'Nao foi possivel remover a subequipe'),
      );
    }
  };

  const formErrorMessage =
    errors.academicLeague?.message ||
    errors.name?.message ||
    errors.description?.message;

  const isSaving = isCreating || isUpdating || isDeleting;

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>ADMINISTRACAO DE SUBEQUIPES</HeaderTitle>
          <HeaderSubtitle>
            Crie, edite e remova subequipes em qualquer liga. Usuarios podem
            participar de multiplas ligas e multiplas subequipes atraves de
            vinculos diferentes.
          </HeaderSubtitle>
        </div>

        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="search"
              placeholder="Buscar subequipe"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBar>
          <ActionButton type="button" onClick={() => refetchSquads()}>
            <FiRefreshCw /> Atualizar
          </ActionButton>
        </HeaderActions>
      </HeaderSection>

      <PanelGrid>
        <ListCard>
          <SectionTitle>Subequipes ({filteredSquads.length})</SectionTitle>

          <FormGrid>
            <Field>
              <Label>Universidade</Label>
              <SelectInput
                value={filterUniversityId}
                onChange={(event) => setFilterUniversityId(event.target.value)}
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
                value={filterLeagueId}
                onChange={(event) => setFilterLeagueId(event.target.value)}
              >
                <option value="">Todas</option>
                {availableLeagues.map((league) => (
                  <option key={league._id} value={normalizeId(league._id)}>
                    {league.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </FormGrid>

          <EntityList>
            {!filteredSquads.length && (
              <EmptyState>Nenhuma subequipe encontrada.</EmptyState>
            )}

            {filteredSquads.map((squad) => {
              const league = leagues.find((item) =>
                isSameId(item._id, squad.academicLeague),
              );
              const university = universities.find((item) =>
                isSameId(item._id, league?.university),
              );
              const members = memberships.filter((membership) =>
                isSameId(membership.squad, squad._id),
              );

              return (
                <EntityItem
                  key={squad._id}
                  type="button"
                  $active={isSameId(squad._id, selectedSquadId)}
                  onClick={() => setSelectedSquadId(normalizeId(squad._id))}
                >
                  <EntityTitle>
                    <strong>{squad.name}</strong>
                    <EntityBadge>{members.length} usuarios</EntityBadge>
                  </EntityTitle>
                  <EntityMeta>
                    <span>{league?.name || 'Liga nao informada'}</span>
                    <span>
                      {university?.name || 'Universidade nao informada'}
                    </span>
                  </EntityMeta>
                </EntityItem>
              );
            })}
          </EntityList>
        </ListCard>

        <FormCard onSubmit={onSubmit}>
          <SectionTitle>
            {selectedSquad?._id ? 'Editar subequipe' : 'Criar nova subequipe'}
          </SectionTitle>

          <FormGrid>
            <Field>
              <Label>Universidade</Label>
              <SelectInput {...register('university')}>
                <option value="">Selecione</option>
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
              <SelectInput {...register('academicLeague')}>
                <option value="">Selecione</option>
                {availableLeaguesForForm.map((league) => (
                  <option key={league._id} value={normalizeId(league._id)}>
                    {league.name}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field $fullWidth>
              <Label>Nome</Label>
              <TextInput
                {...register('name')}
                placeholder="Nome da subequipe"
              />
            </Field>

            <Field $fullWidth>
              <Label>Descricao</Label>
              <TextArea
                {...register('description')}
                placeholder="Descreva foco e responsabilidade da subequipe"
              />
            </Field>

            <Field $fullWidth>
              <Label>Funcao</Label>
              <TextInput
                {...register('function')}
                placeholder="Ex.: execucao de projetos, pesquisa, gestao..."
              />
            </Field>

            <Field $fullWidth>
              <HelperText>
                {formErrorMessage ||
                  (selectedSquad?._id
                    ? 'Use Gerenciar usuarios para navegar direto aos vinculos desta liga.'
                    : 'Preencha os campos para criar uma nova subequipe.')}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton type="button" onClick={handleCreateNew}>
              <FiPlus /> Nova subequipe
            </ActionButton>
            <ActionButton type="button" onClick={handleOpenUsers}>
              Gerenciar usuarios
            </ActionButton>
            <ActionButton
              type="button"
              $variant="warning"
              onClick={handleRequestDelete}
              disabled={!selectedSquad?._id || isSaving}
            >
              <FiTrash2 /> Remover
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
        isOpen={isDeleteConfirmOpen}
        title="Remover subequipe"
        description="Essa acao remove a subequipe selecionada. Revise os vinculos de usuarios antes de confirmar."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        isLoading={isSaving}
      />
    </Content>
  );
}
