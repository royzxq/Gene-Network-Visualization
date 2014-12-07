import os
import sys
import json
import re

adjfile = sys.argv[1]
gene_ID = sys.argv[2]
graph = sys.argv[3]

f_adj = open(adjfile)
f_id = open(gene_ID)
f_graph = open(graph,'w')

nodes = []
links = []


# F_genID = open('./data/genename3000.txt','r')

# F_out = open('./data/graph3000.json','w')
count = 0
for line in f_id:
	line = line.strip()
	line = re.sub('[!@#$""]', '', line)
	if 'name' in line:
		continue
	node = {}
	node['name'] = int(line)
	node['id'] = count
	count += 1
	nodes.append(node)

count = 0
for line in f_adj:
	line = line.strip()
	line = line.split(',')
	for i in range(len(line)):
		if line[i] == 0:
			continue
		link = {}
		link['source'] = count
		link['target'] = i
		links.append(link)
	count += 1

data = {}
data['nodes'] = nodes
data['links'] = links

json.dump(data,f_graph)