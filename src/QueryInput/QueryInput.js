import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const QueryInput = (props) => {

  return (

    <InputGroup className="mb-3">
      <FormControl
        placeholder="Cypher statement"
        aria-label="Cypher statement"
        aria-describedby="basic-addon2"
      />
      <InputGroup.Append>
        <Button variant="outline-secondary">Query</Button>
      </InputGroup.Append>
    </InputGroup>

  )

}

export default QueryInput;
