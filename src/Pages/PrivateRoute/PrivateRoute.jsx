import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../Firebase'; // Importer Firebase auth

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser; // Vérifier si un utilisateur est connecté

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
