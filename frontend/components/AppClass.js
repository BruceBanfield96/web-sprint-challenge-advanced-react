import React from 'react';
import axios from 'axios';
import * as yup from 'yup';

const URL = 'http://localhost:9000/api/result'

const formSchema = yup.object().shape({
  formValue: yup.string().email('Ouch: email must be a valid email').required('Ouch: email is required').notOneOf(['foo@bar.baz'], 'foo@bar.baz failure #71')
})

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialX = 2
const initialY = 2


export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(){
    super()
    this.state={
      message: initialMessage,
      email: initialEmail,
      stepsMoved: initialSteps,
      index: initialIndex,
      xPoint: initialX,
      yPoint: initialY,
      formValues: ''

    }
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return (`(${this.state.xPoint},${this.state.yPoint})`)
  }

  //getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
 // }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      stepsMoved: initialSteps,
      index: initialIndex,
      xPoint: initialX,
      yPoint: initialY,
      formValues: ''

    })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if(direction === 'up'){
      if(this.state.yPoint - 1 === 0){
        return ({"xPoint":this.state.xPoint, "yPoint": this.state.yPoint})
      } 
        return ({"xPoint":this.state.xPoint, "yPoint": this.state.yPoint - 1, "index": this.state.index - 3, "stepsMoved": this.state.stepsMoved + 1 })
      
    }
    if(direction === 'down'){
      if(this.state.yPoint + 1 === 4){
        return ({"xPoint":this.state.xPoint, "yPoint": this.state.yPoint})
      }
        return ({"xPoint":this.state.xPoint, "yPoint": this.state.yPoint + 1, "index": this.state.index + 3, "stepsMoved": this.state.stepsMoved + 1 })
      
    }
    if(direction === 'left'){
      if(this.state.xPoint - 1 === 0){
        return ({"xPoint":this.state.xPoint, "yPoint": this.state.yPoint})
      } 
        return ({"xPoint":this.state.xPoint - 1, "yPoint": this.state.yPoint, "index": this.state.index - 1, "stepsMoved": this.state.stepsMoved + 1 })
      
    }
    if(direction === 'right'){
      if(this.state.xPoint + 1 === 4){
        return ({"xPoint":this.state.xPoint, "yPoint": this.state.yPoint})
      } 
        return ({"xPoint":this.state.xPoint + 1, "yPoint": this.state.yPoint, "index": this.state.index + 1, "stepsMoved": this.state.stepsMoved + 1 })
      
    }

  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let nextMove = this.getNextIndex(evt.target.id)
    if (`(${nextMove.xPoint},${nextMove.yPoint})` === this.getXY()){
      return this.setState({message: `You can't go ${evt.target.id}`})
    } else {
      this.setState({...this.state,
      message: initialMessage,
      xPoint: nextMove.xPoint,
      yPoint: nextMove.yPoint,
      stepsMoved: nextMove.stepsMoved,
      index: nextMove.index,
      })
    }
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({formValues: evt.target.value})
  }

  validate =(name,value) => {
    yup.reach(formSchema,name)
    .validate(value)
    .then(() => this.post())
    .catch(err => this.setState({message: err.errors[0]}))
  }

  post = () => {
    const toPost = {
      "x" : this.state.xPoint,
      "y" : this.state.yPoint,
      "steps" : this.state.stepsMoved,
      "email": this.state.formValues
    }
    axios.post(URL, toPost)
    .then(({data}) => {this.setState({message: data.message})})
    .finally(this.setState({formValues: ''}))
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    this.validate('formValue', this.state.formValues)
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{`Coordinates ${this.getXY()}`}</h3>
          <h3 id="steps">{`You moved ${this.state.stepsMoved} ${this.state.stepsMoved === 1 ? 'time' : 'times'}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={(e) => this.move(e)}>LEFT</button>
          <button id="up" onClick={(e) => this.move(e)}>UP</button>
          <button id="right" onClick={(e) => this.move(e)}>RIGHT</button>
          <button id="down" onClick={(e) => this.move(e)}>DOWN</button>
          <button id="reset"onClick={() => this.reset()}>reset</button>
        </div>
        <form onSubmit={this.onSubmit} >
          <input id="email" type="text" placeholder="type email" value={this.state.formValues} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
