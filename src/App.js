import React, { useState, useEffect } from 'react';
import './App.css';
import Session from './Session';
import User from './User';
import Graph from "./Graph";
import axios from 'axios'


import { ToastContainer, toast, useToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [username, setUsername] = useState("");
  
  //current users
  const [listCurrUsers, setlistCurrUsers] = useState([]);

  //all users from DB
  const [listUsers, setlistUsers] = useState([
  ])

  function createUser(NS){
    const data = {
      "username": username,
      "sessions": [],
      "currentSession": NS
    }
    axios.post('https://us-east-1.aws.data.mongodb-api.com/app/serveandpass-wkoqd/endpoint/createUser', data)
      .then(response => {
          console.log('Response:', response.data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }

  const addSessionToUser = (user) => {
    const updatedUser = new User(user.username);
    updatedUser.sessions = [...user.sessions, user.currentSession];
    updatedUser.currentSession = new Session(new Date().toLocaleDateString());
  
    axios.put("https://us-east-1.aws.data.mongodb-api.com/app/serveandpass-wkoqd/endpoint/editUser?username="+updatedUser.username, updatedUser)
        .then(response => {
          console.log('Response:', response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
  
    return updatedUser; // Return the updated user
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
  }, [listCurrUsers, ])


  
  function updateInputUsername(event) {
    setUsername(event.target.value);
  }

  const incrementPass = (user, passKey) => {
    // Clone the current session
    const updatedSession = { ...user.currentSession }; 
    updatedSession.passes = {
      ...updatedSession.passes,
      [passKey]: updatedSession.passes[passKey] + 1,
    };
    updatedSession.passArray = [...updatedSession.passArray, passKey];
    updatedSession.total += passKey;
    updatedSession.count += 1;
    updatedSession.average = updatedSession.total / updatedSession.count;
  
    // Update the user object with the new session
    const updatedUser = { ...user, currentSession: updatedSession };
  
    // Clone the list and replace the updated user
    setlistCurrUsers(listCurrUsers.map(u => (u.username === user.username ? updatedUser : u)));
  };
  
  const deincrementPass = (user) => {
    const updatedSession = { ...user.currentSession };
    let newPassArray = updatedSession.passArray;
    
    if (!newPassArray || newPassArray.length <= 0) return;
  
    const key = newPassArray[newPassArray.length - 1];
    newPassArray = newPassArray.slice(0, -1);
    updatedSession.passArray = newPassArray;
    updatedSession.passes = {
      ...updatedSession.passes,
      [key]: updatedSession.passes[key] - 1,
    };
  
    updatedSession.total -= key;
    updatedSession.count -= 1;
    updatedSession.average = updatedSession.total / updatedSession.count;
  
    const updatedUser = { ...user, currentSession: updatedSession };
  
    // Clone the list and replace the updated user
    setlistCurrUsers(listCurrUsers.map(u => (u.username === user.username ? updatedUser : u)));
  };
  
  

  function initAll(event) {
    event.preventDefault();
    const foundUser = listUsers.find(user => user['username'] === username);
  
    if (foundUser) {
      toast("Loading User: " + username, {
        position: toast.POSITION.BOTTOM_CENTER
      })
      setlistCurrUsers([...listCurrUsers, foundUser]);
    } else {
      toast("Creating New User: " + username, {
        position: toast.POSITION.BOTTOM_CENTER
      })
      let NS = new Session(new Date().toLocaleDateString())
      setlistCurrUsers([...listCurrUsers, new User(username, NS)]);
      createUser(NS)
    }
    setUsername('');
    // console.log(listCurrUsers);
  }

  function findtotalobject(user){
    let total = {
      3: 0,
      2: 0,
      1: 0,
      0: 0
    };
    for (let i = 0; i < user.sessions.length; i++) {
      for(let j = 0; j < 4; j++){
        total[j] += user.sessions[i].passes[j];
      }
      
    }
    return total
  }
  
  function findtotal(user){
    let total = 0;
    for (let i = 0; i < user.sessions.length; i++) {
      total += user.sessions[i].total
    }
    return total
  }

  function findcount(user){
    let total = 0;
    for (let i = 0; i < user.sessions.length; i++) {
      total += user.sessions[i].count
    }
    return total
  }
  
  return(
    <div className="container">
  <div className="form-container">
    <form className="input-container" onSubmit={initAll}>
      <input 
        type="text" 
        value={username} 
        onChange={updateInputUsername} 
        placeholder="New User ID"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        className="input-field"
      />
      <button type="submit" className="submit-button">Add User</button>
    </form>
  </div>

  <div className="user-list">
    {listCurrUsers.map((user, index) => {
      return (
        <div className="user-container" key={index}>
          <h1 className="user-title">{user.username}</h1>
          <div className="button-container">
            {[3, 2, 1, 0].map((value) => (
              <button key={value} className="score-button" onClick={() => incrementPass(user, value)}>{value}</button>
            ))}
          </div>
          <div className="undo-container">
            <button className="undo-button" onClick={() => deincrementPass(user)}>Undo</button>
          </div>
        </div>
      );
    })}
  </div>

  
    
    {listCurrUsers.length !== 0? 
    <div className="stats-container">
      <button className="submit-all-button" onClick={() => {
          const updatedUsers = listCurrUsers.map(user => addSessionToUser(user)); // Get updated users
          setlistCurrUsers(updatedUsers); // Update state with new list
        }}>
          Submit All
        </button>
      <h1 className="stats-title">STATS</h1>

      {listCurrUsers.map((user, index) => {
      let tt = findtotalobject(user);

      let t = findtotal(user)
      let c = findcount(user)
      return (
        <div className="stats-user" key={index}>
          <h2>{user.username}</h2>
          <div className="stats-sections">
            {/* Current Session Section */}
            <div className="stats-section">
              <h3>Current Session</h3>
              <p>3: {user.currentSession.passes[3]}</p>
              <p>2: {user.currentSession.passes[2]}</p>
              <p>1: {user.currentSession.passes[1]}</p>
              <p>0: {user.currentSession.passes[0]}</p>
              <p>
                Average: {user.currentSession.average.toFixed(2)} Total Passes: {user.currentSession.count}
              </p>
            </div>
            {/* Lifetime Section */}
            <div className="stats-section">
              <h3>Lifetime</h3>
              <p>3: {tt[3]}</p>
              <p>2: {tt[2]}</p>
              <p>1: {tt[1]}</p>
              <p>0: {tt[0]}</p>
              <p>
                Average: {(t/c).toFixed(2)} Total Passes: {c}
              </p>
            </div>
          </div>
        </div>

      );
    })}

    </div> 
    
    
    : <> </>}
    
  </div>
    
  );
}

                
                {/* <Graph my_data={currUser.sessions}/> */}
export default App;
