import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash'
import * as actionCreators from '../store/actions/actions';
import DateRangeSlider from '../components/DateRangeSlider/DateRangeSlider'


class DateFilter extends Component {


    componentDidUpdate() {

        console.log("[Filter] updated")

    }

    sliderChange = (left, right) => {

        console.log(left);
        console.log(right);

        this.props.updateFilter("dateFilter", {

            func: this.filterFunction,
            arg: {
                dateLeft: left,
                dateRight: right
            }
        })
    }

    getMinMaxDate = data => {

        let mindateobj = new Date();
        let maxdateobj = new Date("1970-01-01");
        let maxistoday = false;

        let checkMinMax = objs => {

            objs.forEach(obs => {

                if (obs.term_start.length > 0) {

                    if (new Date(obs.term_start) < mindateobj) {

                        mindateobj = new Date(obs.term_start);

                    }

                    // Skip checking term_end if max date is set to today
                    if (maxistoday === false) {

                        if (obs.term_end.length > 0) {

                            if (new Date(obs.term_end) > maxdateobj) {

                                maxdateobj = new Date(obs.term_end);

                            }

                        } else {

                            // Set max date to today if term_start is set but term_end is not set
                            maxdateobj = new Date();
                            maxistoday = true;

                        }

                    }

                }

            });

        }

        checkMinMax(data.nodes);
        checkMinMax(data.edges);

        if (maxdateobj.toDateString() === new Date("1970-01-01").toDateString())
            return null;
        else
            return { min: mindateobj, max: maxdateobj };

    }

    filterFunction = (data, args) => {

        let minDate = args.dateLeft.toString();
        let maxDate = args.dateRight.toString();

        let compareDatesStr = (dateStr1, dateStr2) => {

            let date1 = new Date(dateStr1).setHours(0, 0, 0, 0);
            let date2 = new Date(dateStr2).setHours(0, 0, 0, 0);
            let result = -1;


            if (date1 === date2)
                result = 0;
            else if (date1 < date2)
                result = 1;
            else
                result = 2;


            return result;

        }

        let filteredData = {
            "nodes": [],
            "edges": []
        };

        let baseNodes = data.nodes;
        let baseEdges = data.edges;

        baseNodes.forEach( node => {

            if (node.term_start !== "") {

                if (compareDatesStr(node.term_start, minDate) === 0 || compareDatesStr(node.term_start, minDate) === 1) {

                    if (node.term_end !== "") {

                        if (compareDatesStr(node.term_end, maxDate) === 0 || compareDatesStr(node.term_end, maxDate) === 2) {

                            // Display node if start date is <= min date AND end date is >= max date
                            filteredData.nodes.push(node);
                        }

                    } else {

                        // Display node if start date is defined but end date is not defined
                        filteredData.nodes.push(node);

                    }

                }

            } else {

                // Display node if there is no defined start date
                filteredData.nodes.push(node)

            }

        })

        baseEdges.forEach( edge => {

            if (edge.term_start !== "") {

                if (compareDatesStr(edge.term_start, minDate) === 0 || compareDatesStr(edge.term_start, minDate) === 2) {

                    if (edge.term_end !== "") {

                        if (compareDatesStr(edge.term_end, maxDate) === 0 || compareDatesStr(edge.term_end, maxDate) === 1) {

                            // Display edge if start date is >= min date AND end date is <= max date
                            filteredData.edges.push(edge);
                        }

                    } else {

                        // Display edge if start date is defined but end date is not defined
                        filteredData.edges.push(edge);

                    }

                }

            } else {

                // Display edge if there is no defined start date
                filteredData.edges.push(edge)

            }

        })

        return filteredData;

    }


    render() {

        let currentMinMaxDate = this.getMinMaxDate(this.props.graphDataProp);
        let content = null;

        if (currentMinMaxDate !== null) {

            content = (

                <DateRangeSlider
                    minDate={currentMinMaxDate ? currentMinMaxDate.min : new Date("1970-01-01")}
                    maxDate={currentMinMaxDate ? currentMinMaxDate.max : new Date()}
                    step={24 * 60 * 60}
                    default={{ left: currentMinMaxDate ? currentMinMaxDate.min : new Date("1970-01-01"), right: currentMinMaxDate ? currentMinMaxDate.max : new Date() }}
                    change={this.sliderChange}
                    disabled={currentMinMaxDate === null ? true : false}
                />

            )

        }

        return content;
    }
}

const mapStateToProps = state => {

    return {

        graphDataProp: state.graph.graphData

    }
};

const mapDispatchToProps = dispatch => {
    return {
        // Pass in deep clones of objects as we don't want reducers to work with the original objects
        updateFilter: (filterKey, filter) => dispatch(actionCreators.updateFilter(cloneDeep(filterKey), cloneDeep(filter))),
        updateFilterArguments: (filterKey, filterArguments) => dispatch(actionCreators.updateFilterArguments(cloneDeep(filterKey), cloneDeep(filterArguments)))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DateFilter);

