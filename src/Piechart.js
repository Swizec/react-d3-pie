import React, { Component } from "react";
import _ from "lodash";
import * as d3 from "d3";
import * as chroma from "chroma-js";
import styled from "styled-components";

const Arc = styled.path`
    cursor: pointer;
`;

class Piechart extends Component {
    pie = d3
        .pie()
        .value(d => d.amount)
        .sortValues(d => d.tag)
        .padAngle(0.005);
    arc = d3
        .arc()
        .innerRadius(80)
        .outerRadius(150)
        .cornerRadius(8);
    color = chroma.scale("PuBu");

    clickArc({ data: { tag, amount } }) {
        console.log(`$${amount} for ${tag} in the last 12 months`);
    }

    render() {
        const { data, groupBy, x, y } = this.props;

        const _data = Object.entries(_.groupBy(data, groupBy)).map(
            ([tag, values]) => ({
                tag,
                amount: values.map(d => d.amount).reduce((m, n) => m + n, 0)
            })
        );
        this.color.colors(Object.keys(_data).length);

        return (
            <g transform={`translate(${x}, ${y})`}>
                {this.pie(_data).map((d, i) => (
                    <g>
                        <Arc
                            d={this.arc(d)}
                            style={{
                                fill: this.color(i / Object.keys(_data).length)
                            }}
                            onClick={() => this.clickArc(d)}
                        />
                    </g>
                ))}
            </g>
        );
    }
}

export default Piechart;
