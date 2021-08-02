//--------------------------------------------------Vis Driver Class--------------------------------------------------------------------
/*
    This class handles all the logic that bridges user applications and user defined data base to Vis.js
*/
class VisDriver {

    constructor(visRef, dbconnector, nodeOptions) {

        /* 
            Constructor for the VisDriver class.

            Parameters:
                1) viewportid (string) - HTML div ID which the canvas will be drawn.
                2) dbconnector (object) - User specified data based connector, user will provide the implementaion of the connector logic
                for the type of database used in the project. For decoupling of data base logic.
                3) nodeOptions (object) - Options to define the nodes size and color according to its label
        */

        this.dbconnector = dbconnector;
        this.dataParser = dbconnector.dbToVisDataParser;
        this.nodeOptions = nodeOptions;
        this.dataFilter = null;
        // House the state of pre-filtered data which is to be rendered
        this.data = {
            nodes: [],
            edges: []
        }
        // Option to define the physics prperties if physics is turn on
        this.physicsOnOpt = {
            autoResize: true,
            nodes: {
                shape: 'dot',
            },
            physics: {
                enabled: true,
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    centralGravity: 0.002,
                    springConstant: 0.08,
                    springLength: 500,
                    damping: 0.4,
                    avoidOverlap: 1
                },

                maxVelocity: 100,
                minVelocity: 1,
                solver: 'forceAtlas2Based',
                stabilization: {
                    enabled: true,
                    iterations: 1000,
                    updateInterval: 100,
                    onlyDynamicEdges: false,
                    fit: true
                },
                timestep: 1,
                adaptiveTimestep: true,
            },
            layout: {
                randomSeed: undefined,
                improvedLayout: true,
                clusterThreshold: 150
            },
            // configure: {
            //     enabled: true,
            //     filter: 'nodes,edges',
            //     container: undefined,
            //     showButton: true
            // }


        };// end of physics on options
        // Turn off physics
        this.physicsOffOpt = {
            autoResize: true,
            nodes: {
            },
            physics: {
                enabled: false,
            },
            layout: {
                randomSeed: undefined,
                improvedLayout: true,
                //clusterThreshold: 150
            }


        };// end of options
        // Node id which graph should be focus on, user can set it when setting the data state
        this.focusNodeId = null;
        this.network = visRef;

