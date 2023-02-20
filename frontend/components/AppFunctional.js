import React, { useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';

const URL = 'http://localhost:9000/api/result';

const formSchema = yup.object().shape({
  formValue: yup.string().email('Ouch: email must be a valid email').required('Ouch: email is required').notOneOf(['foo@bar.baz'], 'foo@bar.baz failure #71' )
})

// Suggested initial states
const initialMessage = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialXPoint = 2
const initialYPoint = 2

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [xPoint, setXPoint] = useState(initialXPoint);
  const [yPoint, setYPoint] = useState(initialYPoint);
  const [index, setIndex] = useState(initialIndex);
  const [movesMade, setMovesMade] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [formValue, setFormValue] = useState('');


  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return (`(${xPoint},${yPoint})`)
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMovesMade(0);
    setIndex(initialIndex);
    setXPoint(initialXPoint);
    setYPoint(initialYPoint);
    setMessage(initialMessage);
    setFormValue('');

  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if(direction === 'up'){
      if (yPoint - 1 === 0){
        setMessage("You can't go up")
        return index;
      } else {
        setYPoint(yPoint - 1)
        setIndex(index - 3)
        setMovesMade(movesMade + 1)
        setMessage(initialMessage)
      }
    }
    if(direction === 'down'){
      if (yPoint + 1 === 4){
        setMessage("You can't go down")
        return index;
      } else {
        setYPoint(yPoint + 1)
        setIndex(index + 3)
        setMovesMade(movesMade + 1)
        setMessage(initialMessage)
      }
    }
    if(direction === 'left'){
      if (xPoint - 1 === 0){
        setMessage("You can't go left")
        return index;
      } else {
        setXPoint(xPoint - 1)
        setIndex(index - 1)
        setMovesMade(movesMade + 1)
        setMessage(initialMessage)
      }
    }
    if(direction === 'right'){
      if (xPoint + 1 === 4){
        setMessage("You can't go right")
        return index;
      } else {
        setXPoint(xPoint + 1)
        setIndex(index + 1)
        setMovesMade(movesMade + 1)
        setMessage(initialMessage)
      }
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    getNextIndex(evt)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setFormValue(evt.target.value)
  }

  const validate = (name, value) => {
    yup.reach(formSchema, name)
    .validate(value)
    .then(() => postRequest())
    .catch(err => setMessage(err.errors[0]))

  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    validate('formValue', formValue);
  }

  function postRequest(){
    const toPost = {
      "x" : xPoint,
      "y" : yPoint,
      "steps" : movesMade,
      "email" : formValue
    }

    axios.post(URL, toPost)
    .then(({data}) => {setMessage(data.message)})
    .finally(setFormValue(''))
  }



  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{`Coordinates ${getXY()}`}</h3>
        <h3 id="steps">{`You moved ${movesMade} ${movesMade === 1 ? 'time' : 'times'}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message" >{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={(e) => move(e.target.id)}>LEFT</button>
        <button id="up" onClick={(e) => move(e.target.id)}>UP</button>
        <button id="right" onClick={(e) => move(e.target.id)}>RIGHT</button>
        <button id="down" data-testid="down" onClick={(e) => move(e.target.id)}>DOWN</button>
        <button id="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="text" placeholder="type email" value ={formValue} onChange={(e) => onChange(e)}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
