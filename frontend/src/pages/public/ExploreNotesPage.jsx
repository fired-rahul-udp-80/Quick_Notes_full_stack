import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Public ExploreNotesPage redirects to the primary /explore catalog
 * which is managed by exploreSlice and StudentLayout.
 */
export const ExploreNotesPage = () => {
  return <Navigate to="/explore" replace />;
};

export default ExploreNotesPage;
