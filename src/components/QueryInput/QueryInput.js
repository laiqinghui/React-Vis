import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Row from 'react-bootstrap/Row';  
import Col from 'react-bootstrap/Col';
const QueryInput = (props) => {

    const [queryInputRef, setqueryInputRef] = useState(null);

    return (

        // <InputGroup className="mb-3">
        //   <FormControl
        //     placeholder="Cypher statement"
        //     aria-label="Cypher statement"
        //     aria-describedby="basic-addon2"
        //     ref={ref => { setqueryInputRef(ref) }}
        //   />
        //   <InputGroup.Append>
        //     <Button
        //     onClick= {() => props.submit(queryInputRef.value)}
        //     variant="outline-secondary">
        //       Query
        //     </Button>
        //   </InputGroup.Append>
        // </InputGroup>

        <Row>
            <Col xs={11}>
            <TextField
                    style={{ width: "100%" }}
                    id="filled-textarea"
                    label="Database query"
                    // placeholder="Placeholder"
                    variant="outlined"
                />
            </Col>
            <Col>
            <Button
                    style={{ width: "100%" }}
                    variant="contained">
                    Query
                </Button>
            </Col>
        </Row>

        
    )

}

export default QueryInput;
