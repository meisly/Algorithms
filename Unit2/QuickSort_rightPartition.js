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
    let mid = Math.floor((right-left)/2);
    let middle = array[mid];

    if (first > last){
        if (first < middle){
            return left;
        }else if (middle > last) {  // if first is biggest then compare middle and last to find median
            return mid;
        }else {
            return right;
        }
    }else if (first > middle ){ //if first is smaller than last it is either smallest or median so compare to middle
        return left;           //if first is smaller than last and larger than middle it must be median
    }else {
        return mid;
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