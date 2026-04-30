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
} from 'react-icons/fi';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  adminSquadDefaultValues,
  adminSquadSchema,
  buildAdminSquadErrorMessage,
} from './utils';
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
import { filterBySearch, isSameId, normalizeId } from '../../Manager/utils';
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
  TextArea,
  TextInput,
} from '../Styles';

export default function AdminSquads() {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSquadId, setSelectedSquadId] = useState('');
  const [filterUniversityId, setFilterUniversityId] = useState('');
  const [filterLeagueId, setFilterLeagueId] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data: universities = [] } = useGetUniversities();
  const { data: leagues = [] } = useGetAcademicLeagues();
  const { data: squads = [] } = useGetSquads();
  const { data: memberships = [] } = useGetLeagueMemberships();

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
  } = useForm({
    resolver: zodResolver(adminSquadSchema),
    defaultValues: adminSquadDefaultValues,
  });

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

  const availableLeaguesForForm = useMemo(
    () =>
      formUniversity
        ? leagues.filter((league) =>
            isSameId(league.university, formUniversity),
          )
        : leagues,
    [formUniversity, leagues],
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

  const selectedSquad = useMemo(
    () => squads.find((squad) => isSameId(squad._id, selectedSquadId)) || null,
    [selectedSquadId, squads],
  );

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
        queryClient.invalidateQueries(['universities']),
        queryClient.invalidateQueries(['academic-leagues']),
        queryClient.invalidateQueries(['squads']),
        queryClient.invalidateQueries(['league-memberships']),
      ]);

      handleCreateNew();
    } catch (err) {
      notifyError(buildAdminSquadErrorMessage(err));
    }
  });

  const handleOpenUsers = () => {
    const currentLeague = getValues('academicLeague');
    const currentUniversity = getValues('university');

    if (!currentLeague) {
      notifyWarning('Selecione uma liga para abrir seus usuários');
      return;
    }

    navigate({
      pathname: '/admin/usuários',
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
        queryClient.invalidateQueries(['universities']),
        queryClient.invalidateQueries(['academic-leagues']),
        queryClient.invalidateQueries(['squads']),
        queryClient.invalidateQueries(['league-memberships']),
      ]);
      handleCreateNew();
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      notifyError(buildAdminSquadErrorMessage(err));
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
          <HeaderTitle>ADMINISTRAÇÃO DE SUBEQUIPES</HeaderTitle>
          <HeaderSubtitle>
            Crie, edite e remova subequipes em qualquer liga. Usuários podem
            participar de múltiplas ligas e múltiplas subequipes através de
            vínculos diferentes.
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
          <ActionButton
            type="button"
            onClick={() =>
              Promise.all([
                queryClient.invalidateQueries(['universities']),
                queryClient.invalidateQueries(['academic-leagues']),
                queryClient.invalidateQueries(['squads']),
                queryClient.invalidateQueries(['league-memberships']),
              ])
            }
          >
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
                    <EntityBadge>{members.length} usuários</EntityBadge>
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
              {errors.university && (
                <ErrorMessage>{errors.university.message}</ErrorMessage>
              )}
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
              {errors.academicLeague && (
                <ErrorMessage>{errors.academicLeague.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>Nome</Label>
              <TextInput
                {...register('name')}
                placeholder="Nome da subequipe"
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>Descrição</Label>
              <TextArea
                {...register('description')}
                placeholder="Descreva foco e responsabilidade da subequipe"
              />
              {errors.description && (
                <ErrorMessage>{errors.description.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>Função</Label>
              <TextInput
                {...register('function')}
                placeholder="Ex.: execução de projetos, pesquisa, gestão..."
              />
            </Field>

            <Field $fullWidth>
              <HelperText>
                {formErrorMessage ||
                  (selectedSquad?._id
                    ? 'Use Gerenciar usuários para navegar direto aos vínculos desta liga.'
                    : 'Preencha os campos para criar uma nova subequipe.')}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton type="button" onClick={handleCreateNew}>
              <FiPlus /> Nova subequipe
            </ActionButton>
            <ActionButton type="button" onClick={handleOpenUsers}>
              Gerenciar usuários
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
        description="Essa acao remove a subequipe selecionada. Revise os vínculos de usuários antes de confirmar."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        isLoading={isSaving}
      />
    </Content>
  );
}
