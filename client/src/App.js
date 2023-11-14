import React, { useState, useEffect } from 'react';
import './App.css';
import Session from './Session';
import User from './User';
import Legend from './Legend';
import Graph from "./Graph";
import axios from 'axios'

function App() {
  const [show_legend, updateLegend] = useState(false);
  const [username, setUsername] = useState("");
  
  const [currUser, setCurrUser] = useState();
  const [currSession, setCurrSession] = useState();

  const [listUsers, setlistUsers] = useState([])
  const [sessions, setSessions] = useState()
  function createUser(){
    axios.post("http://localhost:3001/createUser", {username, sessions})
    .then((response) => {
      setlistUsers([...listUsers, {username, sessions}])
      console.log('user created')
    })
  }

  useEffect(() => {
    axios.get('http://localhost:3001/getUsers')
    .then((response) => { setlistUsers(response.data)
    })
  }, [])


  
  function updateInputUsername(event) {
    setUsername(event.target.value);
  }

  const addSessionToUser = (newSession) => {
    const updatedUser = new User(currUser.username);
    updatedUser.sessions = [...currUser.sessions, newSession];
    setCurrUser(updatedUser);
  };

  const incrementPass = (passKey) => {
    const updatedSession = { ...currSession };
    updatedSession.passes = {
        ...currSession.passes,
        [passKey]: currSession.passes[passKey] + 1,
    };
    updatedSession.total += passKey;
    updatedSession.count += 1;
    updatedSession.average = (updatedSession.total / updatedSession.count);
    setCurrSession(updatedSession)
  }

  function initAll(event) {
    event.preventDefault();
    setCurrUser(null);
    const foundUser = listUsers.find(user => user['username'] === username);
    if (foundUser) {
      setCurrUser(foundUser);
    } else {
      setCurrUser(new User(username));
      createUser()
    }
    setCurrSession(new Session(new Date().toLocaleDateString()));
  }
  
  

  function test2(){
    console.log(currUser)
    console.log(listUsers)
  }

  
  function logcurruser(){
    console.log(currUser.username)
    console.log(currUser.sessions)
  }
  function logcurrsession(){
    // console.log(currSession.date)
    // console.log(currSession.passes)
    // console.log(currSession.count)
    // console.log(currSession.total)
    // console.log(currSession.average)
  }
  function test(){
    //lol
  }

  return(
    <div>
      <form onSubmit={initAll}>
        <input type="text" value={username} onChange={updateInputUsername} placeholder="User Id"/>
        <button type="submit">Submit</button>
      </form>

      {currUser? 
        
        <div>
          <p> Current User: {currUser.username}</p> 
          <div className="buttonContainer">
            <button onClick={() => incrementPass(3)}> 3 </button>
            <button onClick={() => incrementPass(2)}> 2 </button>
            <button onClick={() => incrementPass(1)}> 1 </button>
            <button onClick={() => incrementPass(0)}> 0 </button>
            <button onClick={() => setCurrSession(new Session(new Date().toLocaleDateString()))}> Clear </button>
          </div>
          <div className="currSessionStats">
              <p> 3: {currSession.passes["3"]}</p>
              <p> 2: {currSession.passes["2"]}</p>
              <p> 1: {currSession.passes["1"]}</p>
              <p> 0: {currSession.passes["0"]}</p>
              <p> Current Session Average: {currSession.average.toFixed(2)}</p>
              <p> Current Session Total Passes: {currSession.count} </p>
          </div>
          <button onClick={() => {
            addSessionToUser(currSession)
            setCurrSession(new Session(new Date().toLocaleDateString()))
            }}> Submit Session </button>
          <div className="legend">
            <button onClick={() => updateLegend(!show_legend)}> Show Legend </button>
            {show_legend ? <Legend/> : null}
          </div>


          <button onClick={logcurruser}> log curr user</button>
          <button onClick={logcurrsession}> log curr session</button>
          <button onClick={test}> test button</button>
          
          <Graph my_data={currUser.sessions}/>
        </div>
      :null}
    </div>
    
  );
}

export default App;
