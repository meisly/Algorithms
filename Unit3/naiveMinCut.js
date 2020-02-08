const fs = require('fs');

function getData() {
    let data = fs.readFileSync('kargerMinCut.txt', 'utf8');

    if (!data) return [];
    else {
        let roughAr = data.split("\r\n").map(elem => elem.split("\t").filter(ele => ele != "").map(el => el.trim())).filter(el => el.length > 1);
        return roughAr;
    }
}
// let nodes = [[id/list of ids], n connected nodes, n2, n3,...], [# of node/nodes, n connected nodes], ....[]];
// when an edge is contracted, the id of later node is pushed into the id position of the node w/ lower index and connected nodes are added
// the later node is deleted and replaced with [null, position of node containing this node]
// let edges = [[ref, ref], [ref, ref]]

function processData(array) {
    let edges = [];
    let edgesTracker = {};
    for (let i = 0; i < array.length; i++) {

        for (let j = 1; j < array[i].length; j++) {
            if (!edgesTracker[array[i][0] + array[i][j]] && !edgesTracker[array[i][j] + array[i][0]]) {
                edgesTracker[array[i][0] + array[i][j]] = true;
                edges.push([parseInt(array[i][0]) - 1, parseInt(array[i][j]) - 1])
            }

        }
        array[i][0] = [array[i][0]];
    }
    return { nodes: array, edges: edges };
}
function contractEdge(array, edges) {
    let randomEdge = Math.floor(Math.random() * edges.length);
    let goodEdge = false;
    let n1, n2;
    while (goodEdge === false) {
        if (edges[randomEdge]) {    //make sure edge exists and hasn't been deleted
            [n1, n2] = edges[randomEdge];
            edges[randomEdge] = false;

            //if node has been contracted will trace it to its current index
            n1 = getFinalNode(n1, array);
            n2 = getFinalNode(n2, array);

            if (n1 == n2) {
                randomEdge = (randomEdge + 1) % edges.length;
            } else {
                goodEdge = true;
            }
        } else {
            randomEdge = (randomEdge + 1) % edges.length;
        }
    }
    //pushes later node into earlier node and rewrites later one to refer to combined node
    if (n1 < n2) {
        array[n1][0] = [...array[n1][0], ...array[n2][0]];
        array[n1] = [...array[n1], ...array[n2].slice(1)];
        array[n2] = [null, n1];
    } else if (n2 < n1) {
        array[n2][0] = [...array[n2][0], ...array[n1][0]];
        array[n2] = [...array[n2], ...array[n1].slice(1)];
        array[n1] = [null, n2];
    }
    return array;
};

function removeSelfLoops(node) {
    let self = node[0];
    let selfLoopCount = 0;
    for (let item of self) {
        for (let c = 1; c < node.length; c++) {
            if (node[c] == item) {
                [node[selfLoopCount + 1], node[c]] = [node[c], node[selfLoopCount + 1]];
                selfLoopCount++;
            }
        }
    }
    
    node.splice(1, selfLoopCount)
}

function getFinalNode(index, nodes) {
    //if node being checked has been contracted into another node this will get the index of that node
    if (nodes[index][0] === null) {
        return getFinalNode(nodes[index][1], nodes);
    } else {
        return index;
    }
};
function kargerMin(nodes, edges) {
    let min;
    let counter = nodes.length;
    for (counter; counter > 2; counter--) {
        nodes = contractEdge(nodes, edges);
        if (counter === 4) {

        }
    }
    let ab = [];
    for (let i = 0; i < nodes.length; i++) {

        if (nodes[i].length > 2) {
            // console.log(`before: ${nodes[i].length-1}`);
            removeSelfLoops(nodes[i]);

            // console.log(`after: ${nodes[i].length-1}`)

            // console.log(nodes[i].slice(1));
            ab.push(nodes[i]);
        }
    }
    if (ab[0].length === ab[1].length) {
        min = ab[0].length;
    } else {
        min = Infinity;
    }
    return min;
}
let min = Infinity;




for (let i = 0; i < 200**2 * Math.log(200); i++) {
    if( i % 1000 == 0){
        console.time("mili");
    }
    let sample = getData()
    let processed = processData(sample)
    let {nodes, edges } = processed;
    let val = kargerMin(nodes, edges);
    if( i % 1000 == 0){
        console.timeLog("mili");
    }
    if (val < min) {
        min = val;
    }
    if(i % 100 === 0){
        console.log(`i = ${i} \nmin = ${min} `)
    }
}
console.log(min);