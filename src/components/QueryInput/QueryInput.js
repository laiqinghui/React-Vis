import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Row from 'react-bootstrap/Row';  
import Col from 'react-bootstrap/Col';
const QueryInput = (props) => {

    const [queryVal, setQueryVal] = useState("");

    return (

        <Row noGutters>
            <Col xs={11}>
                <TextField
                    style={{ width: "100%" }}
                    id="filled-textarea"
                    label="Database query"
                    placeholder="Input single/multi-line query e.g. MATCH (X) RETURN X"
                    onChange = {event=>setQueryVal(event.target.value)}
                    multiline
                    rows={2}
                    rowsMax={2}
                    variant="outlined"
                />
            </Col>
            <Col xs={1}>
                <Button
                    style ={{ width: "100%", height: "100%" }}
                    variant ="outlined"
                    onClick = {() => props.submit(queryVal)}
                    disabled = {queryVal.length === 0} 
                    >
                    Query
                </Button>
            </Col>
        </Row>

        
    )

}

export default QueryInput;
