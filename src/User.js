import { useState } from 'react';
import Session from './Session';

function User(){
    const [username, setUsername] = useState()
    let sessions = [new Session(), new Session()]
    // sessions[0].incrementPass(3)
    function addSession(newSession){
        sessions.append(newSession)
    }
    return {username, setUsername, sessions, addSession}
}
  
export default User;