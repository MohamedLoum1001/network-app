import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../Firebase'; // Importation de Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importation de la méthode d'authentification
import { doc, setDoc } from 'firebase/firestore'; // Importation des méthodes Firestore

const SignUp = () => {
  const [firstName, setFirstName] = useState(''); // Prénom
  const [lastName, setLastName] = useState(''); // Nom de famille
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Mot de passe
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmation du mot de passe
  const [errorMessage, setErrorMessage] = useState(''); // Message d'erreur
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      // 1. Créer un nouvel utilisateur dans Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Ajouter l'utilisateur à Firestore avec des champs supplémentaires (sans stocker le mot de passe en clair)
      await setDoc(doc(db, 'Users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        uid: user.uid,
        passwordsMatch: true, // Optionnel : stocker si les mots de passe correspondent
        // NE JAMAIS stocker les mots de passe comme ceci : password: password, confirmPassword: confirmPassword
        // Mais vous pouvez stocker d'autres informations comme les métadonnées de création de compte
      });

      // 3. Alerte de succès et redirection
      alert('Inscription réussie avec succès !');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);

      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Cette adresse e-mail est déjà utilisée. Veuillez vous connecter.');
      } else {
        setErrorMessage('Erreur lors de l\'inscription : ' + error.message);
      }
    }
  };

  return (
    <div className="container p-2">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Inscription</h2>
          <form onSubmit={handleSignup}>
            {/* Prénom */}
            <div className="form-group mb-3">
              <label className='form-label'>Prénom</label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* Nom */}
            <div className="form-group mb-3">
              <label className='form-label'>Nom</label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group mb-3">
              <label className='form-label'>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Mot de passe */}
            <div className="form-group mb-3">
              <label className='form-label'>Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirmer le mot de passe */}
            <div className="form-group mb-3">
              <label className='form-label'>Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Message d'erreur */}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            {/* Boutons d'inscription et de connexion */}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">S'inscrire</button>
              <Link to="/login" className="btn btn-secondary">Se connecter</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
