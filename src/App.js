import React, { useState, useEffect } from 'react';
import './App.css';
import Session from './Session';
import User from './User';
import Graph from "./Graph";
import StatCard from './StatCard';
import axios from 'axios'


import { ToastContainer, toast, useToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [show_legend, updateLegend] = useState(false);
  const [username, setUsername] = useState("");
  
  //current users
  const [listCurrUsers, setlistCurrUsers] = useState([]);

  //all users from DB
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

  // const addSessionToUser = (newSessionList) => {
  //   const updatedUser = new User(currUser.username);
  //   updatedUser.sessions = [...currUser.sessions, newSessionList];

  //   console.log("updatedUser:", updatedUser)
  //   axios.put("https://us-east-1.aws.data.mongodb-api.com/app/serveandpass-wkoqd/endpoint/editUser?username="+updatedUser.username, updatedUser)
  //       .then(response => {
  //         console.log('Response:', response.data);
  //       })
  //       .catch(error => {
  //         console.error('Error:', error);
  //       });
  //   setCurrUser(updatedUser);
  // };

  // useEffect(() => {
  //   console.log("Update ListUsers")
  //   axios.get('https://us-east-1.aws.data.mongodb-api.com/app/serveandpass-wkoqd/endpoint/getUsers')
  //       .then((response) => {
  //           setlistUsers(response.data)
  //           console.log('Data retrieved:', response.data);
  //       })
  //       .catch(error => {
  //           console.error('Error fetching data:', error);
  //       });
  // }, [listCurrUsers, ])


  
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
    for (let i = 0; i < listCurrUsers.length; i++) {
      const user = listCurrUsers[i];
      console.log(user.username + "/" + username);
      if (user.username === username) {
        // or if username already exists in entire database
        console.log("ERR");
        return;
      }
    }

    if (foundUser) {
      toast("Loading User: " + username, {
        position: toast.POSITION.BOTTOM_CENTER
      })
      setlistCurrUsers([...listCurrUsers, foundUser]);
    } else {
      toast("Creating New User: " + username, {
        position: toast.POSITION.BOTTOM_CENTER
      })
      setlistCurrUsers([...listCurrUsers, new User(username, new Session(new Date().toLocaleDateString()))]);
      createUser()
    }
    setUsername('');
    console.log(listCurrUsers);
  }

  function findtotal(user, key){
    let total = 0;
    for (let i = 0; i < user.sessions.length; i++) {
      total += user.sessions[i].passes[key]
    }
    return total
  }

  return(
    <div>
      <div>
        <form className="inputcontainer" onSubmit={initAll}>
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
          />
          <button type="submit"> Add User </button>
        </form>
      </div>

      <div>
        {listCurrUsers.map((user, index) => {
          return (
            <div className='container'>
              <div className="buttonContainer">
                <h1> {user.username} </h1>
                <button onClick={() => incrementPass(user, 3)}> 3 </button>
                <button onClick={() => incrementPass(user, 2)}> 2 </button>
                <button onClick={() => incrementPass(user, 1)}> 1 </button>
                <button onClick={() => incrementPass(user, 0)}> 0 </button>
                <button onClick={() => deincrementPass(user)}> Undo </button>
              </div>
            </div>
          )
        })}
        {/* <button> Submit All Sessions </button> */}
      </div>

      <h1> STATS </h1>
      <div>
        {listCurrUsers.map((user, index) => {
          let t = {
            3: findtotal(user, 3),
            2: findtotal(user, 2),
            1: findtotal(user, 1),
            0: findtotal(user, 0)
          }
          let to = (t[3] + t[2] + t[1] + t[0])
          return (
            <div>
              <h2> {user.username} </h2>
              <h3> Current Session </h3>
                <p> 3: {user.currentSession.passes[3]} </p>
                <p> 2: {user.currentSession.passes[2]} </p>
                <p> 1: {user.currentSession.passes[1]} </p>
                <p> 0: {user.currentSession.passes[0]}</p>
                <p> Average: {user.currentSession.average.toFixed(2)} Total Passes: {user.currentSession.total}</p>
              {/* <h3> Lifetime </h3>
                <p> 3: { t[3] + user.currentSession.passes[3]} </p>
                <p> 2: { t[2] + user.currentSession.passes[2]} </p>
                <p> 1: { t[1] + user.currentSession.passes[1]} </p>
                <p> 0: { t[0] + user.currentSession.passes[0]} </p>
                <p> Average: {((to/4) + user.currentSession.average).toFixed(2)} Total Passes: {to + user.currentSession.total} </p> */}
                {/* <Graph my_data={currUser.sessions}/> */}
            </div>
          )
        })}
      </div>

    </div>
    
    
  );
}

export default App;
