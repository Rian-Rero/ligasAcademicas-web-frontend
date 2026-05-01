import { useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import {
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
  HiOutlineAcademicCap,
} from 'react-icons/hi2';
import { PiUserList } from 'react-icons/pi';
import { TbUsersGroup } from 'react-icons/tb';

import {
  ActionButton,
  Content,
  HeaderSection,
  HeaderTitle,
  SearchBar,
  SearchIcon,
  SearchInput,
  SectionHeading,
  SummaryCard,
  TeamAvatar,
  TeamList,
  TeamMember,
  ViewMemberProfileButton,
  MemberModalOverlay,
  MemberModalCard,
  MemberModalHeader,
  MemberModalTitle,
  MemberModalSubtitle,
  MemberModalBody,
  MemberModalItem,
  MemberModalLabel,
  MemberModalValue,
  MemberModalCloseButton,
  MemberModalAvatar,
} from './Styles';
import { useGetAcademicLeagues } from '../../../hooks/query/academicLeague';
import { useGetLeagueMemberships } from '../../../hooks/query/leagueMembership';
import { useGetSquads } from '../../../hooks/query/squad';
import { useGetUniversities } from '../../../hooks/query/university';
import { useGetUsersByIds } from '../../../hooks/query/user';
import useAuthStore from '../../../stores/auth';
import { resolveMediaUrl } from '../../../utils/media';
import { notifyError, notifySuccess } from '../../../utils/toast';

const fallbackTeam = [];

function formatRole(role) {
  if (!role) return 'Membro';

  return String(role)
    .replace(/[-_]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => {
      const firstChar = word[0]?.toLocaleUpperCase('pt-BR');
      return firstChar ? firstChar + word.slice(1) : '';
    })
    .join(' ');
}

function getInitials(name) {
  if (!name) return 'AL';

  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase('pt-BR') || '')
    .join('');
}

