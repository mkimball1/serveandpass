function Session(curr_date) {
    this.date = curr_date
    this.passes = {
            "3": 0,
            "2": 0,
            "1": 0,
            0.5: 0,
            "0": 0,
          }
    this.count = 0
    this.total = 0
    this.average = 0
    this.passArray = []
}
export default Session;