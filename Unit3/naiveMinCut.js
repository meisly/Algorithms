const fs = require('fs');

const getData = () => {
    let data = fs.readFileSync('kargerMinCut.txt', 'utf8');

    if (!data) return [];
    else {
        let roughAr = data.split("\r\n").map(elem => elem.split("\t").filter(el => el != ''));
        return roughAr;
    }
}
// let nodes = [[# of node/nodes, n connected nodes, n2, n3,...], [# of node/nodes, n connected nodes], ....[]];
// when an edge is contracted, the id of later node is pushed into the id position of the node w/ lower index and connected nodes are added
// the later node is deleted and replaced with [null, position of node containing this node]
// let edges = [[ref, ref], [ref, ref]]

const processData = (array) => {
    let edges = [];
    for(let i = 0; i < array.length; i++){

        for (let j = 1; j < array[i].length; j++){
            edges.push([parseInt(array[i][0])-1, parseInt(array[i][j])-1])
        }
        array[i][0] = [array[i][0]];
    }
    return {nodes: array, edges: edges};
}
const contractEdge = () => {
    let randomEdge = Math.floor(Math.random() * edges.length);
    if (randomEdge){    //make sure edge exists and hasn't been deleted
        [n1, n2] = edges[randomEdge];
        //if node has been contracted will trace it to its current index
        n1 = getFinalNode(n1);
        n2 = getFinalNode(n2);
        //pushes later node into earlier node and rewrites later one to refer to combined node
        if (n1 < n2) {
            array[n1][0] = [array[n1[0]], ...array[n2][0]];
            array[n1] = [array[n1], ...array[n2].slice(1)];
            array[n2] = [null, n1];
        } else if (n2 < n1 ) {
            array[n2][0] = [array[n2][0], ...array[n1][0]];
            array[n2] = [array[n2], ...array[n1].slice(1)];
            array[n1] = [null, n2];
        }
        delete edges[randomEdge];
    } else {
        contractEdge()
    }
};

const removeSelfLoops = (node) => {

}

const getFinalNode = (index) => {
    //if node being checked has been contracted into another node this will get the index of that node
    let goodIndex;
    if(array[index][0] === null ){                      
        goodIndex = getFinalNode(array[index][1]);
    }else {
        return index;
    }
    return goodIndex;
};

let sample = getData().slice(0, 5);
let processed = processData(sample);
console.log(JSON.stringify(processed, null, 2));