export default function StudentTeam() {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.auth?.user);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: memberships = [] } = useGetLeagueMemberships({
    filters: { user: authUser?._id, isActive: true },
    enabled: Boolean(authUser?._id),
  });

  const activeMembership = memberships[0];

  const { data: leagues = [] } = useGetAcademicLeagues({
    filters: { _id: activeMembership?.academicLeague },
    enabled: Boolean(activeMembership?.academicLeague),
  });

  const activeLeague = leagues[0];

  const { data: squads = [] } = useGetSquads({
    filters: { _id: activeMembership?.squad },
    enabled: Boolean(activeMembership?.squad),
  });

  const activeSquad = squads[0];

  const { data: universities = [] } = useGetUniversities({
    filters: { _id: activeLeague?.university },
    enabled: Boolean(activeLeague?.university),
  });

  const activeUniversity = universities[0];

  const { data: squadMemberships = [], isLoading: isLoadingMemberships } =
    useGetLeagueMemberships({
      filters: { squad: activeMembership?.squad, isActive: true },
      enabled: Boolean(activeMembership?.squad),
    });

  const squadMemberUserIds = useMemo(
    () => [
      ...new Set(
        squadMemberships
          .map((membership) => membership?.user)
          .filter(Boolean)
          .map((userId) => String(userId)),
      ),
    ],
    [squadMemberships],
  );

  const { data: squadUsers = [], isLoading: isLoadingUsers } = useGetUsersByIds(
    {
      userIds: squadMemberUserIds,
      enabled: squadMemberUserIds.length > 0,
    },
  );

  const team = useMemo(() => {
    if (!squadMemberUserIds.length || !squadUsers.length) {
      return authUser?.name
        ? [
            {
              id: String(authUser._id || 'auth-user'),
              name: authUser.name,
              imageURL: authUser?.imageURL || null,
            },
          ]
        : fallbackTeam;
    }

    const userIds = new Set(squadMemberUserIds);

    const names = squadUsers
      .filter((user) => userIds.has(String(user._id)))
      .filter((user) => Boolean(user.name))
      .map((user) => ({
        id: String(user._id),
        name: user.name,
        imageURL: user?.imageURL || null,
      }));

    if (!names.length) {
      return authUser?.name
        ? [
            {
              id: String(authUser._id || 'auth-user'),
              name: authUser.name,
              imageURL: authUser?.imageURL || null,
            },
          ]
        : fallbackTeam;
    }

    return names;
  }, [
    authUser?._id,
    authUser?.name,
    authUser?.imageURL,
    squadMemberUserIds,
    squadUsers,
  ]).sort((left, right) =>
    String(left.name || '').localeCompare(String(right.name || ''), 'pt-BR'),
  );

  const teamMembersData = useMemo(() => {
    return team.map((member) => {
      const user =
        squadUsers.find((u) => String(u._id) === member.id) ||
        (String(authUser?._id) === member.id ? authUser : null);
      const membership = squadMemberships.find(
        (m) => String(m.user) === member.id,
      );

      return {
        member,
        user,
        membership,
      };
    });
  }, [authUser, squadMemberships, squadUsers, team]);

  const filteredTeam = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLocaleLowerCase('pt-BR');
    if (!normalizedQuery) return team;

    return team.filter((member) => {
      const memberData = teamMembersData.find(
        (data) => data.member.id === member.id,
      );
      if (!memberData) return false;

      const name = String(memberData.member.name || '').toLocaleLowerCase(
        'pt-BR',
      );
      const email = String(memberData.user?.email || '').toLocaleLowerCase(
        'pt-BR',
      );
      const role = String(memberData.membership?.role || '').toLocaleLowerCase(
        'pt-BR',
      );

      return (
        name.includes(normalizedQuery) ||
        email.includes(normalizedQuery) ||
        role.includes(normalizedQuery)
      );
    });
  }, [team, teamMembersData, searchTerm]);

  const totalMembersCount = filteredTeam.length;
  const memberLabel = totalMembersCount === 1 ? 'membro' : 'membros';

  const isLoading = isLoadingMemberships || isLoadingUsers;

  const handleRefresh = async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries(['league-memberships']),
        queryClient.invalidateQueries(['users']),
      ]);
      notifySuccess('Lista de membros atualizada');
    } catch (err) {
      notifyError('Não foi possível atualizar a lista de membros');
    }
  };

  const selectedMember = useMemo(() => {
    if (!selectedMemberId) return null;

    const normalizedId = String(selectedMemberId);
    const user =
      squadUsers.find((item) => String(item._id) === normalizedId) ||
      (String(authUser?._id) === normalizedId ? authUser : null);

    if (!user) return null;

    const membership = squadMemberships.find(
      (item) => String(item.user) === normalizedId,
    );

    return { user, membership };
  }, [authUser, selectedMemberId, squadMemberships, squadUsers]);

  return (
    <Content>
      <HeaderSection>
        <div>
          <HeaderTitle> MINHA SUBEQUIPE</HeaderTitle>
        </div>

        <ActionButton
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
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
        />
      </SearchBar>

      <SummaryCard>
        <SectionHeading>
          <strong>{activeSquad?.name || 'Nome da Subequipe'}</strong>
          <div>
            <span className="members-subtitle">
              {activeUniversity?.name || activeLeague?.name || 'Nome'}
            </span>
            <span className="members-subtitle">
              {totalMembersCount} {memberLabel}
            </span>
          </div>
        </SectionHeading>
        <TeamList>
          {filteredTeam.map((member) => (
            <TeamMember key={member.id}>
              <TeamAvatar
                $imageUrl={resolveMediaUrl(member?.imageURL)}
                role="img"
                aria-label={`Foto de ${member.name}`}
              />
              {member.name}
              <ViewMemberProfileButton
                type="button"
                onClick={() => setSelectedMemberId(member.id)}
              >
                Ver detalhes
              </ViewMemberProfileButton>
            </TeamMember>
          ))}
        </TeamList>
      </SummaryCard>

      {selectedMember ? (
        <MemberModalOverlay
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedMemberId('');
            }
          }}
        >
          <MemberModalCard onClick={(e) => e.stopPropagation()}>
            <MemberModalHeader>
              <div>
                <MemberModalTitle>Perfil do Membro</MemberModalTitle>
                <MemberModalSubtitle>Informações Gerais</MemberModalSubtitle>
              </div>
              <MemberModalCloseButton
                type="button"
                onClick={() => setSelectedMemberId('')}
              >
                Fechar
              </MemberModalCloseButton>
            </MemberModalHeader>

            <MemberModalBody>
              <MemberModalAvatar
                $imageUrl={resolveMediaUrl(selectedMember.user?.imageURL)}
                role="img"
                aria-label={
                  selectedMember.user?.name
                    ? `Foto de ${selectedMember.user.name}`
                    : 'Foto do membro'
                }
              >
                {!resolveMediaUrl(selectedMember.user?.imageURL) &&
                  getInitials(selectedMember.user?.name)}
              </MemberModalAvatar>

              <div>
                <MemberModalItem>
                  <MemberModalLabel>
                    <HiOutlineUserCircle /> Nome
                  </MemberModalLabel>
                  <MemberModalValue>
                    {selectedMember.user?.name || 'Não informado'}
                  </MemberModalValue>
                </MemberModalItem>
                <MemberModalItem>
                  <MemberModalLabel>
                    <HiOutlineMail /> E-mail
                  </MemberModalLabel>
                  <MemberModalValue>
                    {selectedMember.user?.email || 'Não informado'}
                  </MemberModalValue>
                </MemberModalItem>
                <MemberModalItem>
                  <MemberModalLabel>
                    <PiUserList /> Função
                  </MemberModalLabel>
                  <MemberModalValue>
                    {formatRole(selectedMember.membership?.role)}
                  </MemberModalValue>
                </MemberModalItem>
                <MemberModalItem>
                  <MemberModalLabel>
                    <HiOutlineCheckCircle /> Status
                  </MemberModalLabel>
                  <MemberModalValue>
                    {selectedMember.membership?.isActive
                      ? 'Membro Ativo'
                      : 'Membro Inativo'}
                  </MemberModalValue>
                </MemberModalItem>
                <MemberModalItem>
                  <MemberModalLabel>
                    <TbUsersGroup /> Subequipe
                  </MemberModalLabel>
                  <MemberModalValue>
                    {activeSquad?.name || 'Não informada'}
                  </MemberModalValue>
                </MemberModalItem>
                <MemberModalItem>
                  <MemberModalLabel>
                    <HiOutlineAcademicCap /> Liga
                  </MemberModalLabel>
                  <MemberModalValue>
                    {activeLeague?.name || 'Não informada'}
                  </MemberModalValue>
                </MemberModalItem>
              </div>
            </MemberModalBody>
          </MemberModalCard>
        </MemberModalOverlay>
      ) : null}
    </Content>
  );
}
