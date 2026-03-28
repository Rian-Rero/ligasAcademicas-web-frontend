import { StrictMode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';

import Routes from './routes';
import GlobalStyles from './styles/GlobalStyles';
import Theme from './styles/Theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: import.meta.env.VITE_STALE_TIME || 300000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Theme>
        <GlobalStyles />
        <Routes />
      </Theme>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
);
