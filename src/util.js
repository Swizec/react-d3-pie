import _ from "lodash";

export const groupByFunc = (data, groupBy) =>
    Object.entries(_.groupBy(data, groupBy)).map(([tag, values]) => ({
        tag,
        amount: values.map(d => d.amount).reduce((m, n) => m + n, 0)
    }));
