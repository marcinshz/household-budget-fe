import './BalanceHistory.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../../../redux/store.ts";
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getBalanceChartDataForMonth, getBalanceChartDataForYear} from "../../../../functions/getChartsData.ts";
import {LineChartData, SelectNode} from "../../../../types.ts";
import {Chart} from "primereact/chart";
import {TreeSelect, TreeSelectChangeEvent} from "primereact/treeselect";
import {getBalanceDateSelectOptions} from "../../../../functions/getBalanceDateSelectOptions.tsx";

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
    const navigate = useNavigate();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number | undefined>(new Date().getMonth() + 1);
    const [selectNodes, setSelectNodes] = useState<SelectNode[]>([]);
    const [selectNode, setSelectNode] = useState<string>("");
    const [showTreeSelect, setShowTreeSelect] = useState<boolean>(false);
    const {user} = useSelector((state: RootState) => {
        return {user: state.user};
    })

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

    const handleTreeSelectChange = (e: TreeSelectChangeEvent) => {
        const tmp = e.value as string;
        const dateFilters = tmp.split(".");
        setSelectNode(tmp);
        setYear(new Date().getFullYear());
        setMonth(undefined);
        if (dateFilters.length === 2) {
            setYear(parseInt(dateFilters[1]));
            setMonth(parseInt(dateFilters[0]));
        } else if (dateFilters.length === 1) {
            setYear(parseInt(dateFilters[0]));
        }
    }

    function getSelectNodes() {
        let selectNodes = getBalanceDateSelectOptions(wallets);
        if (selectNodes) setSelectNodes(selectNodes);
    }

    useEffect(() => {
        if (wallets && wallets.length) getSelectNodes();
    }, [wallets]);

    useEffect(() => {
        if (selectNodes && selectNodes.length > 0) setShowTreeSelect(true);
    }, [selectNodes]);

    return (
        <div className="balance-history">
            <div className={"balance-history__header"}>
                <h2>Balance History {month ? month + '.' + year : year}</h2>
                <div className={"balance-history__header__buttons"}>
                    {homePage &&
                        <Button size="small" label="See more" onClick={() => {
                            navigate('/balance-history')
                        }}/>
                    }

                    {!homePage && showTreeSelect &&
                        <TreeSelect
                            value={selectNode}
                            options={selectNodes}
                            onChange={handleTreeSelectChange}
                            style={{minWidth: '200px'}}
                            placeholder="Pick a date"
                        />
                    }

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
                        radius: 5
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: `Balance [${user.currency}]`
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }}/>
        </div>
    );
}

export default BalanceHistory;