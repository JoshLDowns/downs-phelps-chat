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
    fetch('/db').then(res => {
      return res.json()
      console.log(res)
    }).then((data)=>{
      this.setState({
        data: data
      })
    })
  }

  submitHandler=(event)=>{
    let user= this.state.user
    let content= this.state.content
    event.preventDefault()
    let submission={user:user,content:content}
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/post');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify(submission));
    xhr.onreadystatechange = function(req, res) {
      if(req.readyState === 4) {
        if(req.status === 400) {
          let json_data = xhr.responseText;
          console.log(json_data);
          res.send(json_data)
        }
      }
    }

    fetch('/db').then(res => {
      return res.json()
    }).then((data)=>{
      console.log(data);
      this.setState({
        data: data
      })
    })
  }

  nameChange=(event)=>{
    this.setState({
      user: event.target.value
    })
  }

  changeContent=(event)=>{
    this.setState({
      content: event.target.value
    })
  }
  
  render() {
    return (
      <div id='body'>
        <form id='chat-input' onSubmit={this.submitHandler}>
          <input name='user' type='text' onChange={this.nameChange} value={this.state.user}/>
          <input name='content' type='text' onChange={this.changeContent} value={this.state.content}/>
          <input type='submit' name='submit' />
        </form>
        <div id='text-field'>
         {this.state.data?this.state.data.map((info)=><p key={info._id}>{info.date}: {info.user}: {info.content}</p>):<p>....Loading</p>}
        </div>

      </div>
    );
  }
}

export default App;
