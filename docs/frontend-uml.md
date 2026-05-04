# UML do Frontend

Documento de referência da estrutura do frontend, com foco em rotas, layouts, estado global e fluxo de dados até a API.

## Escopo de modelagem

- A modelagem abaixo cobre navegação, guardas de rota, layouts, páginas e a camada de acesso a dados.
- O frontend é orientado a páginas, com módulos de dados encapsulados em hooks do React Query.
- O estado de autenticação é centralizado em Zustand e alimenta tanto a navegação quanto a camada HTTP.

## Estrutura de rotas e layouts

```mermaid
flowchart TB
  Router[RouterProvider / routes.jsx]
  AppLayout[AppLayout]
  PrivateRoutes[PrivateRoutes\nautenticação obrigatória]
  AdminPrivateRoutes[AdminPrivateRoutes\nrole admin]
  ManagerPrivateRoutes[ManagerPrivateRoutes\nrole manager ou membership de gestão]

  Home[Home]
  Login[Login]
  Forgot[ForgotPassword]
  Reset[RedefinePassword]
  Confirm[EmailConfirmation]
  ChangePwd[ChangePassword]

  AdminLayout[AdminSideBarLayout]
  StudentLayout[StudentSideBarLayout]
  ManagerLayout[ManagerSideBarLayout]

  AdminDashboard[AdminDashboard]
  AdminUniversities[AdminUniversities]
  AdminLeagues[AdminAcademicLeagues]
  AdminCertificates[CertificateCreationPage]
  AdminEvents[AdminEvents]
  AdminSquads[AdminSquads]
  AdminUsers[AdminUsers]
  PermissionsAdmin[PermissionsAdmin]
  AdminTasks[ManagerTasks]
  AdminProfile[Profile]

  StudentDashboard[StudentDashboard]
  StudentEvents[StudentEvents]
  StudentCertificates[StudentCertificates]
  StudentTeam[StudentTeam]
  StudentTasks[StudentTasks]
  StudentProfile[Profile]

  ManagerDashboard[ManagerDashboard]
  ManagerCertificates[CertificateCreationPage]
  ManagerEventsList[ManagerEventsList]
  ManagerEvents[ManagerEvents]
  ManagerMembers[ManagerMembers]
  ManagerSquads[ManagerSquads]
  ManagerRegister[Register]
  ManagerTasks[ManagerTasks]
  ManagerProfile[Profile]

  Router --> AppLayout
  AppLayout --> Home
  AppLayout --> Login
  AppLayout --> Forgot
  AppLayout --> Reset
  AppLayout --> Confirm
  AppLayout --> PrivateRoutes

  PrivateRoutes --> ChangePwd
  PrivateRoutes --> AdminPrivateRoutes
  PrivateRoutes --> StudentLayout
  PrivateRoutes --> ManagerPrivateRoutes

  AdminPrivateRoutes --> AdminLayout
  AdminLayout --> AdminDashboard
  AdminLayout --> AdminUniversities
  AdminLayout --> AdminLeagues
  AdminLayout --> AdminCertificates
  AdminLayout --> AdminEvents
  AdminLayout --> AdminSquads
  AdminLayout --> AdminUsers
  AdminLayout --> PermissionsAdmin
  AdminLayout --> AdminTasks
  AdminLayout --> AdminProfile

  StudentLayout --> StudentDashboard
  StudentLayout --> StudentEvents
  StudentLayout --> StudentCertificates
  StudentLayout --> StudentTeam
  StudentLayout --> StudentTasks
  StudentLayout --> StudentProfile

  ManagerPrivateRoutes --> ManagerLayout
  ManagerLayout --> ManagerDashboard
  ManagerLayout --> ManagerCertificates
  ManagerLayout --> ManagerEventsList
  ManagerLayout --> ManagerEvents
  ManagerLayout --> ManagerMembers
  ManagerLayout --> ManagerSquads
  ManagerLayout --> ManagerRegister
  ManagerLayout --> ManagerTasks
  ManagerLayout --> ManagerProfile

  PrivateRoutes ..> AuthStore[zustand auth store]
  AdminPrivateRoutes ..> AuthStore
  ManagerPrivateRoutes ..> AuthStore
  ManagerPrivateRoutes ..> useGetLeagueMemberships[React Query hook]
```

## Fluxo de dados e dependências

```mermaid
flowchart LR
  Pages[Páginas / componentes de tela]
  QueryHooks[hooks/query/*]
  ApiEndpoints[services/api/endpoints.js]
  AxiosApi[services/api/instance.js]
  Backend[Backend /sgla-api]
  AuthStore[stores/auth.js]

  Pages --> QueryHooks
  QueryHooks --> ApiEndpoints
  ApiEndpoints --> AxiosApi
  AxiosApi --> Backend
  AxiosApi ..> AuthStore
  QueryHooks ..> AuthStore
```

Relações de suporte:

- `AxiosApi` injeta o token Bearer vindo de `AuthStore`.
- `QueryHooks` consome `AuthStore` para login, refresh e logout.

## Camadas relevantes

- `src/routes.jsx` define a árvore principal de navegação e os guardas de acesso.
- `src/layouts/` concentra os wrappers visuais por perfil de usuário.
- `src/pages/` contém as telas de negócio por domínio.
- `src/hooks/query/` encapsula o acesso assíncrono ao backend com React Query.
- `src/services/api/` concentra o contrato HTTP e a instância Axios compartilhada.
- `src/stores/auth.js` é a fonte do estado de autenticação e da informação decodificada do JWT.

## Regras de navegação e estado

- `PrivateRoutes` bloqueia páginas autenticadas quando não existe `auth` na store.
- `AdminPrivateRoutes` exige papel administrativo no usuário autenticado.
- `ManagerPrivateRoutes` aceita papel de manager global ou vínculo de gestão em `league-memberships` ativos.
- `useRefreshToken` usa o `expireIn` armazenado na sessão para manter a autenticação viva.
- `api.interceptors.request` adiciona `Authorization: Bearer <token>` automaticamente quando há sessão válida.
