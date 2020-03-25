import React, { Component } from 'react';
//import Graph from 'vis-react';
import Graph from 'react-graph-vis'
import visDriver from '../VisDriver'


class VisGraph extends Component {

    visDriver = null;
    visRef = null;
    
    state = {
        prevQuery: null,
        data: { 
            nodes: [],
            edges: []
        }
    
    }

    componentDidMount(){

        this.visDriver = new visDriver(this.visRef, this.props.dbConnector, this.props.filterFunction, this.props.nodeOptions)

    }

    componentDidUpdate() {

        console.log("[VisGraph] updated.")

        if (this.props.queryStatement !== this.state.prevQuery){


            // this.neo4jc.query(this.props.queryStatement)
            // .then(response => {
            //     console.log(response);
            //     this.setState({
            //         prevQuery: this.props.queryStatement,
            //         data: this.neo4jc.dbToVisDataParser(response)
            //     });
            // })
            // .catch(response => {
            //     console.log("ERROR: ");
            //     console.log(response);
            // })

            this.visDriver.reloadGraph(this.props.queryStatement);



        } 

        
    }

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


    events = {
        select: function(event) {
        var { nodes, edges } = event;
        }
    };

    

    render(){
        return (
            <Graph
                graph={this.state.data}
                //options={this.options}
                events={this.events}
                // style={style}
                getEdges={this.getEdges}
                getNodes={this.getNodes}
                getNetwork={network => {
                    this.visRef = network;
                  }}
            />
        )
    }

}

export default VisGraph;
