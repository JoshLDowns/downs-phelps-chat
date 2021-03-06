import React from 'react';
import './styles/App.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      currentRoom: 'general',
      data: [],
      user: document.cookie.split('=')[1] || '',
      content: '',
      loggedIn: false,
      rooms: false,
      loggedOut: false,
      interval: undefined,
      needToScroll: false,
      chatButton: true
    }
  }

  componentDidMount() {
    console.log('mounted')
    fetch('https://cors-anywhere.herokuapp.com/http://names.drycodes.com/10?separator=space').then(res => res.json()).then((jsonObj) => {
      if (this.state.user === '') {
        document.cookie = `user=${jsonObj[0]}`
        this.setState({
          user: jsonObj[0]
        })
      }
    })
  }

  //calls scroll function on update if needed-jd
  componentDidUpdate() {
    if (this.state.needToScroll) {
      this.scrollToBottom()
      this.setState({
        needToScroll: false
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  //scrolls to bottom of text field on mount and update -jd
  scrollToBottom = () => {
    this.scrollBottom.scrollIntoView({ behavior: "smooth" });
  }


  //handles form submit
  submitHandler = (event) => {
    event.preventDefault()
    let date = new Date().toDateString()
    let time = new Date().toLocaleTimeString()
    let user = this.state.user
    let content = this.state.content
    let submission = { date: date, time: time, user: user, content: content }
    //and added the query param (server.js line16)
    fetch((`/post/${this.state.currentRoom}`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submission)
    })
    this.setState({
      content: ''
    })
  }

  //targets post with unique id.  will fetch POST? to delete?
  deleteHandler = (event) => {
    console.log('id:' + event.target.id)
    let id = event.target.id
    let room = this.state.currentRoom
    let submission = { id: id, room: room }
    console.log(submission)
    fetch((`/delete`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submission)
    })
  }

  changeContent = (event) => {
    event.target.value !== '' ? this.setState({ chatButton: false }) : this.setState({ chatButton: true })
    this.setState({
      content: event.target.value
    })
  }

  //gets new name and sets the user in state -jd
  randomizeName = () => {
    fetch('https://cors-anywhere.herokuapp.com/http://names.drycodes.com/10?separator=space').then(res => res.json()).then((jsonObj) => {
      console.log(jsonObj[0])
      this.setState({
        user: jsonObj[0]
      })
      document.cookie = `user=${jsonObj[0]}`
    })
  }

  //toggles boolean for logged in to render the modal window -jd
  logInHandler = () => {
    let newInterval = setInterval(() => {
      fetch(`/db/${this.state.currentRoom}`).then(res => {
        return res.json()
      }).then((data) => {
        //fixed the problem by setting a need to scroll value only if the data will be updated, and only if the client before the update was at the bottom of the div
        let bottom = Math.ceil(this.scrollable.scrollHeight - this.scrollable.scrollTop) === this.scrollable.clientHeight
        if (data.length !== this.state.data.length) {
          console.log(bottom)
          this.setState({
            data: data,
            needToScroll: bottom,
            messageNotification: !bottom
          })
        }
        if (bottom && this.state.messageNotification) {
          this.setState({
            messageNotification: false
          })
        }
      })
    }, 1000)
    this.setState({
      interval: newInterval,
      loggedIn: true
    })
  }

  logOutHandler = () => {
    this.setState({
      loggedIn: false,
    })
    //erases cookies by adding expiration date to them (if logging out)
    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    clearInterval(this.state.interval)
  }

  //toggles boolean for rooms to render the modal window -jd
  chatModalHandler = () => {
    this.setState({
      rooms: true
    })
  }

  //sets room to the selected room, and updates the polling interval -jd
  chatRoomHandler = (event) => {
    clearInterval(this.state.interval);
    let newRoom = event.target.id
    //sets new interval with current room name so we are polling the correct room -jd
    let newInterval = setInterval(() => {
      fetch(`/db/${newRoom}`).then(res => {
        return res.json()
      }).then((data) => {
        //fixed the problem by setting a need to scroll value only if the data will be updated, and only if the client before the update was at the bottom of the div
        let bottom = Math.ceil(this.scrollable.scrollHeight - this.scrollable.scrollTop) === this.scrollable.clientHeight
        if (data.length !== this.state.data.length) {
          console.log(bottom)
          this.setState({
            data: data,
            needToScroll: bottom,
            messageNotification: !bottom
          })
        }
        if (bottom && this.state.messageNotification) {
          this.setState({
            messageNotification: false
          })
        }
      })
    }, 1000)
    this.setState({
      currentRoom: event.target.id,
      rooms: false,
      interval: newInterval
    })
  }

  render() {
    return (
      <div id='body'>
        <div id='main-container'>
          {this.state.loggedIn === false && <LogIn user={this.state.user} randomizeName={this.randomizeName} logInHandler={this.logInHandler} />}
          {this.state.rooms === true && <ChatRoomModal chatRoomHandler={this.chatRoomHandler} />}
          <div id='text-field'>
            {this.state.messageNotification && <Notification scrollToBottom={this.scrollToBottom}/>}
            <div id='text-scroll' ref={(element) => { this.scrollable = element }} >
              {/* targeting unique posts for delete event.  targeting key didn't work for some reason*/}
              {this.state.data ? this.state.data.map((info) => (
                <div key={info._id} className={info.user === this.state.user ? 'text-user' : 'text-non-user'}>
                  <p className='input-name'>{info.user}</p>
                  <p className='input-text'>{info.content}</p>
                  <div className='input-footer'>
                    {info.user === this.state.user && <button className='delete-chat' id={info._id} onClick={this.deleteHandler}>delete</button>}
                    <p className='input-date'>{info.date}</p>
                  </div>
                </div>
              )) : <p>....Loading</p>}
              <div ref={(element) => { this.scrollBottom = element }}></div>
            </div>
          </div>
          <form id='chat-input' onSubmit={this.submitHandler}>
            <input name='content' type='text' id='content-input' onChange={this.changeContent} value={this.state.content} />
            <input type='submit' name='submit' className='button' value='CHAT' disabled={this.state.chatButton} />
          </form>
          <div id='control-buttons'>
            <button id='chat-room-toggle' className='button' onClick={this.chatModalHandler}>ROOMS</button>
            <button id='logout-toggle' className='button' onClick={this.logOutHandler}>LOG OUT</button>
          </div>
        </div>
      </div>
    );
  }
}

//Log in modal on load, allows to set name
function LogIn(props) {
  return (
    <div id='log-in-modal'>
      <h1 id='title'>CHATTR</h1>
      <div id='name'>
        <h3>NAME:</h3>
        <h2>{props.user}</h2>
      </div>
      <div id='log-in-buttons'>
        <button className='button' onClick={props.randomizeName}>RANDOMIZE!</button>
        <button className='button' onClick={props.logInHandler}>START CHATTING!</button>
      </div>
    </div>
  )
}

//Chat room selection modal
function ChatRoomModal(props) {
  return (
    <div id='chat-room-modal'>
      <div id='general' className='chat-room-selector' onClick={props.chatRoomHandler}>
        <h1 className='room-title'>#General_Chat</h1>
        <p className='room-descrip'>A space to talk about whatever</p>
      </div>
      <div id='gaming' className='chat-room-selector' onClick={props.chatRoomHandler}>
        <h1 className='room-title'>#Game_Chat</h1>
        <p className='room-descrip'>A space to talk about games of all sorts</p>
      </div>
      <div id='coding' className='chat-room-selector' onClick={props.chatRoomHandler}>
        <h1 className='room-title'>#Code-Chat</h1>
        <p className='room-descrip'>A space to talk about coding #learnEveryDay</p>
      </div>
      <div id='designed' className='chat-room-selector' onClick={props.chatRoomHandler}>
        <h1 className='room-title'>#Design-Chat</h1>
        <p className='room-descrip'>A space to vent about CSS... and talk about design and stuff</p>
      </div>
    </div>
  )
}


function Notification(props) {
  return (
    <div id="notification">
      <h3 onClick={props.scrollToBottom} >New messages!</h3>
    </div>
  )
}


export default App;
