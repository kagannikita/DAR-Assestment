import {IOrder, TypeOrder} from "../interfaces/IOrder";

export const orders:IOrder[]= [
        {
            type:TypeOrder.baseDrink,
            name: "Cлабая обжарка",
            cost: 1200
        },
        {
            type:TypeOrder.baseDrink,
            name: "Средняя обжарка",
            cost: 1500
        },
        {
            type:TypeOrder.baseDrink,
            name: "Высокая обжарка",
            cost: 1800
        },
        {
            type:TypeOrder.addition,
            name: "Корица",
            cost: 1100
        },
        {
            type:TypeOrder.addition,
            name: "Сироп",
            cost: 2900
        },
        {
            type:TypeOrder.addition,
            name: "Сахар",
            cost: 1200
        },
        {
            type:TypeOrder.serving,
            name: "На месте",
            cost: 0
        },
        {
            type:TypeOrder.serving,
            name: "Собой",
            cost: 0
        },
    ]

