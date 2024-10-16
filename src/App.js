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
  const [isVisible, setIsVisible] = useState(false); // State to toggle visibility
  
  //current users
  const [listCurrUsers, setlistCurrUsers] = useState([]);

  //all users from DB
  const [listUsers, setlistUsers] = useState([
  ])

  const toggleVisibility = () => {
    setIsVisible(!isVisible); // Toggle the state
  };

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
    if(passKey == '.5'){ 
      passKey = 0.5
      console.log("rizz")
    } 
    
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

    const foundCurrUser = listCurrUsers.find(user => user['username'] === username);
    if (foundCurrUser) {
      console.log(`User already exists: ${foundCurrUser.username}`);
      return;
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
      0.5: 0,  // Use '0.5' as a string
      0: 0
    };
    
    // Iterate through each session
    for (let i = 0; i < user.sessions.length; i++) {
      for(let j = 0; j <= 3; j++){
        total[j] += user.sessions[i].passes[j];
      }
      // Handle 0.5 separately
      total['0.5'] += user.sessions[i].passes[0.5];  // Use 0.5 key correctly
    }
    return total;
}


  
  function findtotal(user){
    console.log(user)
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
            {[3, 2, 1, '.5', 0].map((value) => (
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
        <hr style={{ border: "1px solid black" }} />
        <div className="form-container">
          <h1 className="stats-title">STATS</h1>
          <button onClick={toggleVisibility} className="toggle-button">
            {isVisible ? "Hide Lifetime Stats & Graph" : "Show Lifetime Stats & Graph"}
          </button>
        </div>
              

      
      <div className='user-list'>
      {listCurrUsers.map((user, index) => {

let tt = findtotalobject(user);
let t = findtotal(user);
let c = findcount(user);
console.log(tt);
console.log(t);
console.log(c);
// Function to toggle visibility


return (
  <div className="user-container" key={index}> {/* No conditional class needed */}
    <h2 className='user-title'>{user.username}</h2>
    <div className="">
      {/* Current Session Section */}
      <div className="stats-section">
        <p>3: {user.currentSession.passes[3]}</p>
        <p>2: {user.currentSession.passes[2]}</p>
        <p>1: {user.currentSession.passes[1]}</p>
        <p>.5: {user.currentSession.passes[0.5]}</p> {/* Use '0.5' here */}
        <p>0: {user.currentSession.passes[0]}</p>
        <p> Average: {user.currentSession.average.toFixed(2)} </p>
        <p> Total Passes: {user.currentSession.count} </p>
      </div>

      {/* Lifetime Stats Section, always side by side */}
      <div className={`stats-section lifetime-section ${isVisible ? 'visible' : 'hidden-content'}`}>
        
        <h3 className='user-title'>Lifetime</h3>
        <p>3: {tt[3]}</p>
        <p>2: {tt[2]}</p>
        <p>1: {tt[1]}</p>
        <p>.5: {tt['0.5']}</p> {/* Ensure '0.5' is used here */}
        <p>0: {tt[0]}</p>
        <p> Average: {(t/c).toFixed(2)} </p>
        <p>Total Passes: {c} </p>

        {/* Graph Component */}
        <Graph my_data={user.sessions} />
      </div>
    </div>

    {/* Toggle button for hiding only content, not the section */}
    
  </div>
);
})}
      </div>
      

    </div> 
    
    
    : <> </>}
    
  </div>
    
  );
}

                
                
export default App;
