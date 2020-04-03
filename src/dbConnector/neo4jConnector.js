import axios from 'axios';

class Neo4jConnector {

    constructor(hostname, port, username, password) {

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

            Return:
                Promise object which resolves after a successful operation by the AJAX request.
                The user defined callback function with the graph data passed in as argument is called when the data is ready.
        */

        const auth = {
            headers: {
                Authorization: this.AUTHORIZATION
            }

        };

        const cypherobj = {
            "statements": [
                {
                    "statement": cypher,
                    "resultDataContents": ["row", "graph"]
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

        /* 
            User defined data conversion logic to convert database data format to Vis.js propriety format.

            Parameters:
                1) data (object) - The graph data which is in the database format

            Return:
                Object in the vis.js format
        */


        let nodes = {}, edges = {};
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
                shape: 'circle',
                group: nodeLabel,
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

    dbToArrayDataParser = data => {

        let returnArr = [];
        const numofcol = data.results[0].columns.length;
        let count = 0;
        const colindextoname = {};

        data.results[0].columns.forEach(function(col){

            colindextoname[count++] = col;

        });


        returnArr = data.results[0].data.map(function (result) {

            let obj = {}

            for(let i = 0; i < numofcol; i++){

                obj[colindextoname[i]] = result.row[i];

            }

            return obj;

        });

        return returnArr;

    }


    genQueryStatementByID = (id, edges) => {

        /* 
            Generates database specific query statement from node ID

            Parameters:
                1) id (string) - Node id
                2) edges (boolean) - Set to true if edges connected to node are to be return

            Return:
                Database specific query statement
        */

        return  edges ? "MATCH (n)-[r]-(p) WHERE id(n) = " + id + " RETURN n, r, p" : "MATCH (n) WHERE id(n) = " + id + " RETURN n"

    }

    genFullTextQuery = text => {

        /* 
            Generates database specific query for full text search

            Parameters:
                1) text (string) - search query

            Return:
                Database specific query statement
        */

        return "CALL db.index.fulltext.queryNodes(\"name\", \"" + text + "\") YIELD node RETURN node.name, id(node)"

    }



}

export default Neo4jConnector;

