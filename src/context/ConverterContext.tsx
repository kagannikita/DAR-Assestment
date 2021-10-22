import * as React from 'react'
import {converterDecimalToModular, converterModularToDecimal} from "../functions/converter";

interface ContextProps{
    children:React.ReactNode
}

interface Action {
    type: 'decimal'|'modular'
    number: number[]
    modules:number[]
}

type Dispatch = (action: Action) => void
type State = {result:number[]}

const Context = React.createContext<{state: State; dispatch:  Dispatch}>
({state:{result:[]},dispatch:()=>{}})

const converterReducer=(state:State, action:Action)=> {
    switch (action.type) {

        case 'modular': {
            return {result: converterModularToDecimal(action.number,action.modules)}
        }
        case 'decimal': {
            return {result: converterDecimalToModular(action.modules,action.number)}
        }
        default: {
            throw new Error(`Unhandled action type: ${(action as Action).type}`)
        }
    }
}

const ConverterContext=({children}:ContextProps)=>{
    const [state, dispatch] = React.useReducer(converterReducer,{result:[]})
    const value = {state, dispatch}
    return <Context.Provider value={value}>{children}</Context.Provider>
}

const useConverter=()=> {
    const context = React.useContext(Context)
    if (context === undefined) {
        throw new Error('useOrder must be used within a OrderProvider')
    }
    return context
}

export {ConverterContext,useConverter}
