import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const authLinks = (
    <ul className="navbar-nav ms-auto">
      {user && user.role === 'admin' && (
        <li className="nav-item">
          <Link className="nav-link" to="/admin">Admin</Link>
        </li>
      )}
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          WhatsApp
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li><Link className="dropdown-item" to="/whatsapp/connect">Conectar</Link></li>
          <li><Link className="dropdown-item" to="/whatsapp/extract">Extrair Contatos</Link></li>
          <li><Link className="dropdown-item" to="/whatsapp/schedule">Agendar Mensagens</Link></li>
        </ul>
      </li>
      <li className="nav-item">
        <a onClick={logout} className="nav-link" href="#!">
          <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Sair</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/register">Registrar</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">Sistema WhatsApp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

