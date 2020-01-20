const fs = require('fs');

const getData = () => {
    let data = fs.readFileSync('./QuickSort.txt', 'utf8');

    if (!data) return [];
    else {
        const numberArr = data.split("\r\n").map(elem => parseInt(elem)).filter(el => !isNaN(el));
        
        return numberArr;
    }
}

const partition = (array, left, right) => {
    if(right - left <= 0){
        return;
    }
    let midValIndex = left + 1;
    let checkedBoundIndex = left + 1;

    let swap = array[right];
    array[right] = array[left];
    array[left] = swap;
    
    let pivot = array[left];

    comparisons += (right - left);
    for(checkedBoundIndex; checkedBoundIndex <= right; checkedBoundIndex++){
        comparisons2++;
        if(array[checkedBoundIndex] < pivot){
            let c = array[midValIndex];
            array[midValIndex] = array[checkedBoundIndex];
            array[checkedBoundIndex] = c;
            midValIndex++;
        }

    }

    let d = array[midValIndex - 1];
    array[midValIndex - 1] = array[left];
    array[left] = d;     

    partition(array, left, midValIndex - 2);
    partition(array, midValIndex, right);
}

let comparisons = 0;
let comparisons2 = 0;

let arr = getData();

partition(arr, 0, arr.length-1);
console.log(comparisons);
console.log(comparisons2);
console.log(arr[0]);
console.log(arr.slice(9990));