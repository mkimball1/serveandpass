import { useState } from 'react';
import Session from './Session';

function User(){
    const [username, setUsername] = useState()
    // let sessions = []
    let sessions = [new Session(new Date().toLocaleDateString()), new Session(new Date().toLocaleDateString()), new Session("11/14/2023")]
    function addSession(newSession){
        sessions.push(newSession)
    }
    return {username, setUsername, sessions, addSession}
}
  
export default User;