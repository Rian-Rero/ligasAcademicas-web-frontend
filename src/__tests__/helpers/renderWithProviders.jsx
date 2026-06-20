import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Theme from '../../styles/Theme';

export function AllProviders({ children, initialPath = '/' }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Theme>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Theme>
    </MemoryRouter>
  );
}

export function renderWithProviders(
  ui,
  { initialPath = '/', ...renderOptions } = {},
) {
  function Wrapper({ children }) {
    return <AllProviders initialPath={initialPath}>{children}</AllProviders>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
