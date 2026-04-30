import { useEffect, useMemo, useState } from 'react';

import { FiRefreshCw, FiSave, FiSearch, FiTrash2 } from 'react-icons/fi';
import { LuBuilding } from 'react-icons/lu';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import { ConfirmDialog } from '../../../components/common';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import {
  useCreateUniversity,
  useDeleteUniversity,
  useGetUniversities,
  useUpdateUniversity,
} from '../../../hooks/query/university';
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
  TextInput,
} from '../Styles';

const initialFormState = {
  name: '',
  street: '',
  number: '',
  complement: '',
};

export default function AdminUniversities() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [formState, setFormState] = useState(initialFormState);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data: universities = [], refetch: refetchUniversities } =
    useGetUniversities();
  const { data: leagues = [], refetch: refetchLeagues } =
    useGetAcademicLeagues();
  const { data: memberships = [], refetch: refetchMemberships } =
    useGetLeagueMemberships();

  const { mutateAsync: createUniversity, isPending: isCreating } =
    useCreateUniversity();
  const { mutateAsync: updateUniversity, isPending: isUpdating } =
    useUpdateUniversity();
  const { mutateAsync: deleteUniversity, isPending: isDeleting } =
    useDeleteUniversity();

  const filteredUniversities = useMemo(
    () =>
      filterBySearch(universities, searchTerm, (university) => [
        university.name,
        university.street,
        university.complement,
      ]),
    [searchTerm, universities],
  );

  const selectedUniversity = useMemo(
    () =>
      universities.find((university) =>
        isSameId(university._id, selectedUniversityId),
      ) || null,
    [selectedUniversityId, universities],
  );

  const universityLeagues = useMemo(
    () =>
      leagues.filter((league) =>
        isSameId(league.university, selectedUniversity?._id),
      ),
    [leagues, selectedUniversity?._id],
  );

  const universityLeagueIds = useMemo(
    () => universityLeagues.map((league) => normalizeId(league._id)),
    [universityLeagues],
  );

  const universityMemberCount = useMemo(
    () =>
      memberships.filter((membership) =>
        universityLeagueIds.includes(normalizeId(membership.academicLeague)),
      ).length,
    [memberships, universityLeagueIds],
  );

  useEffect(() => {
    if (!filteredUniversities.length) {
      setSelectedUniversityId('');
      return;
    }

    const hasSelectedUniversity = filteredUniversities.some((university) =>
      isSameId(university._id, selectedUniversityId),
    );

    if (!hasSelectedUniversity) {
      setSelectedUniversityId(normalizeId(filteredUniversities[0]._id));
    }
  }, [filteredUniversities, selectedUniversityId]);

  useEffect(() => {
    setIsDeleteConfirmOpen(false);
  }, [selectedUniversityId]);

  useEffect(() => {
    if (!selectedUniversity) {
      setFormState(initialFormState);
      return;
    }

    setFormState({
      name: selectedUniversity.name || '',
      street: selectedUniversity.street || '',
      number: String(selectedUniversity.number || ''),
      complement: selectedUniversity.complement || '',
    });
  }, [selectedUniversity]);

  const handleTextChange = (field) => (event) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: event.target.value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const normalizedName = formState.name.trim();
    const normalizedStreet = formState.street.trim();
    const normalizedNumber = Number(formState.number);
    const normalizedComplement = formState.complement.trim();

    if (
      !normalizedName ||
      !normalizedStreet ||
      Number.isNaN(normalizedNumber)
    ) {
      notifyWarning('Preencha nome, rua e número da universidade');
      return;
    }

    const payload = {
      name: normalizedName,
      street: normalizedStreet,
      number: normalizedNumber,
      complement: normalizedComplement,
    };

    try {
      if (selectedUniversity?._id) {
        await updateUniversity({
          _id: selectedUniversity._id,
          inputData: payload,
        });
        notifySuccess('Universidade atualizada com sucesso');
      } else {
        await createUniversity(payload);
        notifySuccess('Universidade criada com sucesso');
      }

      await Promise.all([
        refetchUniversities(),
        refetchLeagues(),
        refetchMemberships(),
      ]);
      setSelectedUniversityId('');
      setFormState(initialFormState);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(err, 'Nao foi possivel salvar a universidade'),
      );
    }
  };

  const handleRequestDelete = () => {
    if (!selectedUniversity?._id) {
      notifyWarning('Selecione uma universidade para remover');
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUniversity?._id) return;

    try {
      await deleteUniversity(selectedUniversity._id);
      notifySuccess('Universidade removida com sucesso');
      await Promise.all([
        refetchUniversities(),
        refetchLeagues(),
        refetchMemberships(),
      ]);
      setSelectedUniversityId('');
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      notifyError(
        buildRequestErrorMessage(
          err,
          'Nao foi possivel remover a universidade',
        ),
      );
    }
  };

  const isSaving = isCreating || isUpdating || isDeleting;

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>ADMINISTRAÇÃO DE UNIVERSIDADES</HeaderTitle>
          <HeaderSubtitle>
            Cadastre, edite e remova universidades mantendo as ligas e os
            vínculos organizados no mesmo padrão visual do sistema.
          </HeaderSubtitle>
        </div>

        <HeaderActions>
          <SearchBar>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="search"
              placeholder="Buscar universidade"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBar>
          <ActionButton type="button" onClick={() => refetchUniversities()}>
            <FiRefreshCw /> Atualizar
          </ActionButton>
        </HeaderActions>
      </HeaderSection>

      <PanelGrid>
        <ListCard>
          <SectionTitle>Universidades</SectionTitle>
          <EntityList>
            {!filteredUniversities.length && (
              <EmptyState>Nenhuma universidade encontrada.</EmptyState>
            )}

            {filteredUniversities.map((university) => {
              const relatedLeagues = leagues.filter((league) =>
                isSameId(league.university, university._id),
              );
              const relatedLeagueIds = relatedLeagues.map((league) =>
                normalizeId(league._id),
              );
              const relatedMembers = memberships.filter((membership) =>
                relatedLeagueIds.includes(
                  normalizeId(membership.academicLeague),
                ),
              );

              return (
                <EntityItem
                  key={university._id}
                  type="button"
                  $active={isSameId(university._id, selectedUniversityId)}
                  onClick={() =>
                    setSelectedUniversityId(normalizeId(university._id))
                  }
                >
                  <EntityTitle>
                    <strong>{university.name}</strong>
                    <EntityBadge>{relatedLeagues.length} ligas</EntityBadge>
                  </EntityTitle>
                  <EntityMeta>
                    <span>
                      {university.street}, {university.number}
                      {university.complement
                        ? ` - ${university.complement}`
                        : ''}
                    </span>
                    <span>{relatedMembers.length} usuários vinculados</span>
                  </EntityMeta>
                </EntityItem>
              );
            })}
          </EntityList>
        </ListCard>

        <FormCard onSubmit={handleSave}>
          <SectionTitle>
            {selectedUniversity?._id
              ? 'Editar universidade'
              : 'Nova universidade'}
          </SectionTitle>

          <FormGrid>
            <Field $fullWidth>
              <Label>
                <LuBuilding /> Nome
              </Label>
              <TextInput
                value={formState.name}
                onChange={handleTextChange('name')}
                placeholder="Nome da universidade"
              />
            </Field>

            <Field $fullWidth>
              <Label>Rua</Label>
              <TextInput
                value={formState.street}
                onChange={handleTextChange('street')}
                placeholder="Rua, avenida ou campus"
              />
            </Field>

            <Field>
              <Label>Número</Label>
              <TextInput
                type="number"
                value={formState.number}
                onChange={handleTextChange('number')}
                placeholder="Número"
              />
            </Field>

            <Field>
              <Label>Complemento</Label>
              <TextInput
                value={formState.complement}
                onChange={handleTextChange('complement')}
                placeholder="Bloco, sala, campus..."
              />
            </Field>

            <Field $fullWidth>
              <HelperText>
                {selectedUniversity?._id
                  ? `${universityLeagues.length} ligas e ${universityMemberCount} usuários vinculados a esta universidade.`
                  : 'Salve a universidade para começar a vincular ligas e usuários.'}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton
              type="button"
              $variant="warning"
              onClick={handleRequestDelete}
              disabled={!selectedUniversity?._id || isSaving}
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
        title="Remover universidade"
        description="Essa ação remove a universidade selecionada. Verifique se não há dependências importantes antes de confirmar."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        isLoading={isSaving}
      />
    </Content>
  );
}
