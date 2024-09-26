class User{
  constructor(name, currSession){
    this.username = name
    this.sessions = []
    this.currentSession = currSession
  }
}
  
export default User;