import React, { Component } from 'react';

const URL = 'http://api.lapizzeria.com/';

class App extends Component {

  constructor() {
    super();
    this.state = {
      total_efectivo: '',
      total_pos: '',
      total_compras: '',
      fechatiempo: '0000-00-00 00:00:00',
      ID_cortez: '',
      tasks: []
    }
    this.addTask = this.addTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  componentDidMount() {
    this.fetchTasks();
  }

  addTask(e) {
    if(this.state.ID_cortez) {
      fetch(`${URL}cortez/update.php`, {
        method: 'PUT',
        body: JSON.stringify(this.state),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(data => {
        M.toast({html: 'task Updated'});
        this.setState({
          total_efectivo: '',
          total_pos: '',
          total_compras: '',
          ID_cortez: ''
        });
        this.fetchTasks();
      })
      .catch(err => console.error(err));

    } else {
      fetch(`${URL}cortez/create.php`, {
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
    }
    e.preventDefault();
  }

  fetchTasks() {
    fetch(`${URL}cortez/read.php`)
      .then(res => res.json())
      .then(data => {
        if(data.ID_cortez == 0) {
          this.setState({
            tasks: []
          });
        } else {
          this.setState({
            tasks: data
          });
        }
      });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  deleteTask(id) {
    if ( confirm('estas seguro de eliminarlo ?')) {
      fetch(`${URL}cortez/delete.php`, {
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
        console.log(this.state)
        this.fetchTasks();
      });
    }

  }

  editTask(id) {
    let lista = this.state.tasks
    lista.filter((list) => 
      list.ID_cortez === id
      ).forEach((listCortez) => {
        this.setState({
          total_efectivo: listCortez.total_efectivo,
          total_pos: listCortez.total_pos,
          total_compras: listCortez.total_compras,
          ID_cortez: listCortez.ID_cortez
        })
      });

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
        <div className="container" style={{marginTop: '40px'}}>
          <div className="row">
            <div className="col s5">
              <div className="card">
                <div className="card-content" style={{paddingBottom: '60px'}}>
                  <form onSubmit={this.addTask}>
                    <div className="row">
                      <div className="input field col s12">
                        <label >Total Efectivo</label>
                          <input name="total_efectivo" type="text" placeholder="Total efectivo" onChange={this.handleChange} value={this.state.total_efectivo} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="input field col s12">
                        <label>Total POS</label>
                          <textarea name="total_pos" onChange={this.handleChange} placeholder="Total POS" className="materialize-textarea" value={this.state.total_pos} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="input field col s12">
                        <label>Total Compras</label>
                          <textarea name="total_compras" onChange={this.handleChange} placeholder="Total compras" className="materialize-textarea" value={this.state.total_compras} />
                      </div>
                    </div>
                    <button className="btn light-blue darken-4" type="submit" style={{float: 'right', width: '100px'}}> Send</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col s7">
              <div className="card">
                <table>
                  <thead>
                    <tr>
                      <th>Total Efectivo</th>
                      <th>Total POS</th>
                      <th>Total compras</th>
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
                              <button className="btn light-blue darken-4" style={{marginRight: '4px', marginBottom: '4px'}} onClick={() => this.editTask(task.ID_cortez)}>
                                <i className="material-icons">edit</i>
                              </button>
                              <button className="btn light-blue darken-4" style={{marginBottom: '4px'}} onClick={() => this.deleteTask(task.ID_cortez)}>
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
      </div>
    )
  }
}

export default App;