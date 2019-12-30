const fs = require('fs');

const getData = () => {
    let data = fs.readFileSync('./IntegerArray.txt', 'utf8');

    if (!data) return [];
    else {
        const numberArr = data.split("\r\n").map(elem => parseInt(elem));
        return numberArr;
    }
}

const mergeSort = (IntArr, length) => {
    if (IntArr.length <= 1) {
        return IntArr;
    }
    let midpt = Math.floor(length / 2);
    let left = IntArr.slice(0, midpt);
    let right = IntArr.slice(midpt, length);

    let sortedL = mergeSort(left, left.length);
    let sortedR = mergeSort(right, right.length);

    return (merge(sortedL, sortedR))

}
const merge = (sortedL, sortedR) => {
    let merged = [];
    let length = sortedL.length + sortedR.length;
    let i = 0;
    let j = 0;

    for (let k = 0; k < length; k++) {
        if (i < sortedL.length && j < sortedR.length) {
            if (sortedL[i] <= sortedR[j]) {
                merged[k] = sortedL[i];
                i++;
            } else if (sortedR[j] < sortedL[i]) {
                merged[k] = sortedR[j];
                j++
            }
        }else {
            if(sortedL[i]){
                merged[k] = sortedL[i]
            } else {
                merged[k] = sortedR[j]
            }
        } 
    }

    return merged

}
numberArr = getData();
let sample = numberArr.slice(0, 10);
console.log(sample)
console.log(mergeSort(numberArr, numberArr.length));

