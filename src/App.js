import React, { useState } from 'react';
import './App.css';

function App() {
  const [passes, setPasses] = useState({
    "3": 0,
    "2": 0,
    "1": 0,
    "0": 0,
  })

  const [count, setCount] = useState(0)
  const [average, setAverage] = useState(0)

  function incrementPass(passKey) {
    setPasses((currentPasses) => {
      const updatedPasses = {
        ...currentPasses,
        [passKey]: currentPasses[passKey] + 1,
      };
      let total = 0;
      let new_count = 0;
      for (const key in updatedPasses) {
        total += updatedPasses[key] * parseInt(key, 10);
        new_count += updatedPasses[key];
      }
      setAverage(total / new_count);
      setCount(new_count)
      return updatedPasses;
    });
  }

  return (
    <div className="container">  
      <div className="button_container">
        <button onClick={() => incrementPass('3')}> 3 </button>
        <button onClick={() => incrementPass('2')}> 2 </button>
        <button onClick={() => incrementPass('1')}> 1 </button>
        <button onClick={() => incrementPass('0')}> 0 </button>
      </div>
      <div className="stats">
        <p> 3: {passes["3"]}</p>
        <p> 2: {passes["2"]}</p>
        <p> 1: {passes["1"]}</p>
        <p> 0: {passes["0"]}</p>
        <p> Average: {average.toFixed(2)}</p>
        <p> Total Passes: {count} </p>
      </div>
      <div>
        <p> 3: Perfect pass, can set middle</p>  
        <p> 2: Good pass, can set pins but not middle</p>  
        <p> 1: Bad pass, Out of System / Overpass</p>  
        <p> 0: Aced </p>  
      </div>
    </div>
  );
}

export default App;
