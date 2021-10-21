import { TypeOrder} from "../../interfaces/IOrder";
import React from "react";
import styles from "./select.module.scss"
import {orders} from "../../data/CoffeeOrder";
interface SelectProps{
    change:(e: React.ChangeEvent<HTMLSelectElement>)=>void
    type:TypeOrder
}
const Select=({change,type}:SelectProps)=>{

    return(
        <div>
        <select onChange={change} className={styles.selectStyle} required>
        <option/>
        {Object.entries(orders.filter((order)=>order.type===type)).map(([key, value]) => {
        return <option key={key} value={JSON.stringify(value)}>{value.name}</option>
        })}
        </select>
        </div>
    )
}
export default Select
