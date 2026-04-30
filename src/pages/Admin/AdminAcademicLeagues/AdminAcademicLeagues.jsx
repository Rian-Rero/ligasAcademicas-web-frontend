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
import {
  useCreateAcademicLeague,
  useDeleteAcademicLeague,
  useGetAcademicLeagues,
  useUpdateAcademicLeague,
} from '../../../hooks/query/academicLeague';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
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
  adminAcademicLeagueDefaultValues,
  useAdminAcademicLeagueForm,
} from './useAdminAcademicLeagueForm';

export default function AdminAcademicLeagues() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data: universities = [], refetch: refetchUniversities } =
    useGetUniversities();
  const { data: leagues = [], refetch: refetchLeagues } =
    useGetAcademicLeagues();
  const { data: memberships = [], refetch: refetchMemberships } =
    useGetLeagueMemberships();

  const { mutateAsync: createAcademicLeague, isPending: isCreating } =
    useCreateAcademicLeague();
  const { mutateAsync: updateAcademicLeague, isPending: isUpdating } =
    useUpdateAcademicLeague();
  const { mutateAsync: deleteAcademicLeague, isPending: isDeleting } =
    useDeleteAcademicLeague();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAdminAcademicLeagueForm();

  const filteredLeagues = useMemo(
    () =>
      filterBySearch(leagues, searchTerm, (league) => [
        league.name,
        league.description,
        league.area,
      ]),
    [leagues, searchTerm],
  );

  const selectedLeague = useMemo(
    () =>
      leagues.find((league) => isSameId(league._id, selectedLeagueId)) || null,
    [leagues, selectedLeagueId],
  );

  const leagueMembers = useMemo(
    () =>
      memberships.filter((membership) =>
        isSameId(membership.academicLeague, selectedLeague?._id),
      ),
    [memberships, selectedLeague?._id],
  );

  useEffect(() => {
    const hasSelectedLeague = filteredLeagues.some((league) =>
      isSameId(league._id, selectedLeagueId),
    );

    if (!hasSelectedLeague && selectedLeagueId) {
      setSelectedLeagueId('');
    }
  }, [filteredLeagues, selectedLeagueId]);

  useEffect(() => {
    setIsDeleteConfirmOpen(false);
  }, [selectedLeagueId]);

  useEffect(() => {
    if (!selectedLeague) {
      reset(adminAcademicLeagueDefaultValues);
      return;
    }

    reset({
      university: normalizeId(selectedLeague.university),
      name: selectedLeague.name || '',
      description: selectedLeague.description || '',
      area: selectedLeague.area || '',
    });
  }, [reset, selectedLeague]);

  const handleCreateNew = () => {
    setSelectedLeagueId('');
    reset(adminAcademicLeagueDefaultValues);
  };

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      university: values.university,
      name: values.name.trim(),
      description: values.description.trim(),
      area: values.area?.trim() || '',
    };

    try {
      if (selectedLeague?._id) {
        await updateAcademicLeague({
          _id: selectedLeague._id,
          inputData: payload,
        });
        notifySuccess('Liga acadêmica atualizada com sucesso');
      } else {
        await createAcademicLeague(payload);
        notifySuccess('Liga acadêmica criada com sucesso');
      }

      await Promise.all([
        refetchUniversities(),
        refetchLeagues(),
        refetchMemberships(),
      ]);

      handleCreateNew();
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Nao foi possivel salvar a liga acadêmica',
        ),
      );
    }
  });

  const handleRequestDelete = () => {
    if (!selectedLeague?._id) {
      notifyWarning('Selecione uma liga para remover');
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const handleOpenUsers = () => {
    if (!selectedLeague?._id) {
      notifyWarning('Selecione uma liga para abrir seus usuarios');
      return;
    }

    const universityId = normalizeId(selectedLeague.university);
    navigate({
      pathname: '/admin/usuarios',
      search: `?${createSearchParams({
        university: universityId,
        league: normalizeId(selectedLeague._id),
      })}`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!selectedLeague?._id) return;

    try {
      await deleteAcademicLeague(selectedLeague._id);
      notifySuccess('Liga acadêmica removida com sucesso');
      await Promise.all([
        refetchUniversities(),
        refetchLeagues(),
        refetchMemberships(),
      ]);
      handleCreateNew();
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Nao foi possivel remover a liga acadêmica',
        ),
      );
    }
  };

  const formErrorMessage =
    errors.university?.message ||
    errors.name?.message ||
    errors.description?.message;

  const isSaving = isCreating || isUpdating || isDeleting;

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>ADMINISTRACAO DE LIGAS ACADEMICAS</HeaderTitle>
          <HeaderSubtitle>
            Mantenha as ligas vinculadas a universidade correta e use a pagina
            de usuarios para controlar membros e papeis.
          </HeaderSubtitle>
        </div>

        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="search"
              placeholder="Buscar liga"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBar>
          <ActionButton type="button" onClick={() => refetchLeagues()}>
            <FiRefreshCw /> Atualizar
          </ActionButton>
        </HeaderActions>
      </HeaderSection>

      <PanelGrid>
        <ListCard>
          <SectionTitle>Ligas academicas</SectionTitle>
          <EntityList>
            {!filteredLeagues.length && (
              <EmptyState>Nenhuma liga encontrada.</EmptyState>
            )}

            {filteredLeagues.map((league) => {
              const university = universities.find((item) =>
                isSameId(item._id, league.university),
              );
              const members = memberships.filter((membership) =>
                isSameId(membership.academicLeague, league._id),
              );

              return (
                <EntityItem
                  key={league._id}
                  type="button"
                  $active={isSameId(league._id, selectedLeagueId)}
                  onClick={() => setSelectedLeagueId(normalizeId(league._id))}
                >
                  <EntityTitle>
                    <strong>{league.name}</strong>
                    <EntityBadge>{members.length} usuarios</EntityBadge>
                  </EntityTitle>
                  <EntityMeta>
                    <span>
                      {university?.name || 'Universidade nao informada'}
                    </span>
                    <span>{league.area || 'Area nao informada'}</span>
                  </EntityMeta>
                </EntityItem>
              );
            })}
          </EntityList>
        </ListCard>

        <FormCard onSubmit={onSubmit}>
          <SectionTitle>
            {selectedLeague?._id ? 'Editar liga' : 'Criar nova liga acadêmica'}
          </SectionTitle>

          <FormGrid>
            <Field $fullWidth>
              <Label>Universidade</Label>
              <SelectInput {...register('university')}>
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
            </Field>

            <Field $fullWidth>
              <Label>Nome</Label>
              <TextInput {...register('name')} placeholder="Nome da liga" />
            </Field>

            <Field $fullWidth>
              <Label>Descrição</Label>
              <TextArea
                {...register('description')}
                placeholder="Descreva a liga e seu propósito"
              />
            </Field>

            <Field $fullWidth>
              <Label>Area</Label>
              <TextInput
                {...register('area')}
                placeholder="Ex.: saúde, tecnologia, engenharia..."
              />
            </Field>

            <Field $fullWidth>
              <HelperText>
                {formErrorMessage ||
                  (selectedLeague?._id
                    ? `${leagueMembers.length} usuarios vinculados a esta liga.`
                    : 'Preencha os campos para criar uma nova liga acadêmica.')}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton type="button" onClick={handleCreateNew}>
              <FiPlus /> Nova liga
            </ActionButton>
            <ActionButton type="button" onClick={handleOpenUsers}>
              Gerenciar usuarios
            </ActionButton>
            <ActionButton
              type="button"
              $variant="warning"
              onClick={handleRequestDelete}
              disabled={!selectedLeague?._id || isSaving}
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
        title="Remover liga acadêmica"
        description="Essa acao remove a liga selecionada. Se houver usuarios vinculados, confira o impacto antes de confirmar."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        isLoading={isSaving}
      />
    </Content>
  );
}
