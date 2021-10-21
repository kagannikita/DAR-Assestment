export enum TypeOrder{
    baseDrink='baseDrink',
    addition='addition',
    serving='serving'
}

export interface IOrder{
    name:string
    cost:number
    type:string
}
