const fs = require('fs');

const getData = () => {
    let data = fs.readFileSync('./QuickSort.txt', 'utf8');

    if (!data) return [];
    else {
        const numberArr = data.split("\r\n").map(elem => parseInt(elem)).filter(el => !isNaN(el));
        
        return numberArr;
    }
}
const findMedian = (array, left, right) => {

    let first = array[left];
    let last = array[right];
    let mid = Math.floor((right+left)/2);
    let middle = array[mid];
 
    if((first < middle && middle < last) || (first > middle && middle > last) ){
        return mid;
    } else if((middle > first && first > last) || (middle < first && first < last)){
        return left;
    } else{
        return right;
    }
}
const partition = (array, left, right) => {
    if(right - left <= 0){
        return;
    }
    let midValIndex = left + 1;
    let checkedBoundIndex = left + 1;

    let pivotIn = findMedian(array, left, right);

    let swap = array[pivotIn];
    array[pivotIn] = array[left];
    array[left] = swap;

    let pivot = array[left];

    comparisons += (right - left);
    for(checkedBoundIndex; checkedBoundIndex <= right; checkedBoundIndex++){
      
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


let arr = getData();

partition(arr, 0, arr.length-1);
console.log(comparisons);

