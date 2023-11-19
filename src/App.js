import React, { useState, useEffect } from 'react';
import './App.css';
import Session from './Session';
import User from './User';
import Graph from "./Graph";
import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [show_legend, updateLegend] = useState(false);
  const [username, setUsername] = useState("");
  
  const [currUser, setCurrUser] = useState();
  const [currSession, setCurrSession] = useState();
  const [listUsers, setlistUsers] = useState([])

  function createUser(){
    const data = {
      "username": username,
      "sessions": []
    }
    axios.post('https://us-east-1.aws.data.mongodb-api.com/app/serveandpass-wkoqd/endpoint/createUser', data)
      .then(response => {
          console.log('Response:', response.data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }

  const addSessionToUser = (newSessionList) => {
    const updatedUser = new User(currUser.username);
    updatedUser.sessions = [...currUser.sessions, newSessionList];

    console.log("updatedUser:", updatedUser)
    axios.put("https://us-east-1.aws.data.mongodb-api.com/app/serveandpass-wkoqd/endpoint/editUser?username="+updatedUser.username, updatedUser)
        .then(response => {
          console.log('Response:', response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    setCurrUser(updatedUser);
  };

  useEffect(() => {
    console.log("Update ListUsers")
    axios.get('https://us-east-1.aws.data.mongodb-api.com/app/serveandpass-wkoqd/endpoint/getUsers')
        .then((response) => {
            setlistUsers(response.data)
            console.log('Data retrieved:', response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
  }, [currUser, ])


  
  function updateInputUsername(event) {
    setUsername(event.target.value);
  }

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
      toast("Loading User: " + username, {
        position: toast.POSITION.BOTTOM_CENTER
      })
      setCurrUser(foundUser);
    } else {
      toast("Creating New User: " + username, {
        position: toast.POSITION.BOTTOM_CENTER
      })
      setCurrUser(new User(username));
      createUser()
    }
    setCurrSession(new Session(new Date().toLocaleDateString()));
  }

  return(
    <div>
      <form className="inputcontainer" onSubmit={initAll}>
        <input 
          type="text" 
          value={username} 
          onChange={updateInputUsername} 
          placeholder="User Id"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        />
        <button type="submit">Submit</button>
      </form>


      {currUser? 
        <div>
          <div className='container'>
            <div className="buttonContainer">
              <button onClick={() => incrementPass(3)}> 3 </button>
              <button onClick={() => incrementPass(2)}> 2 </button>
              <button onClick={() => incrementPass(1)}> 1 </button>
              <button onClick={() => incrementPass(0)}> 0 </button>
            </div>
            <div className="currSessionStats">
                <p> 3: {currSession.passes["3"]}</p>
                <p> 2: {currSession.passes["2"]}</p>
                <p> 1: {currSession.passes["1"]}</p>
                <p> 0: {currSession.passes["0"]}</p>
                <p> Current Session Average: {currSession.average.toFixed(2)}</p>
                <p> Current Session Total Passes: {currSession.count} </p>
                <div className='updateButtonsContainer'> 
                  <button className="submit" onClick={() => {
                    addSessionToUser(currSession)
                    setCurrSession(new Session(new Date().toLocaleDateString()))
                    }}> Submit </button>
                  <button className="clear" onClick={() => setCurrSession(new Session(new Date().toLocaleDateString()))}> Clear </button>
                </div>
            </div>
          </div>
          <Graph my_data={currUser.sessions}/>
        </div>
      :null}
      <ToastContainer />
    </div>
    
  );
}

export default App;
