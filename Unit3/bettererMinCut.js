const fs = require('fs');
const cloneDeep = require('./node_modules/lodash/cloneDeep.js');

function getData() {
    let data = fs.readFileSync('kargerMinCut.txt', 'utf8');

    if (!data) return [];
    else {
        let roughAr = data.split("\r\n")
            .map(elem => elem.split("\t")
                .filter(ele => ele != "")
                .map(el => el.trim()))
            .filter(el => el.length > 1);

        return roughAr;
    }
}

function processData(roughAr) {
    let nodeHash = {};
    nodeHash.length = roughAr.length;
    nodeHash.nodes = {};
    for (let i = 0; i < roughAr.length; i++) {
        nodeHash.nodes[roughAr[i][0]] = {
            "connects": roughAr[i].slice(1),
            "contains": [roughAr[i][0]],
            "points": roughAr[i][0],
            "contracted": false
        };
    }
    return nodeHash;
}
function getEdges(array) {
    let edges = [];
    let edgesTracker = {};
    for (let i = 0; i < array.length; i++) {

        for (let j = 1; j < array[i].length; j++) {
            if (!edgesTracker[array[i][0] + array[i][j]] && !edgesTracker[array[i][j] + array[i][0]]) {
                edgesTracker[array[i][0] + array[i][j]] = true;
                edges.push([array[i][0], array[i][j]]);
            }

        }
    }
    return edges;
}
function shuffle(current, arr) {
    let i, j;
    i = arr.length - current;
    j = (Math.floor(Math.random() * (i + 1)) + current);

    [arr[current], arr[j]] = [arr[j], arr[current]];
};
// function shuffle(current, arr) {
//     let i, j;
//     for (i = arr.length - 1; i > 0; i--) {
//         j = Math.floor(Math.random() * (i + 1));
//         [arr[i], arr[j]] = [arr[j], arr[i]];
//     }
//     return arr;
// };

function contractEdge(nodesOb, edges, edge) {
    let nodes = nodesOb.nodes;
    let goodEdge = false;
    let n1, n2;
    while (goodEdge === false) {
        if (edges[edge]) {    //make sure edge exists and hasn't been deleted
            [n1, n2] = edges[edge];

            //if node has been contracted will trace it to its current index
            n1 = getFinalNode(n1, nodes);
            n2 = getFinalNode(n2, nodes);

            if (parseInt(n1) == parseInt(n2)) {
                edge++;
            } else {
                goodEdge = true;
            }
        } else {
            edge++
        }
    }
    //pushes later node into earlier node and rewrites later one to refer to combined node
    let min, max;
    if (parseInt(n1) < parseInt(n2)) {
        min = n1;
        max = n2;
    } else {
        min = n2;
        max = n1;
    }
    nodes[min].contains.push(...nodes[max].contains);
    nodes[max].contracted = true;
    nodes[max].contains = null;
    nodes[max].points = min;
    edge++;

    return edge;
};

function removeSelfLoops(node, nodes) {
    let allConnects = [];
    let {
        contains
    } = node;
    for (let n of contains) {
        allConnects.push(...nodes[n].connects)
    }
    let selfLoopCount = 0;
    for (let item of contains) {
        for (let c = 0; c < allConnects.length; c++) {
            if (allConnects[c] == item) {
                [allConnects[selfLoopCount], allConnects[c]] = [allConnects[c], allConnects[selfLoopCount]];
                selfLoopCount++;
            }
        }
    }
    if(selfLoopCount > 0){
        allConnects.splice(0, selfLoopCount)
    }
    
    return allConnects
}

function getFinalNode(id, nodes) {
    //if node being checked has been contracted into another node this will get the index of that node
    if (nodes[id].points != id) {
        return getFinalNode(nodes[id].points, nodes);
    } else {
        return id;
    }
};
function kargerMin(nodesOb, edges) {
    let min;
    let nodes = nodesOb.nodes;
    let counter = nodesOb.length;
    let edgeCounter = 0;
  
    for (counter; counter > 2; counter--) {
        shuffle(edgeCounter,edges);
        edgeCounter = contractEdge(nodesOb, edges, edgeCounter);
    }
 
    let ab = [];
    for (let key in nodes) {

        if (nodes[key].contracted == false) {
            let connections = removeSelfLoops(nodes[key],nodes);
            let finalNode = cloneDeep(nodes[key]);
            finalNode.connects = connections;
            ab.push(finalNode);
        }
        nodes[key].points = key;
        nodes[key].contains = [key];
        nodes[key].contracted = false;
    }
    
    if (ab[0].connects.length === ab[1].connects.length) {
        min = ab[0].connects.length;
    } else {
        min = Infinity;
    }
    return min;
}
let min = Infinity;

let sample = getData();
let edges = getEdges(sample);

let nodes = processData(sample);

for (let i = 0; i < 5000; i++) {
    if (i % 100 == 0) {
        console.time("mili");
    }
    let val = kargerMin(nodes, edges);
    if (i % 100 == 0) {
        console.timeLog("mili");
    }
    if (val < min) {
        min = val;
    }

    if (i % 1000 === 0) {
        console.log(`i = ${i} \nval = ${val}\nmin = ${min} `);


    }
}
console.log(min);