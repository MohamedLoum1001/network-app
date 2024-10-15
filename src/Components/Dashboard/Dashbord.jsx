import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase"; 
import { collection, onSnapshot, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore'; 

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set()); // Pour suivre les posts aimés
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert("Vous êtes déconnecté avec succès !");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  useEffect(() => {
    const unsubscribePosts = onSnapshot(collection(db, "Posts"), (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    const unsubscribeUsers = onSnapshot(collection(db, "Users"), (snapshot) => {
      const fetchedUsers = {};
      snapshot.docs.forEach(doc => {
        fetchedUsers[doc.id] = doc.data();
      });
      setUsers(fetchedUsers);
    });

    return () => {
      unsubscribePosts();
      unsubscribeUsers();
    };
  }, []);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      try {
        await deleteDoc(doc(db, "Posts", postId));
        alert("Post supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression du post :", error);
      }
    }
  };

  const handleEditPost = (post) => {
    // Redirige vers la page du formulaire avec les détails du post
    navigate("/edit-post", { state: { post } });  // Passe le post comme état
  };

  const handleLikePost = async (postId) => {
    if (likedPosts.has(postId)) {
      alert("Vous avez déjà aimé ce post !");
      return;
    }

    const postRef = doc(db, "Posts", postId);
    
    try {
      await updateDoc(postRef, {
        likes: increment(1), // Incrémente le nombre de likes
      });

      setLikedPosts((prev) => new Set(prev).add(postId));

      setPosts((prevPosts) =>
        prevPosts.map((post) => 
          post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
        )
      );

      alert("Vous avez aimé ce post !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du like :", error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand">Tableau de bord</span>
          <button className="btn btn-outline-primary" onClick={() => navigate("/add-post")}>
            Ajouter un post
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </nav>
      <div className="container p-5">
        <h1>Bienvenue sur le tableau de bord</h1>
        <p>Ceci est votre espace utilisateur.</p>

        <h2>Posts Ajoutés</h2>
        <div className="list-group">
          {posts.map((post) => {
            const author = users[post.authorId];
            return (
              <div key={post.id} className="list-group-item">
                <h5>{post.title}</h5>
                <p>{post.content}</p>
                <small>Publié le: {new Date(post.createdAt).toLocaleString()}</small>
                <small>Publié par: {author ? `${author.firstName} ${author.lastName}` : 'Anonyme'}</small>
                <div className="mt-2">
                  <button className="btn btn-warning me-2" onClick={() => handleEditPost(post)}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>Supprimer</button>
                  <button className="btn btn-light" onClick={() => handleLikePost(post.id)}>
                    ❤️ J'aime {post.likes || 0}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
