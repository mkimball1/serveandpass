import React, { useState, useEffect } from 'react';
import './App.css';
import Session from './Session';
import User from './User';
import Legend from './Legend';
import LineChart from "./Graph";

function App() {
  const [show_legend, updateLegend] = useState(false);
  const [username, setUsername] = useState("");
  const currUser = new User();
  const currSession = new Session("123");
  
  function updateUsername(event) {
    setUsername(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    currUser.setUsername(username)
    // Delete later
    currUser.sessions[0].incrementPass(3)
    currUser.sessions[0].incrementPass(3)
    currUser.sessions[1].incrementPass(2)
    currUser.sessions[1].incrementPass(1)
    currUser.sessions[2].incrementPass(1)
    console.log(currUser.sessions) 
  }
  

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={updateUsername} placeholder="User Id"/>
        <button type="submit">Submit</button>
      </form>

      {currUser.username ? 
        <div> 
          <p> Current User: {currUser.username}</p> 
          <div className="buttonContainer">
            <button onClick={() => currSession.incrementPass(3)}> 3 </button>
            <button onClick={() => currSession.incrementPass(2)}> 2 </button>
            <button onClick={() => currSession.incrementPass(1)}> 1 </button>
            <button onClick={() => currSession.incrementPass(0)}> 0 </button>
          </div>
        
          <div className="currSessionStats">
              <p> 3: {currSession.passes["3"]}</p>
              <p> 2: {currSession.passes["2"]}</p>
              <p> 1: {currSession.passes["1"]}</p>
              <p> 0: {currSession.passes["0"]}</p>
              <p> Current Session Average: {currSession.average.toFixed(2)}</p>
              <p> Current Session Total Passes: {currSession.count} </p>
          </div>
        
          <div className="legend">
            <button onClick={() => updateLegend(!show_legend)}> Show Legend </button>
            {show_legend ? <Legend/> : null}
          </div>


          <button onClick={() => {
            console.log(currUser)
            console.log(currSession) 
            }}> 
            log curr user and session
          </button>

          <div>
            <LineChart sessionsList={currUser.sessions}/>
          </div>
        </div>

      : null}
    </div>
    
  );
}

export default App;
