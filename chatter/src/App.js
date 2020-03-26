import React from 'react';
import './styles/App.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      currentRoom: 'movies',
      data: undefined
    }
  }
  //I'm a note!
  componentDidMount() {
    console.log('mounted')
    fetch('/db').then(res => {
      //console.log(res.clone().json())
      return res.json()
      console.log(res)
    }).then((data)=>{
      this.setState({
        data: data
      })
    })
  }

  render() {
    return (
      <div id='body'>
        <h1>Stuff!</h1>
        <div id='text-field'>
         {this.state.data?this.state.data.map((info)=><p key={info.title}>{info.title}: {info.writer}</p>):<p>....Loading</p>}
        </div>

      </div>
    );
  }
}

export default App;
