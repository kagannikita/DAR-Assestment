import {TypeOrder} from "../../interfaces/IOrder";
import * as React from "react";
import Select from "../Select/Select";
import styles from './form.module.scss'
import {useOrder} from "../../context/OrderContext";

const Form=()=>{
    const[submit,setSubmit]=React.useState(false)
    const {dispatch} = useOrder()
    const changeOrder=(event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if(!submit)
        dispatch({type:'order',payload:value})
    };

    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        if(submit) alert("Заказ менять нельзя")
        dispatch({type:'sum',payload:''})
        e.preventDefault()
        setSubmit(true)
    }

    return(
            <div className={styles.card}>
                <div className={styles.cardImage}>
                    <h2 className={styles.cardHeading}>
                        Make order
                        <small>for your coffee</small>
                    </h2>
                </div>
                <form className={styles.cardForm} onSubmit={handleSubmit}>
                    <label  htmlFor="baseDrink">
                        Вид базового напитка:
                    </label>
                    <Select  change={changeOrder}  type={TypeOrder.baseDrink}/>
                    <label  htmlFor="Addition">
                        Дополнение к напитку:
                    </label>
                    <Select  change={changeOrder}  type={TypeOrder.addition}/>
                    <label htmlFor="serving">
                        Сервировка:
                    </label>
                    <Select  change={changeOrder}  type={TypeOrder.serving}/>
                    <button className={styles.orderBtn} type="submit">Order</button>
                </form>
            </div>
    )
}
export default Form
