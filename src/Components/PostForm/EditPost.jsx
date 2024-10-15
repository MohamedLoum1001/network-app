import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../Firebase";
import { doc, updateDoc } from "firebase/firestore";

const EditPost = () => {
  const location = useLocation();
  const { post } = location.state; // Récupère le post passé en tant que state
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (!post) {
      navigate("/"); // Redirige si aucun post n'est passé
    }
  }, [post, navigate]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    
    const postRef = doc(db, "Posts", post.id);

    try {
      await updateDoc(postRef, {
        title,
        content,
      });
      alert("Post modifié avec succès !");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post :", error);
    }
  };

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
