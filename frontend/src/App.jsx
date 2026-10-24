import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { authApi } from './services/authApi';
import { setCredentials, logout } from './store/slices/authSlice';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data?.user && isMounted) {
          dispatch(setCredentials(res.data.user));
          return;
        }
      } catch (err) {
        // Access token might be expired. Attempt to call refresh token API!
        try {
          const refreshRes = await authApi.refreshToken();
          if (refreshRes && refreshRes.success && isMounted) {
            const retryRes = await authApi.getMe();
            if (retryRes && retryRes.success && retryRes.data?.user && isMounted) {
              dispatch(setCredentials(retryRes.data.user));
              return;
            }
          }
        } catch (refreshErr) {
          console.error('Session refresh failed:', refreshErr);
        }
      }

      if (isMounted) {
        dispatch(logout());
      }
    };

    restoreSession();

    // Proactively refresh access token every 12 minutes (access token expires in 15m)
    // Keeps the session alive so user never gets logged out on dashboard
    const refreshInterval = setInterval(async () => {
      try {
        await authApi.refreshToken();
      } catch (e) {
        // Silent background refresh
      }
    }, 12 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
