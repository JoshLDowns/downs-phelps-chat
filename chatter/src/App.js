import React from 'react';
import './styles/App.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      //This is the only code up front I'm adding; the state's room value is passed in...
      currentRoom: 'test',
      data: undefined,
      user: '',
      content: '',
    }
  }

  componentDidMount() {
    console.log('mounted')
    //  setInterval(() => {
    //   //...here as a parameter... which...(server.js, line14)
    //   fetch(`/db/${this.state.currentRoom}`).then(res => {
    //     return res.json()
    //   }).then((data) => {
    //     if (data !== this.state.data) {
    //       this.setState({
    //         data: data
    //       })
    //     }
    //   })
    //   // I slowed the polling, too
    // }, 2000)
  }

  submitHandler = (event) => {
    event.preventDefault()
    let user = this.state.user
    let content = this.state.content
    let submission = { user: user, content: content }

    fetch((`/post/${this.state.currentRoom}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submission)
    }).then((data) => {
      this.setState({
        user: '',
        content: ''
      })
    })
  }

  nameChange = (event) => {
    this.setState({
      user: event.target.value
    })
  }

  changeContent = (event) => {
    this.setState({
      content: event.target.value
    })
  }

  render() {
    return (
      <div id='body'>
        <form id='chat-input' onSubmit={this.submitHandler}>
          <input name='user' type='text' onChange={this.nameChange} value={this.state.user} />
          <input name='content' type='text' onChange={this.changeContent} value={this.state.content} />
          <input type='submit' name='submit' />
        </form>
        <div id='text-field'>
          {this.state.data ? this.state.data.map((info) => <p key={info._id}>{info.date}: {info.user}: {info.content}</p>) : <p>....Loading</p>}
        </div>

      </div>
    );
  }
}

export default App;
