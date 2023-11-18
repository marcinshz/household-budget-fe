import './pieChart.scss'
import {TransactionsGrouped} from "../../../../types.ts";
import {Chart} from "primereact/chart";

type PieChartProps = {
    data: TransactionsGrouped;
}

function PieChart({data}: PieChartProps) {
    return (
        <div className="pie-chart">
            {data.labels.length ?
                <Chart data={data} type="pie" options={{
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true
                            },
                            position: 'bottom'
                        }
                    },
                    width: '50%'
                }}/>
                :
                <></>
            }
        </div>
    );
}

export default PieChart;