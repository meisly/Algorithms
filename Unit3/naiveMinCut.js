const fs = require('fs');

function getData() {
    let data = fs.readFileSync('kargerMinCut.txt', 'utf8');

    if (!data) return [];
    else {
        let roughAr = data.split("\r\n").map(elem => elem.split("\t").filter(ele => ele != "" )).filter(el => el.length > 1 );
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
    for(let i = 0; i < array.length; i++){

        for (let j = 1; j < array[i].length; j++){
            if(!edgesTracker[array[i][0]+array[i][j]] && !edgesTracker[array[i][j]+array[i][0]]){
                edgesTracker[array[i][0]+array[i][j]] = true;
                edges.push([parseInt(array[i][0])-1, parseInt(array[i][j])-1])
            }
            
        }
        array[i][0] = [array[i][0]];
    }
    return {nodes: array, edges: edges};
}
function contractEdge(array) {
    let randomEdge = Math.floor(Math.random() * edges.length);
    if ( edges[randomEdge] ){    //make sure edge exists and hasn't been deleted
        let [n1, n2] = edges[randomEdge];
        edges[randomEdge] = false;

        //if node has been contracted will trace it to its current index
        n1 = getFinalNode(n1);
        n2 = getFinalNode(n2);
        //pushes later node into earlier node and rewrites later one to refer to combined node
        if (n1 < n2) {
            array[n1][0] = [...array[n1][0], ...array[n2][0]];
            array[n1] = [...array[n1], ...array[n2].slice(1)];
            array[n2] = [null, n1];
        } else if (n2 < n1 ) {
            array[n2][0] = [...array[n2][0], ...array[n1][0]];
            array[n2] = [...array[n2], ...array[n1].slice(1)];
            array[n1] = [null, n2];
        } else if( n2 == n1) {
            edges[randomEdge] = false;
            contractEdge(array);
        }
    } else {
        edges[randomEdge] = false;
        contractEdge(array);
        
    }
};

function removeSelfLoops(node) {
    let self = node[0];
    let selfLoopCount = 0;
    for( item in self ){
        for(let c = 1; c < node.length; c++){
            if ( node[c] == item ){
                [node[1], node[c]] = [node[c], node[1]];
                selfLoopCount++;
            }
        }
    }
    node.splice(1, selfLoopCount)
}

function getFinalNode(index) {
    //if node being checked has been contracted into another node this will get the index of that node
    if(nodes[index][0] === null ){                      
        return getFinalNode(nodes[index][1]);
    }else {
        return index;
    }
};
function kargerMin() {
    let counter = nodes.length;
    for( counter; counter > 2; counter--){
        contractEdge(nodes);
        if(counter === 4) {
            console.log(nodes)
        }    
    }

}

let sample = getData()
let processed = processData(sample)
let nodes = processed.nodes;
let edges = processed.edges;


let noco = 0;

kargerMin();