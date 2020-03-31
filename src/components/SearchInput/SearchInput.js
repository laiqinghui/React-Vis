import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

class SearchInput extends Component {

    loading = false;

    state = {

        open: false,
        options: [],
        loading: false
        
    }

    componentDidUpdate() {

        //console.log("[SearchInput] updated")
      

    }

    textChangeHandler = event => {

        let graphDataObj = {};
        let graphDataArray = [];

        if(event.target.value === ""){
            this.setState({loading: false});
        } else{

            let queryStatement = this.props.dbConnector.genFullTextQuery(event.target.value);
            this.setState({loading: true});
            (async () => {
                graphDataObj = await this.props.dbConnector.query(queryStatement);
                graphDataArray = this.props.dbConnector.dbToArrayDataParser(graphDataObj);
                this.setState({
                    options: graphDataArray,
                    loading: false
                });
            })()
            


        }

       


    }

    optOnSelectHandler = (event, value) => {

        console.log("Selected: " + value);
        if (value != null)
            this.props.select(value["id(node)"]);

    }

    render() {

        return (

            <Autocomplete
                style={{ width: "100%"}}
                onChange={this.optOnSelectHandler}
                open={this.state.open}
                onOpen={() => {
                    this.setState({ open: true })
                }}
                onClose={() => {
                    this.setState({ open: false })
                }}
                getOptionSelected={(option, value) => console.log(option === value)}
                getOptionLabel={option => option["node.name"]}
                options={this.state.options}
                loading={this.state.loading}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Search by node name"
                        variant="outlined"
                        onChange={this.textChangeHandler}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
        );


    }


}

export default SearchInput;