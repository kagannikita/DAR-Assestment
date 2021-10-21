import * as React from 'react'
import {IOrder} from "../interfaces/IOrder";


interface ContextProps{
    children:React.ReactNode
}

interface Action {
    type: 'order' | 'sum';
    payload: string
}

type Dispatch = (action: Action) => void
type State = {sum: number,orders:IOrder[]}

const Context = React.createContext<{state: State; dispatch: Dispatch}>
({state:{orders:[],sum:0},dispatch:()=>{}})

const takeOrder=(state:State,action:Action)=>{
    const clone = [...state.orders];
    const index = clone.findIndex((item) => {
        return item.type === JSON.parse(action.payload).type;
    });
    if (index === -1) {
        clone.push(JSON.parse(action.payload));
    } else {
        clone.splice(index, 1, JSON.parse(action.payload));
    }
    return clone;
}

const orderReducer=(state:State, action:Action)=> {
    switch (action.type) {
        case 'order': {
            return {orders: takeOrder(state,action),sum:state.sum}
        }
        case 'sum': {
            return {orders:state.orders,sum:Object.values(state.orders).reduce((a, {cost}) => a + cost, 0)}
        }
        default: {
            throw new Error(`Unhandled action type: ${(action as Action).type}`)
        }
    }
}

const OrderContext=({children}:ContextProps)=>{
    const [state, dispatch] = React.useReducer(orderReducer, {orders: [],sum:0})
    const value = {state, dispatch}
    return <Context.Provider value={value}>{children}</Context.Provider>
}

const useOrder=()=> {
    const context = React.useContext(Context)
    if (context === undefined) {
        throw new Error('useOrder must be used within a OrderProvider')
    }
    return context
}

export {OrderContext,useOrder}
