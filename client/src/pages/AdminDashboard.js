import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, email, password, role } = formData;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await axios.post('/api/users', formData);
      setSuccess('Usuário criado com sucesso');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user'
      });
      
      // Atualizar lista de usuários
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      setError('Erro ao criar usuário');
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        setUsers(users.filter(user => user._id !== id));
        setSuccess('Usuário excluído com sucesso');
      } catch (err) {
        setError('Erro ao excluir usuário');
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Painel Administrativo</h1>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Usuários</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Função</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button 
                            onClick={() => deleteUser(user._id)} 
                            className="btn btn-danger btn-sm"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Adicionar Usuário</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
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
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Função</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={role}
                    onChange={onChange}
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Adicionar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
