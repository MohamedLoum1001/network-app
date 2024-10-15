// src/App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Components/SignUp/SignUp';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashbord';
import PostForm from './Components/PostForm/PostForm'; // Assurez-vous que cela est correct
import PrivateRoute from './Pages/PrivateRoute/PrivateRoute'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/add-post" element={<PostForm onAddPost={(post) => console.log(post)} />} /> {/* Passer la fonction pour ajouter le post */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
