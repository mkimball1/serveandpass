import { useState } from "react";
function Session() {
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
      return {passes, setPasses, count, setCount, average, setAverage, incrementPass}
}
export default Session;