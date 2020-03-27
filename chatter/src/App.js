import React from 'react';
import './styles/App.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      currentRoom: 'movies',
      data: undefined,
      user: '',
      content: ''
    }
  }

  componentDidMount() {
    console.log('mounted')
    //setInterval(() => {
    //  fetch('/db').then(res => {
    //    return res.json()
    //  }).then((data) => {
    //    if (data !== this.state.data) {
    //      this.setState({
    //        data: data
    //      })
    //    }
    //  })
    //}, 1000)
  }

  submitHandler = (event) => {
    event.preventDefault()
    let user = this.state.user
    let content = this.state.content
    let submission = { user: user, content: content }
    
    fetch('/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submission)
    }).then((data)=>{
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
