import React, { Component } from 'react';
import Graph from 'vis-react';

class VisGraph extends Component {

  graph = {
    nodes: [
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ]
 };

  options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: '#000000'
    },
      interaction: { hoverEdges: true }
 };

  events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
 };

  render(){

    return (
      <Graph
        graph={this.graph}
        options={this.options}
        events={this.events}
        // style={style}
        getNetwork={this.getNetwork}
        getEdges={this.getEdges}
        getNodes={this.getNodes}
        vis={vis => (this.vis = vis)}
      />

    )

  }

}

export default VisGraph;
