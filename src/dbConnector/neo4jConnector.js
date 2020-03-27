import axios from 'axios';

class Neo4jConnector {

    constructor(hostname, port, username, password){

        /* 
            Constructor for the Neo4jConnector class.

            Parameters:
                1) hostname (string) - IP address/hostname of Neo4j database
                2) port (int) - Port of Neo4j database
                3) username (string) - Username for authentication with database
                4) password (string) - Password for authentication with database

        */

        // Create the authorization header for the ajax request.
        this.AUTHORIZATION = "Basic " + btoa(username + ":" + password);
        this.hostname = hostname;
        this.port = port;


        


    }

    query = cypher => {

        /* 
            Function to perform a query to the database through AJAX request.

            Parameters:
                1) cypher (string) - Database query statement
        */
   
        const auth = {
            headers:{
                Authorization: this.AUTHORIZATION
            }
            
        };

        const cypherobj = {
            "statements": [
                {
                    "statement": cypher,
                    "resultDataContents" : [ "row", "graph" ]
                }
            ]
        };

        const url = "http://" + this.hostname + ":" + this.port + "/db/data/transaction/commit";

        return (
            new Promise((resolve, reject) => {
            
                    axios.post(url, cypherobj, auth)
                        .then(response => {
                            resolve(response.data);
                        })
                        .catch(response => {
                            reject(response);
                        });

                })
        )

        
    }

    dbToVisDataParser = data => {

        // User defined data conversion logic to convert database data format to Vis.js propriety format.

        const nodes = {}, edges = {};
        data.results[0].data.forEach(function (row) {

        row.graph.nodes.forEach(function (n) {
            if (!nodes.hasOwnProperty(n.id)) {
                nodes[n.id] = n;
            }
        });

        row.graph.relationships.forEach(function (r) {
            if (!edges.hasOwnProperty(r.id)) {
                edges[r.id] = r;
            }
        });
        });

        const nodesArray = [], edgesArray = [];

        for (let p in nodes) {
        if (nodes.hasOwnProperty(p)) {

            nodesArray.push(nodes[p]);
        }
        }

        for (let q in edges) {
        if (edges.hasOwnProperty(q)) {
            edgesArray.push(edges[q])
        }
        }

        var convertedNodes = [];

        nodesArray.forEach(function (node) {

        let nodeLabel = node.labels[0];

        // var displayedLabel = nodeLabel + ("\n" + node.properties["name"]).substr(0, 20);
        convertedNodes.push({
            id: node.id,
            label: node.properties["name"].substr(0, 20),
            group: nodeLabel,
            shape: 'circle',
            //color: nodesColorMap[nodeLabel],
            //value: nodeSizeMap[nodeLabel],
            name: node.properties["name"],
            dblabel: nodeLabel,
            term_start: "term_start" in node.properties ? node.properties.term_start : "",
            term_end: "term_end" in node.properties ? node.properties.term_end : ""
        })

        });

        const convertedEdges = [];

        edgesArray.forEach(function (edge) {

        convertedEdges.push({
            id: edge.id,
            from: edge.startNode,
            to: edge.endNode,
            label: edge.type.replace(/_/g, " "),
            arrows: 'to',
            term_start: "term_start" in edge.properties ? edge.properties.term_start : "",
            term_end: "term_end" in edge.properties ? edge.properties.term_end : ""
        })

        });


        const visData = {
            nodes: convertedNodes,
            edges: convertedEdges
        };

        return visData;

      }

    

}

export default Neo4jConnector;

