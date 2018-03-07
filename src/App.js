import React, { Component } from "react";
import { csv as d3Csv } from "d3-request";
import { timer as d3Timer, scaleOrdinal } from "d3";
import * as chroma from "chroma-js";
import _ from "lodash";

import logo from "./logo.svg";
import "./App.css";

import Piechart from "./Piechart";

class App extends Component {
    state = {
        data: []
    };
    colorScale = chroma.scale("PuBu");
    colorIndex = scaleOrdinal();

    componentDidMount() {
        d3Csv(
            "transport.csv",
            d => ({
                ...d,
                amount: Number(d["In main currency"].replace(",", ""))
            }),
            (error, cachedData) => {
                if (error) {
                    console.error(error);
                }

                // borrowed from Piechart, should be utility func
                // Setting color scale here ensures color->tag mapping is stable
                const tags = Object.keys(
                    Object.entries(
                        _.groupBy(cachedData, d => d.Tags.split(", ").sort())
                    ).map(([tag, values]) => ({
                        tag,
                        amount: values
                            .map(d => d.amount)
                            .reduce((m, n) => m + n, 0)
                    }))
                );

                this.colorScale.colors(tags);
                this.colorIndex
                    .domain(tags)
                    .range(tags.map((_, i) => i / tags.length));

                this.setState({
                    cachedData,
                    cacheIndex: 0
                });
                this.startTrickle();
            }
        );
    }

    startTrickle() {
        this.timer = d3Timer(() => {
            let { data, cachedData, cacheIndex } = this.state;

            if (cacheIndex < cachedData.length) {
                this.setState({
                    data: [...data, cachedData[cacheIndex]],
                    cacheIndex: cacheIndex + 1
                });
            } else {
                this.stop();
            }
        }, 150);
    }

    componentWillUnmount() {
        this.stop();
    }

    stop() {
        this.timer.stop();
    }

    color(tag) {
        return this.colorScale(this.colorIndex(tag));
    }

    render() {
        const { data } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">
                        A pie chart with transitions and sane click events
                    </h1>
                </header>
                <p className="App-intro">
                    <svg width="800" height="600">
                        <Piechart
                            data={data}
                            color={d => this.color(d.data.tag)}
                            groupBy={d => d.Tags.split(", ").sort()}
                            x={400}
                            y={300}
                        />
                    </svg>
                </p>
            </div>
        );
    }
}

export default App;
