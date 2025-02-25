import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user && user.name}</p>
      
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Conectar WhatsApp</h5>
              <p className="card-text">Conecte sua conta do WhatsApp para começar a usar o sistema.</p>
              <Link to="/whatsapp/connect" className="btn btn-primary">Conectar</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Extrair Contatos</h5>
              <p className="card-text">Extraia contatos de grupos do WhatsApp.</p>
              <Link to="/whatsapp/extract" className="btn btn-primary">Extrair</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Agendar Mensagens</h5>
              <p className="card-text">Agende mensagens para serem enviadas para grupos.</p>
              <Link to="/whatsapp/schedule" className="btn btn-primary">Agendar</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
