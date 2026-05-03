import { useEffect, useMemo, useRef, useState } from 'react';

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
import { LuBuilding } from 'react-icons/lu';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'styled-components';

import {
  adminUniversityDefaultValues,
  adminUniversitySchema,
  buildAdminUniversityErrorMessage,
} from './utils';
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
  TextInput,
} from '../Styles';

export default function AdminUniversities() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data: universities = [] } = useGetUniversities();
  const { data: leagues = [] } = useGetAcademicLeagues();
  const { data: memberships = [] } = useGetLeagueMemberships();

  const { mutateAsync: createUniversity, isPending: isCreating } =
    useCreateUniversity();
  const { mutateAsync: updateUniversity, isPending: isUpdating } =
    useUpdateUniversity();
  const { mutateAsync: deleteUniversity, isPending: isDeleting } =
    useDeleteUniversity();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminUniversitySchema),
    defaultValues: adminUniversityDefaultValues,
  });

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

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
    const hasSelectedUniversity = filteredUniversities.some((university) =>
      isSameId(university._id, selectedUniversityId),
    );

    if (!hasSelectedUniversity && selectedUniversityId) {
      setSelectedUniversityId('');
    }
  }, [filteredUniversities, selectedUniversityId]);

  useEffect(() => {
    setIsDeleteConfirmOpen(false);
  }, [selectedUniversityId]);

  useEffect(
    () => () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    },
    [imagePreviewUrl],
  );

  useEffect(() => {
    if (!selectedUniversity) {
      reset(adminUniversityDefaultValues);
      setSelectedImage(null);
      setImagePreviewUrl('');
      return;
    }

    reset({
      name: selectedUniversity.name || '',
      street: selectedUniversity.street || '',
      number: String(selectedUniversity.number || ''),
      complement: selectedUniversity.complement || '',
    });

    setSelectedImage(null);
    setImagePreviewUrl(selectedUniversity.logo?.url || '');
  }, [reset, selectedUniversity]);

  const handleCreateNew = () => {
    setSelectedUniversityId('');
    reset(adminUniversityDefaultValues);
  };

  const handleSelectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValidMimeType = ['image/jpeg', 'image/png', 'image/webp'].includes(
      file.type,
    );

    if (!isValidMimeType) {
      notifyWarning('Formato inválido. Use JPG, PNG ou WEBP.');
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
      return;
    }

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      notifyWarning('A imagem deve ter no máximo 5MB.');
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
      return;
    }

    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    const localUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setImagePreviewUrl(localUrl);

    // allow reselecting same file
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  };

  const handleRemoveSelectedImage = () => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImage(null);
    setImagePreviewUrl('');
  };

  const onSubmit = handleSubmit(async (values) => {
    const basePayload = {
      name: values.name.trim(),
      street: values.street.trim(),
      number: Number(values.number),
      complement: values.complement?.trim() || '',
    };

    try {
      // If an image file was selected, send multipart/form-data
      if (selectedImage) {
        const formData = new FormData();
        Object.keys(basePayload).forEach((key) => {
          formData.append(key, basePayload[key]);
        });
        // backend expects 'logo' for university image
        formData.append('logo', selectedImage);

        if (selectedUniversity?._id) {
          await updateUniversity({
            _id: selectedUniversity._id,
            inputData: formData,
          });
          notifySuccess('Universidade atualizada com sucesso');
        } else {
          await createUniversity(formData);
          notifySuccess('Universidade criada com sucesso');
        }
      } else if (selectedUniversity?._id) {
        await updateUniversity({
          _id: selectedUniversity._id,
          inputData: basePayload,
        });
        notifySuccess('Universidade atualizada com sucesso');
      } else {
        await createUniversity(basePayload);
        notifySuccess('Universidade criada com sucesso');
      }

      await Promise.all([
        queryClient.invalidateQueries(['universities']),
        queryClient.invalidateQueries(['academic-leagues']),
        queryClient.invalidateQueries(['league-memberships']),
      ]);

      handleCreateNew();
    } catch (err) {
      notifyError(buildAdminUniversityErrorMessage(err));
    }
  });

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
        queryClient.invalidateQueries(['universities']),
        queryClient.invalidateQueries(['academic-leagues']),
        queryClient.invalidateQueries(['league-memberships']),
      ]);
      handleCreateNew();
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      notifyError(buildAdminUniversityErrorMessage(err));
    }
  };

  const formErrorMessage =
    errors.name?.message || errors.street?.message || errors.number?.message;

  const isSaving = isCreating || isUpdating || isDeleting;

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle>ADMINISTRAÇÃO DE UNIVERSIDADES</HeaderTitle>
          <HeaderSubtitle>
            Cadastre, edite e remova universidades mantendo as ligas e os
            vínculos organizados no mesmo padrao visual do sistema.
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
          <ActionButton
            type="button"
            onClick={() =>
              Promise.all([
                queryClient.invalidateQueries(['universities']),
                queryClient.invalidateQueries(['academic-leagues']),
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

        <FormCard onSubmit={onSubmit}>
          <SectionTitle>
            {selectedUniversity?._id
              ? 'Editar universidade'
              : 'Criar nova universidade'}
          </SectionTitle>

          <FormGrid>
            <Field $fullWidth>
              <Label>
                <LuBuilding /> Nome
              </Label>
              <TextInput
                {...register('name')}
                placeholder="Nome da universidade"
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </Field>

            <Field $fullWidth>
              <Label>Rua</Label>
              <TextInput
                {...register('street')}
                placeholder="Rua, avenida ou campus"
              />
              {errors.street && (
                <ErrorMessage>{errors.street.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Numero</Label>
              <TextInput
                type="number"
                {...register('number')}
                placeholder="Numero"
              />
              {errors.number && (
                <ErrorMessage>{errors.number.message}</ErrorMessage>
              )}
            </Field>

            <Field>
              <Label>Complemento</Label>
              <TextInput
                {...register('complement')}
                placeholder="Bloco, sala, campus..."
              />
            </Field>

            <Field>
              <Label>Logo (opcional)</Label>
              <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleSelectImage}
                  style={{ display: 'inline-block' }}
                />
                {imagePreviewUrl ? (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={imagePreviewUrl}
                      alt="preview"
                      style={{
                        width: 56,
                        height: 56,
                        objectFit: 'cover',
                        borderRadius: 6,
                      }}
                    />
                    <ActionButton
                      type="button"
                      $variant="warning"
                      onClick={handleRemoveSelectedImage}
                    >
                      Remover
                    </ActionButton>
                  </div>
                ) : null}
              </div>
            </Field>

            <Field $fullWidth>
              <HelperText>
                {formErrorMessage ||
                  (selectedUniversity?._id
                    ? `${universityLeagues.length} ligas e ${universityMemberCount} usuários vinculados a esta universidade.`
                    : 'Preencha os campos para criar uma nova universidade.')}
              </HelperText>
            </Field>
          </FormGrid>

          <ActionRow>
            <ActionButton type="button" onClick={handleCreateNew}>
              <FiPlus /> Nova universidade
            </ActionButton>
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