        this.turnOnPhysics(this.physicsOnOpt);

    }// end of constructor

    setFocusNode = id => {

        this.focusNodeId = id;

    }

    turnOnPhysics = () => {

        // Turn on physics for stabilization animation
        this.network.setOptions(this.physicsOnOpt);

    }

    turnOffPhysics = () => {

        this.network.setOptions(this.physicsOffOpt);
    }

    focusGraph = () => {

        if (this.focusNodeId !== null) {

                this.network.focus(this.focusNodeId, {
                    scale: 1.5,
                    locked: false,
                    animation: {
                        duration: 1000,
                        easingFunction: "easeOutQuad"
                    }
                });

                this.network.selectNodes([this.focusNodeId], true);

        } else {

            this.network.fit({
                animation: {
                    duration: 500,
                    easingFunction: "easeOutQuad"
                }
            })

        }


    }

    clearGraph = () => {

        /* 
            Function to clear the graph.
        */

        this.focusNodeId = null;
        this.data = {
            nodes: [],
            edges: []
        }

        this.setAndRenderGraphData();
        return this.data;

    }// end of clearGraph

    setAndRenderGraphData = () => {

        /* 
            Function to set the filtered data for rendering according to user defined filter function (if defined/required).
            User can choose whether to focus the camera on a specific node after the graph renders by setting the focusNodeId 
            instance variable with a node id.
        */

        let key = -1;
        let prevpositions = this.network.getPositions();
        let filteredData = null;

        this.turnOnPhysics();

        if (prevpositions.length > 0) {

            // Preserve nodes coordinates for redrawing them on same position
            for (let i = 0; i < this.data["nodes"].length; i++) {

                key = this.data["nodes"][i]["id"]
                this.data["nodes"][i]["x"] = prevpositions[Number(key)].x;
                this.data["nodes"][i]["y"] = prevpositions[Number(key)].y;

            }

        }

        if (this.dataFilter != null) {

            filteredData = this.dataFilter.func(this.data, this.dataFilter.arg);
            this.network.setData(filteredData);

        } else {

            this.network.setData(this.data);
        }

        this.focusGraph();
        


    }// end of setAndRenderGraphData

    updateGraphData = (data, focusNodeId) => {


        /* 
            Function to update the current data state which will be use for filtering. 
            User can choose whether to focus the camera on a specific node after the graph renders by specifying a node id.
            The coordinates of the existing nodes will be preserved 
            This function will render the graph by calling setAndRenderGraphData function after updating the data state.


            Parameters:
                1) data (object) - Data object in the Vis format consisting of nodes and edges which are to be added to the existing graph
                2) focusNodeId (string) - id of node to be focus on in string format, use if the graph is to be focus on a particular node
        */


        const distfromselectednodepos = 500;
        let newNodes = data["nodes"]
        let newEdges = data["edges"]
        let exist = false;
        let randangle, newx, newy, selectednodepos, currentViewPosition;

        // Get coordinates of node to be focus on
        if (focusNodeId != null)
            selectednodepos = this.network.getPositions(focusNodeId);


        // Skip the process of checking for existing nodes coordinates as there is no existing nodes (clean canvas)
        if (this.data["nodes"].length === 0) {

            for (let i = 0; i < newNodes.length; i++)
                this.data["nodes"].push(newNodes[i]);

            for (let i = 0; i < newEdges.length; i++)
                this.data["edges"].push(newEdges[i]);

            this.setAndRenderGraphData();

            return;

        }

        // Add new nodes to exisitng library of nodes
        for (let i = 0; i < newNodes.length; i++) {

            for (let j = 0; j < this.data["nodes"].length; j++) {

                if (this.data["nodes"][j]["id"] === newNodes[i]["id"]) {
                    exist = true;
                    break;
                }

            }

            // Insert nodes only if the node does not exist in the rendered graph
            if (exist === false) {

                // set rendered position to a set distance from a selected node, of a random angle
                if (focusNodeId != null) {

                    randangle = Number((Math.random() * (0 - 2 * Math.PI) + 2 * Math.PI).toFixed(4));
                    newx = distfromselectednodepos * Math.cos(randangle) + selectednodepos[Number(focusNodeId)].x;
                    newy = distfromselectednodepos * Math.sin(randangle) + selectednodepos[Number(focusNodeId)].y;
                    newNodes[i]["x"] = newx;
                    newNodes[i]["y"] = newy;

                } else {

                    // set rendered position to current view position if no focus node is set.
                    currentViewPosition = this.network.getViewPosition();
                    newNodes[i]["x"] = currentViewPosition.x;
                    newNodes[i]["y"] = currentViewPosition.y;

                }

                // append new node into current state data
                this.data["nodes"].push(newNodes[i]);

            }

            exist = false;

        }

        // Add new edges 
        for (let i = 0; i < newEdges.length; i++) {

            for (let j = 0; j < this.data["edges"].length; j++) {

                if (this.data["edges"][j]["id"] === newEdges[i]["id"]) {
                    exist = true;
                    break;
                }

            }
            if (exist === false)
                this.data["edges"].push(newEdges[i]);
                
            exist = false;

        }

        

        if (focusNodeId != null) {

            // Focus on the double-clicked node
            this.focusNodeId = focusNodeId;
            


        } else {

            // Focus on the newly added node from text query
            this.focusNodeId = newNodes[0].id.toString();

        }

        this.setAndRenderGraphData()

    }// end of updateGraphData

    reloadGraph = querystatement => {

        /* 
            Function to directly overwrite graph with results return from a database query. Wrapped a async operation, 
            therefore implements and return a promise.

            Parameters:
                1) The database specific query statement to be execute by the database connector

            Return:
                Promise object which resolves after a successful operation by the dbconnector (after db query operation resolves).
                The user defined callback function with the graph data passed in as argument is called when the data is ready. 
        */
        return (
            new Promise((resolve, reject) => {

                this.dbconnector.query(querystatement)
                    .then(data => {

                        this.data = this.setNodesColorAndSize(this.dataParser(data));
                        resolve(this.data);
                        this.focusNodeId = null;
                        this.setAndRenderGraphData();

                    })
                    .catch(errorResponse => reject(errorResponse));

            })
        )




    }// end of reloadGraph

    updateGraph = (queryStatement, selectednodeid) => {

        /* 
            Function to update (add to existing) graph with results return from a database query. Wrapped a async operation, 
            therefore implements and return a promise.

            Parameters:
                1) querystatement (string) - Data base specific query string
                2) selectednodeid (string) - Optional ID of a node with is to be focus on after graph rendering

            Return:
                Promise object which resolves after a successful operation by the dbconnector (after db query operation resolves).
                The user defined callback function with the graph data passed in as argument is called when the data is ready. 
        */

        return (
            new Promise((resolve, reject) => {

                this.dbconnector.query(queryStatement)
                    .then(data => {

                        let visData = this.setNodesColorAndSize(this.dataParser(data));
                        this.updateGraphData(visData, selectednodeid);
                        resolve(this.data)

                    })
                    .catch(errorResponse => reject(errorResponse));

            })
        )

    }// end of updateGraph

    updateNodesPosition = nodes => {

        // Not used: KIV
        for (let i = 0; i < nodes.length; i++) {

            for (let j = 0; j < this.data["nodes"].length; j++) {

                if (this.data["nodes"][j]["id"] === nodes[i]["id"]) {
                    this.data["nodes"][j]["x"] = nodes[i]["id"]["x"];
                    break;
                }

            }

        }

        this.network.setData(this.data);
    }// end of updateNodesPosition

    setNodesColorAndSize = data => {


        /* 
            Function to set the color and scale of the nodes by adding relevant attributes to the graph data object

            Parameters:
                1) data (object) - Graph data in vis format
        */

        data.nodes.forEach((node, index, nodes) => {

            nodes[index].color = this.nodeOptions.nodesColorMap[node.dblabel];
            nodes[index].value = this.nodeOptions.nodeSizeMap[node.dblabel] ? this.nodeOptions.nodeSizeMap[node.dblabel] : 25 ;
            nodes[index].size = this.nodeOptions.nodeSizeMap[node.dblabel] ? this.nodeOptions.nodeSizeMap[node.dblabel] : 25 ;

        });

        return data;

    }

    setDataFilter = filter => {

        this.dataFilter = filter;

    }
}

export default VisDriver;


        //--------------------------------------------------------------------------------------------------------------------------------------