
const mulInv=(a:number, b:number)=> {
    const b0 = b;
    let [x0, x1] = [0, 1];

    if (b === 1) {
        return 1;
    }
    while (a > 1) {
        const q = Math.floor(a / b);
        [a, b] = [b, a % b];
        [x0, x1] = [x1 - q * x0, x0];
    }
    if (x1 < 0) {
        x1 += b0;
    }
    return x1;
}
// Китайская теорема об остатках модульное=>десятичное
export const converterModularToDecimal=(num:number[], rem:number[])=> {
    let sum = 0;
    const prod = rem.reduce((a, c) => a * c, 1);
    for (let i = 0; i < rem.length; i++) {
        const [ni, ri] = [rem[i], num[i]];
        const p = Math.floor(prod / ni);
        sum += ri * p * mulInv(p, ni);
    }
    return [sum % prod];
}

// Китайская теорема об остатках десятичное=>модульное
export const converterDecimalToModular=(modules:number[],number:number[]):number[]=>{
   const result: number[]=[]
    modules.forEach((module)=>{
        result.push(number[0]%module)
    })
  return result
}
