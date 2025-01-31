import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../Firebase";
import { doc, updateDoc } from "firebase/firestore";

const EditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Vérifier si 'post' existe dans 'location.state'
  const post = location.state?.post; 

  // Redirection si 'post' n'est pas disponible
  useEffect(() => {
    if (!post) {
      alert("Aucun post sélectionné pour la modification.");
      navigate("/"); // Redirige vers la page d'accueil ou une autre page
    }
  }, [post, navigate]);

  // Utiliser les valeurs par défaut si 'post' est null
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (!post) return; // Sécurité supplémentaire si 'post' est nul

    const postRef = doc(db, "Posts", post.id);

    try {
      await updateDoc(postRef, {
        title,
        content,
      });
      alert("Post modifié avec succès !");
      navigate("/"); // Rediriger après la modification
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post :", error);
    }
  };

  // Affichage conditionnel pour éviter le rendu avant la récupération des données
  if (!post) {
    return null; // Ou un message de chargement/spinner peut être ajouté
  }

  return (
    <div className="container">
      <h1>Modifier le post</h1>
      <form onSubmit={handleUpdatePost}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Titre</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Contenu</label>
          <textarea
            className="form-control"
            id="content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Modifier</button> {/* Changement de texte */}
      </form>
    </div>
  );
};

export default EditPost;
