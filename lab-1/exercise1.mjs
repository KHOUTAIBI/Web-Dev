"use strict";

export function fiboIt(n){
    if (n===0 || n===1){
        return n;
    }
    let fibonacci_array = [0,1];
    for (let i = 2; i < n+1 ; i++){
        fibonacci_array.push(fibonacci_array[i-1] + fibonacci_array[i-2]);
    }

    return fibonacci_array[n];
}


export function fibo_rec(n){
    if (n==0 || n==1){
        return n;
    }
    return fibo_rec(n-1) + fibo_rec(n-2)
}

export function fiboArr(number_array){
    let fibonnaci_array = [];
    for (let step = 0; step < number_array.length; step++){
        fibonnaci_array.push(fibo_rec(number_array[step]));
    }
    return fibonnaci_array;
}

export function fibMap(number_array){
    let fibonnaci_array = number_array.map((element) => fibo_rec(element));
    return fibonnaci_array;
}

