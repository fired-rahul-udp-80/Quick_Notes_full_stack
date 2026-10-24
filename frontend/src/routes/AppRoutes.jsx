import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routesConfig } from './routesConfig';
import { PrivateRoute, PublicRoute } from './RouteGuards';

/**
 * AppRoutes dynamically renders routes from the routesConfig object array,
 * wrapping them in either PrivateRoute or PublicRoute guards.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {routesConfig.map((route, index) => {
        const { path, element, isPrivate, allowedRoles, restrictedForAuth } = route;

        const renderedElement = isPrivate ? (
          <PrivateRoute allowedRoles={allowedRoles}>{element}</PrivateRoute>
        ) : (
          <PublicRoute restrictedForAuth={restrictedForAuth}>{element}</PublicRoute>
        );

        return <Route key={path || index} path={path} element={renderedElement} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
