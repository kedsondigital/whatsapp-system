  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/whatsapp/group/message', {
        groupId,
        message,
        scheduledTime,
      });
      setSuccess('Mensagem agendada com sucesso!');
      setFormData({
        groupId: '',
        message: '',
        scheduledTime: '',
      });
      fetchScheduledMessages(); // Atualizar a lista de mensagens agendadas
    } catch (err) {
      setError(err.response?.data?.msg || 'Erro ao agendar mensagem');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Agendar Mensagem</h1>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Agendar Mensagem</h4>
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
                    name="groupId"
                    value={groupId}
                    onChange={onChange}
                    placeholder="Ex: 123456789@g.us"
                    required
                  />
                  <div className="form-text">
                    O ID do grupo deve estar no formato: número@g.us
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Mensagem</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    value={message}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="scheduledTime" className="form-label">Horário Agendado</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="scheduledTime"
                    name="scheduledTime"
                    value={scheduledTime}
                    onChange={onChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Agendar Mensagem</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4>Mensagens Agendadas</h4>
            </div>
            <div className="card-body">
              {fetchingMessages ? (
                <p>Carregando mensagens agendadas...</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Grupo</th>
                      <th>Mensagem</th>
                      <th>Horário</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledMessages.length > 0 ? (
                      scheduledMessages.map((msg) => (
                        <tr key={msg._id}>
                          <td>{msg.groupId}</td>
                          <td>{msg.message}</td>
                          <td>{new Date(msg.scheduledTime).toLocaleString()}</td>
                          <td>{msg.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">Nenhuma mensagem agendada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMessage;
