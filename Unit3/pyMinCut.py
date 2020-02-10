import random
from copy import deepcopy

def getData():
    graph = {}
    with open('kargerMinCut.txt') as f:
        for line in f:
            split = line.split('\t')
            if len(split) > 2:
                key = split[0]
                connected = [x.strip() for x in split[1:] if x != '\n']
                graph[key] = connected

    return graph
cuts = []


def kargerMinCut(graph):
    while len(graph) > 2:
        v = random.choice(list(graph.keys()))
        w = random.choice(graph[v])
        contract(graph, v, w)
    mincut = len(graph[list(graph.keys())[0]])
    cuts.append(mincut)
    return mincut


def contract(graph, v, w):
    for node in graph[w]:  # merge the nodes from w to v
        if node != v:  # we dont want to add self-loops
            graph[v].append(node)
        graph[node].remove(w)  # delete the edges to the absorbed
        if node != v:
            graph[node].append(v)
    del graph[w]  # delete the absorbed vertex 'w'



def allTheKarger(min):
    graph = getData()
    
    for i in range(200**2 * 5):
        mutGraph = deepcopy(graph)
       
        
        val = kargerMinCut(mutGraph)
        if i % 1000 == 0:
            print("mili")
            print(val)

        if val < min:
            min = val
    return min
min = 10000
min = allTheKarger(min)  
print(min)