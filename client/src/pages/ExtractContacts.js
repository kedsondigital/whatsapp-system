import React, { useState } from 'react';
import axios from 'axios';

const ExtractContacts = () => {
  const [groupId, setGroupId] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = e => setGroupId(e.target.value);

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const res = await axios.get(`/api/whatsapp/group/${groupId}/contacts`);
      setContacts(res.data);
      setSuccess(`Extraídos ${res.data.length} contatos com sucesso!`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao extrair contatos');
      console.error(err);
    }
    
    setLoading(false);
  };

  const copyToClipboard = () => {
    const text = contacts.map(contact => `${contact.name}: ${contact.number}`).join('\n');
    navigator.clipboard.writeText(text);
    setSuccess('Contatos copiados para a área de transferência!');
  };

  const downloadCSV = () => {
    const headers = ['Nome', 'Número', 'ID'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        `"${contact.name.replace(/"/g, '""')}"`,
        contact.number,
        contact.id
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `contatos-grupo-${groupId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-4">
      <h1>Extrair Contatos de Grupos</h1>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Extrair Contatos</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="groupId" className="form-label">ID do Grupo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="groupId"
                    value={groupId}
                    onChange={onChange}
                    placeholder="Ex: 123456789@g.us"
                    required
                  />
                  <div className="form-text">
                    O ID do grupo deve estar no formato: número@g.us
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="ms-2">Extraindo...</span>
                    </>
                  ) : 'Extrair Contatos'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Contatos Extraídos</h4>
            </div>
            <div className="card-body">
              {contacts.length > 0 ? (
                <>
                  <div className="mb-3">
                    <button onClick={copyToClipboard} className="btn btn-success me-2">
                      Copiar para Área de Transferência
                    </button>
                    <button onClick={downloadCSV} className="btn btn-info">
                      Baixar CSV
                    </button>
                  </div>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Número</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact, index) => (
                          <tr key={index}>
                            <td>{contact.name}</td>
                            <td>{contact.number}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p>Nenhum contato extraído ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractContacts;
