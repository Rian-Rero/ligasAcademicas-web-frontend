import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { Outlet, useLocation } from 'react-router-dom';

import { Container } from './Styles';
import { AddToast, Header } from '../../components/common';
import { SystemLoading } from '../../components/features';
import { useRefreshToken } from '../../hooks/query/sessions';

export default function AppLayout() {
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const { isLoadng } = useRefreshToken();
  const { pathname } = useLocation();
  const timeToShowLoading = 500; // milliseconds

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll page to top when it is opened
  }, [pathname]);

  useEffect(() => {
    const loadingTimer = setTimeout(
      () => setIsLoadingScreen(false),
      timeToShowLoading,
    );

    return () => clearTimeout(loadingTimer);
  }, []);

  return isLoadng || isLoadingScreen ? (
    <SystemLoading />
  ) : (
    <Container>
      <Header />
      <Outlet />
      <AddToast />
    </Container>
  );
}
