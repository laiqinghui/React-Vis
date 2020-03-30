import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

class DetailsCard extends Component {

    componentDidUpdate() {

        console.log("[DetailsCard] updated")

    }

    getElementFromID(id, type) {

        let element = null;

        let elements = this.props.graphDataProp[type];

        element = elements.filter(currentEle => {

            return (currentEle.id === id);
        })

        console.log(element)

        return element[0];

    }

    render() {

        let element = null;
        let content = null;

        switch (this.props.selectedElementProp.type) {

            case "node":

                element = this.getElementFromID(this.props.selectedElementProp.id, "nodes");

                content = (
                    <Card.Body>
                        <Card.Title>{element.name != null ? element.name : "Not Defined"}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{element.dblabel != null ? element.dblabel : "Not Defined"}</Card.Subtitle>
                        <ListGroup variant="flush">
                            {Object.keys(element).map(key => 
                            {
                                if( key !== "name" && key !== "dblabel" && key !== "group" && key !== "shape" && key !== "color" && key !== "value" && key !== "label" && element[key] != null )
                                    return (<ListGroup.Item key = {key}>{key + ": " + element[key]}</ListGroup.Item>);
                            })}
                        </ListGroup>
                    </Card.Body>
                );

                break;

            case "edge":

                element = this.getElementFromID(this.props.selectedElementProp.id, "edges");

                content = (
                    <Card.Body>
                        <Card.Title>{element.label}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Relationship</Card.Subtitle>
                        <ListGroup variant="flush">
                            {Object.keys(element).map(key => 
                            {
                                if (key === "from" || key === "to")
                                    return (<ListGroup.Item key = {key}>{key + ": " + this.getElementFromID(element[key], "nodes").name}</ListGroup.Item>);
                                else if(key !== "shape" && key !== "arrows" && element[key] != null )
                                    return (<ListGroup.Item key = {key}>{key + ": " + element[key]}</ListGroup.Item>);
                            })}
                        </ListGroup>
                    </Card.Body>
                );

                break;

            default:


                content = (
                    <Card.Body>
                        <Card.Text>No item selected.</Card.Text>
                    </Card.Body>
                );



        }

        return (
            <Card style={{ width: '100%' }}>
                <Card.Header as="h5">Details</Card.Header>
                {content}
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {

        selectedElementProp: state.graph.selectedElement,
        graphDataProp: state.graph.graphData

    }
};

export default connect(mapStateToProps, null)(DetailsCard);

