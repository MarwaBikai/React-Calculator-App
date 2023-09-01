import logo from './logo.svg';
import './App.css';
import "./styles.css"
import { useReducer } from 'react';

import DigitButton from "./DigitButton";

import OperationButton from "./OperationButton"


export const ACTIONS={
  ADD_DIGIT:"add-digit",
  CLEAR: "clear",
  DELETE_DIGIT:"delete",
  CHOOSE_OPERATION :"choose-operation",
  EVALUATE:"evaluate"



}

//action = {type, payload}
//function reducer(state , action )
//action object having a type and payload props



//HIGHLIGHTS : DISPATCH , ACTION , ABD REDUCERS 

// Dispatching: Dispatching means sending a message to the Redux store, saying, "Hey, something happened, and I want you to update the state accordingly." This "message" is called an action. An action is an object that contains information about what change should happen. For example, it might say "add a digit" or "change the operation."

// Reducer: The reducer is like the "worker" that listens to these messages (actions) and makes the necessary changes to the state based on the information provided in the action. It's a function that takes the current state and the action, and it returns the new state after applying the requested change.

// Here's a simplified version of how these concepts work together:


function reducer(state , {type , payload}){


  // //Inside the switch statement, when the
  //  action type is Actions.ADD_DIGIT,
  //  it updates the currentOperand property of the state.
 
  switch(type){
    case ACTIONS.ADD_DIGIT:

      if (state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false
        }

      }
      if ( payload.digit==="0" && state.currentOperand ==="0")
      return state

      if  (payload.digit==="." && state.currentOperand.includes(".") )
         return state

      return {
        ...state,currentOperand:
        //same state object  using spread operator
        //but update the current operand

        // The currentOperand is updated by
        //  concatenating the existing currentOperand 
        //  (if it exists)
        //  with the new digit provided in the payload.


      `${state.currentOperand || "" }${payload.digit}`,
         
      //${currentOperand || ""} ensures that 
      // even if currentOperand is falsy, it's 
      // represented as an empty
      //  string in the string interpolation.
      }

      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand==null && state.previousOperand==null)
        return state


        if (state.currentOperand ==null){

          return {
            ...state,

            operation : payload.operation

        }
      }

        if ( state.previousOperand ==null ){
          return{
            ...state, 
            operation:payload.operation,
            previousOperand:state.currentOperand,
            currentOperand:null,
          }
        }

     
        return {
          ...state,
          previousOperand:evaluate(state),
          currentOperand:null,
          operation: payload.operation
        }


          // ...state preserves the existing 
          // values of properties in the state
          //  that are not being explicitly modified
          //   in the returned object. Only the operation,
          //    previousOperand, and currentOperand properties 
          //    are updated in the new state.



          // Without the spread operator, you're 
          // replacing the entire state object with a new 
          // object. This might have implications if you have 
          // other properties in your state that are not
          //  included in the returned object.


          // If you update the state without
          //  using the spread operator and you don't 
          //  include a specific property in the returned 
          //  object, that property will be missing in the 
          //  new state object. This is because you're essentially 
          //  creating a new object with only the
          //  properties you specify in the returned object.
        

      case ACTIONS.CLEAR:
        return {} //return nothing empty return
    

      case ACTIONS.EVALUATE:
          if (state.operation==null || state.currentOperand ==null ||
            state.previousOperand == null ){
              return state
            }

            return {
              ...state ,
              overwrite:true,
              previousOperand:null,
              currentOperand: evaluate(state),
              operation:null
            }


        case  ACTIONS.DELETE_DIGIT:

          if (state.overwrite){
            
            return{
              ...state , 
              overwrite:false,
              currentOperand:null
            }

          }

          if (state.currentOperand == null) return state

          if (state.currentOperand.length ===1 ){
            return{...state , currentOperand:null
          }

        }

        return {

          ...state , currentOperand:state.currentOperand.slice(0 ,-1) //take last digit of the operand

        }



    }


  }


  function evaluate( 
    {currentOperand , previousOperand , operation}
    ){
   
    const prev = parseFloat(previousOperand);
    const current =parseFloat(currentOperand);

    if ( isNaN(prev) || isNaN(current))
   
    return {}
   
    let computation=""
   
    switch(operation){

      case "+":
        computation= prev+current
        break

        case "-":
          computation= prev-current
          break

          case "x":
            computation= prev * current
            break

            case "÷":
              computation= prev/current
              break

    }

    return computation.toString()
  }

  const INTEGER_FORMATTER= new Intl.NumberFormat("en-us" , {
    maximumFractionDigit:0,
   });
  

  function formatOperand(operand) {

     if (operand==null){
        return
     } 
  
   const [integer , decimal]= operand.split(".");

    if (decimal==null) 

      return INTEGER_FORMATTER.format(integer)

 
      return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
    
    
    
    }

  
   function App() {

  //state object => { key:value , key:value } or {variables}}
  const [
    { currentOperand , 
    previousOperand , operation } 

    ,dispatch ] =
  useReducer(reducer , {} );

  // dispatch({type:Actions.ADD_DIGIT, payload:{digit:1}} )

  return (

    <div className="calculator-grid">
     
     <div className="output">

     <div className="previous-operand">{formatOperand(previousOperand)}{operation}</div>

      <div className="current-operand">{formatOperand(currentOperand)}</div> 

      </div>

    <button className="span-two"
     onClick={ () => 
      dispatch( {type:ACTIONS.CLEAR}) } >AC</button>

    <button  onClick={
      ()=>
      {
        dispatch({type:ACTIONS.DELETE_DIGIT})
      }}>DEL</button>

    {/* <DigitButton digit="÷" dispatch={dispatch}/> */}
  
    <OperationButton operation="÷" dispatch={dispatch}/>
    <DigitButton digit="1" dispatch={dispatch}/>
    <DigitButton digit="2" dispatch={dispatch}/>
    <DigitButton digit="3" dispatch={dispatch}/>
   


    <OperationButton operation="x" dispatch={dispatch}/>

    <DigitButton digit="4" dispatch={dispatch}/>
    <DigitButton digit="5" dispatch={dispatch}/>
    <DigitButton digit="6" dispatch={dispatch}/>
    
    <OperationButton operation="+" dispatch={dispatch}/>

    <DigitButton digit="7" dispatch={dispatch}/>
     <DigitButton digit="8" dispatch={dispatch}/>
     <DigitButton digit="9" dispatch={dispatch}/>
    
     <OperationButton operation="-" dispatch={dispatch}/>

    <DigitButton digit="." dispatch={dispatch}/>
    <DigitButton digit="0" dispatch={dispatch}/>
    <button className="span-two"
    onClick={
      ()=>
      {
        dispatch({type:ACTIONS.EVALUATE})
      }
    }>=</button>



    </div>


  );
}

export default App;
