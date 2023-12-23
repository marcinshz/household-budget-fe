import './BalanceHistory.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../../../redux/store.ts";
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getBalanceChartDataForMonth, getBalanceChartDataForYear} from "../../../../functions/getChartsData.ts";
import {LineChartData} from "../../../../types.ts";
import {Chart} from "primereact/chart";

export type BalanceHistoryProps = {
    homePage?: boolean;
}

function BalanceHistory({homePage}: BalanceHistoryProps) {
    const wallets = useSelector((state: RootState) => {
        return state.wallets;
    });
    const [lineChartData, setLineChartData] = useState<LineChartData>({
        labels: [],
        datasets: []
    })
    const [showTreeSelect, setShowTreeSelect] = useState(false);
    const navigate = useNavigate();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number | undefined>(new Date().getMonth() + 1);

    useEffect(() => {
        if (wallets && wallets.length) {
            createVisualisationsData();
        }
    }, [wallets, year, month]);

    function createVisualisationsData() {
        let data: LineChartData = {
            labels: [],
            datasets: []
        }
        const currentMonth = month === new Date().getMonth() + 1 && year === new Date().getFullYear();
        if (!month) data = getBalanceChartDataForYear(wallets, year);
        else data = getBalanceChartDataForMonth(wallets, year, month, currentMonth);

        setLineChartData(data)
    }

    return (
        <div className="balance-history">
            <div className={"balance-history__header"}>
                <h2>Balance History </h2>
                <div className={"balance-history__header__buttons"}>
                    {homePage &&
                        <Button size="small" label="See more" onClick={() => {
                            navigate('/balance-history')
                        }}/>
                    }

                    {/*                    {!homePage && showTreeSelect &&
                        <TreeSelect
                            value={selectNode}
                            options={selectNodes}
                            onChange={handleTreeSelectChange}
                            style={{minWidth: '200px'}}
                            placeholder="Pick a date"
                        />
                    }*/}

                </div>
            </div>
            <Chart type="line" data={lineChartData} options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Balance History'
                    },
                },
                elements: {
                    point: {
                        radius: 3
                    }
                }
            }}/>
        </div>
    );
}

export default BalanceHistory;