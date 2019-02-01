import React, { Component } from 'react';

class App extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      tasks: []
    }
    this.addTask = this.addTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchTasks();
  }

  addTask(e) {
    fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(data => {
      console.log(data)
      M.toast({html: 'task Saved'});
      this.setState({
        title: '',
        description: ''
      });
      this.fetchTasks();
    })
    .catch(err => console.error(err));

    e.preventDefault();
  }

  fetchTasks() {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        this.setState({
          tasks: data
        });
        console.log(this.state)
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
      fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
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
            <a className="brand-logo" href="/">MERN</a>
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
                        <input name="title" type="text" placeholder="task title" onChange={this.handleChange} value={this.state.title} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="input field col s12">
                        <textarea name="description" onChange={this.handleChange} placeholder="task title" className="materialize-textarea" value={this.state.description} />
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
                    <th>Title</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.tasks.map(task => {
                      return (
                        <tr key={task._id}>
                          <td>{task.title}</td>
                          <td>{task.description}</td>
                          <td>
                            <button className="btn light-blue darken-4" onClick={() => this.editTask(task._id)}>
                              <i className="material-icons">edit</i>
                              Edit
                            </button>
                            <button className="btn light-blue darken-4" style={{margin: '4px'}} onClick={() => this.deleteTask(task._id)}>
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