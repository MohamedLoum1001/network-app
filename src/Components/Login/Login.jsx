import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import de la méthode pour se connecter
import { auth } from '../../Firebase'; // Import de l'objet `auth` de Firebase (à configurer dans Firebase.js)
// import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Pour afficher un message d'erreur en cas d'échec
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Réinitialiser le message d'erreur

    try {
      // 1. Connexion à Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Si la connexion réussit, rediriger vers la page d'accueil ou le dashboard
      console.log('Connexion réussie:', { uid: user.uid, email: user.email });
      navigate('/'); // Rediriger vers le dashboard ou une autre page après connexion réussie
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);

      // Gestion des erreurs Firebase
      if (error.code === 'auth/wrong-password') {
        setErrorMessage('Mot de passe incorrect.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Utilisateur non trouvé.');
      } else {
        setErrorMessage('Erreur lors de la connexion : ' + error.message);
      }
    }
  };

  return (
    <div className="container p-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Connexion</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Message d'erreur en cas d'échec */}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Se connecter
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/signup')}>
                S'inscrire
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
