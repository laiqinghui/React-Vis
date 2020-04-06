# React-Vis

Setup:

    1) Install nodejs
    2) Run "npm install" in terminal/cmd for installation of dependencies
    3) Change database IP address and port if needed in app.js file
    4) Optional: Index Ne04j database for full-text search
        Execute in Neo4j browser/cli:
            CALL db.index.fulltext.createNodeIndex("name",["T1Person", "T2Person", "T3Person", "MilitaryLeader", "Cabinet", "Alliance", "Party"],["name"])
    5) Run "npm start" in terminal/cmd to start application

Note:

    - To use application with own data: Change the relevant settings in app.js file under the user-defined parameters section and alter the neo4j database indexing query as required.
    - To use with other database: Supply a database connector to App.js which implement the required methods (use neo4jConnector as reference)
    - To add addtional data filter module: Build module by taking reference from date filter and connect it the filter reducer. Filter can then be selected dynamically in VisGraph.js (In componentDidUpdate liftcycle method). Currently only date filter is implemented.



