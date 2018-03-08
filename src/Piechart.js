import React, { Component } from "react";
import * as d3 from "d3";

import { groupByFunc } from "./util";

// borrowed from http://bl.ocks.org/mbostock/5100636
function arcTween(oldData, newData, arc) {
    const copy = { ...oldData };
    return function() {
        const interpolateStartAngle = d3.interpolate(
                oldData.startAngle,
                newData.startAngle
            ),
            interpolateEndAngle = d3.interpolate(
                oldData.endAngle,
                newData.endAngle
            );

        return function(t) {
            copy.startAngle = interpolateStartAngle(t);
            copy.endAngle = interpolateEndAngle(t);
            return arc(copy);
        };
    };
}

class Arc extends Component {
    arc = d3
        .arc()
        .innerRadius(80)
        .outerRadius(150)
        .cornerRadius(8);

    constructor(props) {
        super(props);

        this.state = {
            color: props.color,
            origCol: props.color,
            d: props.d,
            pathD: this.arc(props.d)
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            color: newProps.color,
            pathD: this.arc(newProps.d)
        });

        d3
            .select(this.refs.elem)
            .transition()
            .duration(80)
            .attrTween("d", arcTween(this.state.d, newProps.d, this.arc))
            .on("end", () =>
                this.setState({
                    d: newProps.d,
                    pathD: this.arc(newProps.d)
                })
            );
    }

    hover = () => {
        this.setState({
            color: this.state.color.saturate(2)
        });
    };

    unhover = () => {
        this.setState({
            color: this.state.origCol
        });
    };

    render() {
        const { color, pathD } = this.state;

        return (
            <path
                d={pathD}
                style={{
                    fill: color
                }}
                onMouseOver={this.hover}
                onMouseOut={this.unhover}
                ref="elem"
            />
        );
    }
}

class Piechart extends Component {
    pie = d3
        .pie()
        .value(d => d.amount)
        .sortValues(d => d.tag)
        .padAngle(0.005);

    render() {
        const { data, groupBy, x, y, color } = this.props;

        const _data = groupByFunc(data, groupBy);

        return (
            <g transform={`translate(${x}, ${y})`}>
                {this.pie(_data).map((d, i) => (
                    <g key={d.data.tag}>
                        <Arc d={d} color={color(d)} />
                    </g>
                ))}
                <text x="0" textAnchor="middle">
                    {data.length}
                </text>
                <text y="18" x="0" textAnchor="middle">
                    datapoints
                </text>
            </g>
        );
    }
}

export default Piechart;
