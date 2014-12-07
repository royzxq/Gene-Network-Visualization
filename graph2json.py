import json
import csv
import networkx as nx
import sys

graph_json = open(sys.argv[1])
description_f = open(sys.argv[2])
f_out = open(sys.argv[3],'w')

chrom = {}
description = {}
for line in csv.reader(description_f,delimiter='\t'):
    if 'GeneID' in line:
        continue
    description[line[2]] = line[7]
    chrom[line[2]] = line[10]


data = json.load(graph_json)


new_data = {}

nodes = data['nodes']

center = [0,0]
scope = 70
links = data['links']
out_degree = {}

source_pool = []
for link in links:
    if link['source'] not in out_degree:
        out_degree[link['source']] = 1
    else:
        out_degree[link['source']] += 1

for link in links:
    link['weight'] = out_degree[link['source']]
count = 0

for node in nodes:
    if count not in out_degree:
        node['r'] = 2
    else:
        node['r'] = out_degree[count]
    count += 1
    node['chrom'] = chrom[node['name']]
    node['descrip'] = description[node['name']]



new_data['nodes'] = nodes
new_data['links'] = links

json.dump(new_data,fout)

