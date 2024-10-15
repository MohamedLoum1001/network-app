// src/Components/PostForm/PostForm.js
import React, { useState } from "react";
import { db, auth } from "../../Firebase"; // Importez également auth
import { collection, addDoc } from 'firebase/firestore'; 

const PostForm = ({ onAddPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "" || content.trim() === "") {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newPost = {
      title,
      content,
      createdAt: new Date().toISOString(),
      authorId: auth.currentUser.uid, // Ajout de l'ID de l'auteur ici
    };

    try {
      const postRef = await addDoc(collection(db, "Posts"), newPost);
      onAddPost({ id: postRef.id, ...newPost });
      setTitle("");
      setContent("");
      alert("Post ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Titre</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">Contenu</label>
        <textarea
          className="form-control"
          id="content"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Publier</button>
    </form>
  );
};

export default PostForm;
