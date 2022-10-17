import './style.css'
import { useReducer } from 'react'
import DigitButtons from './components/DigitButtons'
import OperationButtons from './components/OperationButtons'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'choose-operation',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(payload.digit === '0' && state.currOperand === '0') return state
      if(payload.digit === '.' && state.currOperand.includes('.')) return state
      return {
        ...state,
        currOperand: `${state.currOperand || ''}${payload.digit}`
      }
      case ACTIONS.CHOOSE_OPERATION:
        if(state.overwrite){
          return {
            ...state,
            currOperand: payload.digit,
            overwrite: false
          }
        }
        if(state.currOperand == null && state.prevOperand == null) return state
        if(state.currOperand == null){
          return {
            ...state,
            operation: payload.operation
          }
        }

        if( state.prevOperand == null){
          return {
            ...state,
            operation: payload.operation,
            prevOperand: state.currOperand,
            currOperand: null
          }
        }
        return {
          ...state,
          prevOperand: evaluate(state),
          operation: payload.operation,
          currOperand: null
        }
      case ACTIONS.CLEAR:
        return {}

      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite){
          return {
            ...state,
            overwrite: false,
            currOperand: null
          }
        }
        if(state.currOperand == null) return state
        if(state.currOperand.length === 1){
          return {
            ...state,
            currOperand: null
          }
        }
        return {
          ...state,
          currOperand: state.currOperand.slice(0, -1)
        }

      case ACTIONS.EVALUATE:
        if(state.operation == null || 
          state.currOperand == null ||
          state.prevOperand == null){
            return state
          }
        return{
          ...state,
          prevOperand: null,
          operation: null,
          currOperand: evaluate(state),
        }
  }
}

function evaluate({ currOperand, prevOperand, operation}) {
  const prev = parseFloat(prevOperand)
  const curr = parseFloat(currOperand)
  if(isNaN(prev) || isNaN(curr)) return ''
  let compute = ''
  switch (operation) {
    case '+':
      compute = prev + curr
      break
    case '-':
      compute = prev - curr
      break
    case '/':
      compute = prev / curr
      break
    case '*':
      compute = prev * curr
      break
  }
  return compute.toString()
}

// const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
//   maximumFractionDigits: 0,
// })

function App() {
  const [{ currOperand, prevOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="math-grid">
      <div className='output'>
        <div className='prev-output'>{prevOperand} {operation}</div>
        <div className='curr-output'>{currOperand}</div>
      </div>

      <button className='span-two' onClick={ () => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={ () => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>

      <OperationButtons operation='/' dispatch={dispatch} />

      <DigitButtons digit='1' dispatch={dispatch} />
      <DigitButtons digit='2' dispatch={dispatch} />
      <DigitButtons digit='3' dispatch={dispatch} />

      <OperationButtons operation='*' dispatch={dispatch} />

      <DigitButtons digit='4' dispatch={dispatch} />
      <DigitButtons digit='5' dispatch={dispatch} />
      <DigitButtons digit='6' dispatch={dispatch} />

      <OperationButtons operation='+' dispatch={dispatch} />

      <DigitButtons digit='7' dispatch={dispatch} />
      <DigitButtons digit='8' dispatch={dispatch} />
      <DigitButtons digit='9' dispatch={dispatch} />
      
      <OperationButtons operation='-' dispatch={dispatch} />

      <DigitButtons digit='.' dispatch={dispatch} />
      <DigitButtons digit='0' dispatch={dispatch} />
      <button className='span-two' onClick={ () => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
