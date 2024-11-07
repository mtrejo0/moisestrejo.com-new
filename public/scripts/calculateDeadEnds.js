const fs = require('fs');
const path = require('path');

const list = require('../../app/components/internalApps/data/choose_adventure.json');

// Track visited nodes and dead ends
const visited = new Set();
const deadEnds = new Set();

function dfs(nodeId) {
  // Base case - already visited this node
  if (visited.has(nodeId)) {
    return;
  }

  visited.add(nodeId);
  const node = list[nodeId];

  // If node doesn't exist, this is an incomplete path
  if (!node) {
    deadEnds.add(nodeId);
    return;
  }

  // If no choices, this is an ending
  if (!node.choices || node.choices.length === 0) {
    return;
  }

  // Recursively visit all choices
  for (const choice of node.choices) {
    dfs(choice.next);
  }
}

// Start DFS from the beginning node
dfs('start');

// Print results
console.log('Dead ends found:');
deadEnds.forEach(id => {
  // Find parent nodes that lead to this dead end
  const parents = Object.entries(list)
    .filter(([_, node]) => 
      node.choices && 
      node.choices.some(choice => choice.next === id)
    )
    .map(([parentId, _]) => parentId);

  console.log(`${id} (referenced by: ${parents.join(', ')})`);
});
