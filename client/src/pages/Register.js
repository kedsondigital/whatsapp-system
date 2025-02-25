import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const { register, isAuthenticated } = useContext(AuthContext);

  const { name, email, password, password2 } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (password !== password2) {
      setError('As senhas não coincidem');
      return;
    }
    
    const success = await register(name, email, password);
    if (!success) {
      setError('Erro ao registrar. Tente novamente.');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="row mt-5">
      <div className="col-md-6 mx-auto">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4>Registrar</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password2" className="form-label">Confirmar Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" className="btn btn-primary">Registrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
