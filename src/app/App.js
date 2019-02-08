import React, { Component } from 'react';

class App extends Component {

  constructor() {
    super();
    this.state = {
      total_efectivo: '',
      total_pos: '',
      total_compras: '',
      fechatiempo: '0000-00-00 00:00:00',
      tasks: []
    }
    this.addTask = this.addTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchTasks();
  }

  addTask(e) {
    fetch('http://localhost/api-tesis/cortez/create.php', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(data => {
      M.toast({html: 'task Saved'});
      this.setState({
        total_efectivo: '',
        total_pos: '',
        total_compras: '',
      });
      this.fetchTasks();
    })
    .catch(err => console.error(err));

    e.preventDefault();
  }

  fetchTasks() {
    fetch('http://localhost/api-tesis/cortez/read.php')
      .then(res => res.json())
      .then(data => {
        this.setState({
          tasks: data
        });
      });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  deleteTask(id) {
    if ( confirm('estas seguro de eliminarlo')) {
      fetch('http://localhost/api-tesis/cortez/delete.php', {
        method: 'DELETE',
        body: JSON.stringify({
          ID_cortez: id
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(data => {
        M.toast({html: 'task deleted'});
        this.fetchTasks();
      });
    }

  }

  render() {
    return (
      <div>
        {/* NAVIGATION*/}
        <nav className="light-blue darken-4">
          <div className="container">
            <a className="brand-logo" href="/">PICNIC CORTEZ</a>
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col s5">
              <div className="card">
                <div className="card-content">
                  <form onSubmit={this.addTask}>
                    <div className="row">
                      <div className="input field col s12">
                        <input name="total_efectivo" type="text" placeholder="total Efectivo" onChange={this.handleChange} value={this.state.total_efectivo} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="input field col s12">
                        <textarea name="total_pos" onChange={this.handleChange} placeholder="total POS" className="materialize-textarea" value={this.state.total_pos} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="input field col s12">
                        <textarea name="total_compras" onChange={this.handleChange} placeholder="total_compras" className="materialize-textarea" value={this.state.total_compras} />
                      </div>
                    </div>
                    <button className="btn light-blue darken-4" type="submit"> Send</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col s7">
              <table>
                <thead>
                  <tr>
                    <th>Total Efectivo</th>
                    <th>Total_POS</th>
                    <th>Total_compras</th>
                    <th>Fecha y Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.tasks.map(task => {
                      return (
                        <tr key={task.ID_cortez}>
                          <td>{`$ ${task.total_efectivo}`}</td>
                          <td>{`$ ${task.total_pos}`}</td>
                          <td>{`$ ${task.total_compras}`}</td>
                          <td>{task.fechatiempo}</td>
                          <td>
                            <button className="btn light-blue darken-4" onClick={() => this.editTask(task.ID_cortez)}>
                              <i className="material-icons">edit</i>
                              Edit
                            </button>
                            <button className="btn light-blue darken-4" style={{margin: '2px'}} onClick={() => this.deleteTask(task.ID_cortez)}>
                            <i className="material-icons">delete</i>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;