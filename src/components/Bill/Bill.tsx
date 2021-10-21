import styles from './bill.module.scss'
import {useOrder} from "../../context/OrderContext";


const Bill=()=>{
    const {state}=useOrder()
    if (state.sum!==0) {
        return (<div className={styles.bill}>
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td><h2>Item</h2></td>
                        <td><h2>Sub Total</h2></td>
                    </tr>
                    {state.orders.map((info)=>{
                        return(
                            <tr key={info.type}>
                                <td><p className="itemtext">{info.name}</p></td>
                                <td><p className="itemtext">{info.cost} ₸</p></td>
                            </tr>
                        )
                    })}
                    <tr>
                        <td><h2>Total</h2></td>
                        <td><h2>{state.sum} ₸</h2></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>)
    }
    return (<div/>)
}
export default Bill
