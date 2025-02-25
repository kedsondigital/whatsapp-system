import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WhatsAppConnect = () => {
  const [status, setStatus] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await axios.get('/api/whatsapp/status');
      setStatus(res.data.status);
      setQrCode(res.data.qr);
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setStatus('not_initialized');
      } else {
        setError('Erro ao verificar status');
        console.error(err);
      }
      setLoading(false);
    }
  };

  const initializeClient = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/whatsapp/init');
      setStatus(res.data.status);
      setQrCode(res.data.qr);
    } catch (err) {
      setError('Erro ao inicializar cliente');
      console.error(err);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    if (status === 'not_initialized') {
      return (
        <div className="text-center">
          <p>Cliente WhatsApp não inicializado.</p>
          <button onClick={initializeClient} className="btn btn-primary">Inicializar</button>
        </div>
      );
    }

    if (status === 'initializing') {
      return (
        <div className="text-center">
          <p>Inicializando cliente WhatsApp...</p>
          <div className="spinner-border" role="status"></div>
        </div>
      );
    }

    if (status === 'qr_ready' && qrCode) {
      return (
        <div className="text-center">
          <p>Escaneie o código QR com seu WhatsApp:</p>
          <img src={qrCode} alt="QR Code" className="img-fluid" />
        </div>
      );
    }

    if (status === 'authenticated') {
      return (
        <div className="text-center">
          <p>Autenticado! Preparando cliente...</p>
          <div className="spinner-border" role="status"></div>
        </div>
      );
    }

    if (status === 'ready') {
      return (
        <div className="text-center">
          <div className="alert alert-success">
            <p>Cliente WhatsApp conectado e pronto para uso!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <p>Status desconhecido: {status}</p>
        <button onClick={checkStatus} className="btn btn-primary">Verificar Status</button>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Conectar WhatsApp</h4>
            </div>
            <div className="card-body">
              {renderContent()}
            </div>
            <div className="card-footer">
              <button onClick={checkStatus} className="btn btn-secondary">Atualizar Status</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppConnect;
