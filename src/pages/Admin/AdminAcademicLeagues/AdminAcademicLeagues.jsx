import { useEffect, useMemo, useState } from 'react';

import { FiRefreshCw, FiSave, FiSearch, FiTrash2 } from 'react-icons/fi';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import { ConfirmDialog } from '../../../components/common';
import {
  useGetAcademicLeagues,
  useCreateAcademicLeague,
  useDeleteAcademicLeague,
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

const initialFormState = {
  university: '',
  name: '',
  description: '',
  area: '',
};

export default function AdminAcademicLeagues() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [formState, setFormState] = useState(initialFormState);
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
    if (!filteredLeagues.length) {
      setSelectedLeagueId('');
      return;
    }

    const hasSelectedLeague = filteredLeagues.some((league) =>
      isSameId(league._id, selectedLeagueId),
    );

    if (!hasSelectedLeague) {
      setSelectedLeagueId(normalizeId(filteredLeagues[0]._id));
    }
  }, [filteredLeagues, selectedLeagueId]);

  useEffect(() => {
    setIsDeleteConfirmOpen(false);
  }, [selectedLeagueId]);

  useEffect(() => {
    if (!selectedLeague) {
      setFormState(initialFormState);
      return;
    }

    setFormState({
      university: normalizeId(selectedLeague.university),
      name: selectedLeague.name || '',
      description: selectedLeague.description || '',
      area: selectedLeague.area || '',
    });
  }, [selectedLeague]);

  useEffect(() => {
    if (formState.university) return;
    if (!universities.length) return;

    setFormState((prevState) => ({
      ...prevState,
      university: normalizeId(universities[0]._id),
    }));
  }, [formState.university, universities]);

  const handleTextChange = (field) => (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const universityId = formState.university;
    const name = formState.name.trim();
    const description = formState.description.trim();
    const area = formState.area.trim();

    if (!universityId || !name || !description) {
      notifyWarning('Selecione a universidade e preencha nome e descrição');
      return;
    }

    const payload = {
      university: universityId,
      name,
      description,
      area,
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
      setSelectedLeagueId('');
      setFormState(initialFormState);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Nao foi possivel salvar a liga academica',
        ),
      );
    }
  };

  const handleRequestDelete = () => {
    if (!selectedLeague?._id) {
      notifyWarning('Selecione uma liga para remover');
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const handleOpenUsers = () => {
    if (!selectedLeague?._id) {
      notifyWarning('Selecione uma liga para abrir seus usuários');
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
      setSelectedLeagueId('');
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Nao foi possivel remover a liga academica',
        ),
      );
    }
  };

  const isSaving = isCreating || isUpdating || isDeleting;

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>ADMINISTRAÇÃO DE LIGAS ACADÊMICAS</HeaderTitle>
          <HeaderSubtitle>
            Mantenha as ligas vinculadas à universidade correta e use a página
            de usuários para controlar membros e papéis.
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
          <SectionTitle>Ligas acadêmicas</SectionTitle>
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
                    <EntityBadge>{members.length} usuários</EntityBadge>
                  </EntityTitle>
                  <EntityMeta>
                    <span>
                      {university?.name || 'Universidade não informada'}
                    </span>
                    <span>{league.area || 'Área não informada'}</span>
                  </EntityMeta>
                </EntityItem>
              );
            })}
          </EntityList>
        </ListCard>

        <FormCard onSubmit={handleSave}>
          <SectionTitle>
            {selectedLeague?._id ? 'Editar liga' : 'Nova liga acadêmica'}
          </SectionTitle>

          <FormGrid>
            <Field $fullWidth>
              <Label>Universidade</Label>
              <SelectInput
                value={formState.university}
                onChange={handleTextChange('university')}
              >
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
              <TextInput
                value={formState.name}
                onChange={handleTextChange('name')}
                placeholder="Nome da liga"
              />
            </Field>

            <Field $fullWidth>
              <Label>Descrição</Label>
              <TextArea
                value={formState.description}
                onChange={handleTextChange('description')}
                placeholder="Descreva a liga e seu propósito"
              />
            </Field>

            <Field $fullWidth>
              <Label>Área</Label>
              <TextInput
                value={formState.area}
                onChange={handleTextChange('area')}
                placeholder="Ex.: saúde, tecnologia, engenharia..."
              />
            </Field>

            <Field $fullWidth>
              <HelperText>
                {selectedLeague?._id
                  ? `${leagueMembers.length} usuários vinculados a esta liga.`
                  : 'Depois de salvar, use a página de usuários para vincular membros.'}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton type="button" onClick={handleOpenUsers}>
              Gerenciar usuários
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
        description="Essa ação remove a liga selecionada. Se houver usuários vinculados, confira o impacto antes de confirmar."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        isLoading={isSaving}
      />
    </Content>
  );
}
