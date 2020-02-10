const fs = require('fs');

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
    let finalAr =[];
        
    for(let i = 0; i < roughAr.length; i++){
        let nodeHash = {
            ids: [roughAr[i][0]],
            connects: roughAr[i].slice(1),
            points: null
        };
        finalAr[i] = nodeHash;
    }
    return finalAr;
}
function getEdges(array) {
    let edges = [];
    let edgesTracker = {};
    for (let i = 0; i < array.length; i++) {

        for (let j = 1; j < array[i].length; j++) {
            if (!edgesTracker[array[i][0] + array[i][j]] && !edgesTracker[array[i][j] + array[i][0]]) {
                edgesTracker[array[i][0] + array[i][j]] = true;
                edges.push([parseInt(array[i][0]) - 1, parseInt(array[i][j]) - 1]);
            }

        }
    }
    return edges;
}
function shuffle(arr) {
    let i, j;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

function contractEdge(array, edges, edge) {

    let goodEdge = false;
    let n1, n2;
    while (goodEdge === false) {
        if (edges[edge]) {    //make sure edge exists and hasn't been deleted
            [n1, n2] = edges[edge];

            //if node has been contracted will trace it to its current index
            n1 = getFinalNode(n1, array);
            n2 = getFinalNode(n2, array);

            if (n1 == n2) {
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
    if (n1 < n2) {
        min = n1;
        max = n2;
    } else {
        min = n2;
        max = n1;
    }
    array[min].ids.push(...array[max].ids);
    array[min].connects.push(...array[max].connects);
    
    array[max].ids = null;
    array[max].connects = null;
    array[max].points = min;
    edge++;

    return edge;
};

function removeSelfLoops(node) {
    let {
        ids,
        connects
    } = node;

    let selfLoopCount = 0;
    for (let item of ids) {
        for (let c = 0; c < connects.length; c++) {
            if (connects[c] == item) {
                [connects[selfLoopCount], connects[c]] = [connects[c], connects[selfLoopCount]];
                selfLoopCount++;
            }
        }
    }

    connects.splice(1, selfLoopCount)
}

function getFinalNode(index, nodes) {
    //if node being checked has been contracted into another node this will get the index of that node
    if (nodes[index].ids === null) {
        return getFinalNode(nodes[index].points, nodes);
    } else {
        return index;
    }
};
function kargerMin(nodes, edges) {
    let min;
    let counter = nodes.length;
    edges = shuffle(edges);
    let edgeCounter = 0;
    for (counter; counter > 2; counter--) {
        edgeCounter = contractEdge(nodes, edges, edgeCounter);
    }
    let ab = [];
    for (let i = 0; i < nodes.length; i++) {

        if (nodes[i].ids != null) {
            removeSelfLoops(nodes[i]);
            ab.push(nodes[i]);
        }
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

for (let i = 0; i < 200 ** 2 * Math.log(200); i++) {
    if (i % 1000 == 0) {
        console.time("mili");
    }

    let nodes = processData(sample);
    let val = kargerMin(nodes, edges);
    if (i % 1000 == 0) {
        console.timeLog("mili");
    }
    if (val < min) {
        min = val;
    }

    if (i % 1000 === 0) {
        console.log(`i = ${i} \nmin = ${min} `);

    }
}
console.log(min);