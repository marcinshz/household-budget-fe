import {useEffect, useState} from 'react';
import {PieChartData, SelectNode, StackBarData, StackBarVariant, TransactionsGrouped} from "../../../../types.ts";
import {Chart} from "primereact/chart";
import {SelectButton} from "primereact/selectbutton";
import './TransactionVisualisations.scss';
import {Button} from "primereact/button";
import {
    getTransactionChartsDataForDay,
    getTransactionChartsDataForMonth,
    getTransactionChartsDataForYear
} from "../../../../functions/getChartsData.ts";
import {useNavigate} from "react-router-dom";
import {TreeSelect, TreeSelectChangeEvent} from "primereact/treeselect";
import {getTransactionDateSelectOptions} from "../../../../functions/getTransactionDateSelectOptions.ts";

type TransactionVisualisationsProps = {
    transactionsGrouped: {
        incomes: TransactionsGrouped,
        expenses: TransactionsGrouped,
    },
    homePage?: boolean
}

function TransactionVisualisations({transactionsGrouped, homePage}: TransactionVisualisationsProps) {
    const [transactionVariant, setTransactionVariant] = useState<StackBarVariant>(StackBarVariant.INCOME)
    const [stackBarData, setStackBarData] = useState<{
        incomes: StackBarData,
        expenses: StackBarData
    }>({
        incomes: {
            labels: [],
            datasets: []
        },
        expenses: {
            labels: [],
            datasets: []
        }
    })
    const [pieChartData, setPieChartData] = useState<{
        incomes: PieChartData,
        expenses: PieChartData
    }>({
        incomes: {
            labels: [],
            datasets: []
        },
        expenses: {
            labels: [],
            datasets: []
        }
    })
    const [totalValueBarData, setTotalValueBarData] = useState<{
        labels: string[],
        datasets: {
            data: number[],
            label: string,
            backgroundColor: string[]
        }[]
    }>()
    const [dateFilters, setDateFilters] = useState<{
        year: number,
        month: number | undefined,
        day: number | undefined
    }>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: undefined
    });
    const navigate = useNavigate();
    const [selectNodes, setSelectNodes] = useState<SelectNode[]>([]);
    const [selectNode, setSelectNode] = useState<string>("");
    const [showTreeSelect, setShowTreeSelect] = useState<boolean>(false);
    useEffect(() => {
        const {year, month, day} = dateFilters;
        createVisualisationsData(year, month, day);
    }, [transactionsGrouped, dateFilters]);

    useEffect(() => {
        getSelectNodes()
    }, [transactionsGrouped]);

    useEffect(() => {
        if (selectNodes.length > 0) setShowTreeSelect(true);
    }, [selectNodes]);

    function createVisualisationsData(year: number, month?: number, day?: number) {
        const {incomes, expenses} = transactionsGrouped;
        let incomeTotalValue = 0;
        let expenseTotalValue = 0;
        let incomesPieChartData: PieChartData = {
            labels: [],
            datasets: []
        };
        let expensesPieChartData: PieChartData = {
            labels: [],
            datasets: []
        };
        let incomesStackBarData: StackBarData = {
            labels: [],
            datasets: []
        }
        let expensesStackBarData: StackBarData = {
            labels: [],
            datasets: []
        }
        const currentMonth = year === new Date().getFullYear() && month === new Date().getMonth() + 1;

        if (incomes && incomes[year] && incomes[year].overview) {
            if (!month) {
                //year
                const {
                    pieChartData,
                    stackBarData,
                    totalValue
                } = getTransactionChartsDataForYear(transactionsGrouped.incomes, year);
                incomesPieChartData = pieChartData;
                incomesStackBarData = stackBarData;
                incomeTotalValue = totalValue;
            } else {
                //month
                if (!day) {
                    if (incomes[year].months && incomes[year].months[month] && incomes[year].months[month].overview) {
                        const {
                            pieChartData,
                            stackBarData,
                            totalValue
                        } = getTransactionChartsDataForMonth(transactionsGrouped.incomes, year, month, currentMonth);
                        incomesPieChartData = pieChartData;
                        incomesStackBarData = stackBarData;
                        incomeTotalValue = totalValue;
                    }
                } else {
                    //day
                    if (incomes[year].months && incomes[year].months[month] && incomes[year].months[month].days && incomes[year].months[month].days[day]) {
                        const {
                            pieChartData,
                            totalValue
                        } = getTransactionChartsDataForDay(transactionsGrouped.incomes, year, month, day);
                        incomesPieChartData = pieChartData;
                        incomeTotalValue = totalValue;
                    }
                }
            }
        }
        if (expenses && expenses[year] && expenses[year].overview) {
            if (!month) {
                //year
                const {
                    pieChartData,
                    stackBarData,
                    totalValue
                } = getTransactionChartsDataForYear(transactionsGrouped.expenses, year);
                expensesPieChartData = pieChartData;
                expensesStackBarData = stackBarData;
                expenseTotalValue = totalValue;
            } else {
                //month
                if (!day) {
                    if (expenses[year].months && expenses[year].months[month] && expenses[year].months[month].overview) {
                        const {
                            pieChartData,
                            stackBarData,
                            totalValue
                        } = getTransactionChartsDataForMonth(transactionsGrouped.expenses, year, month, currentMonth);
                        expensesPieChartData = pieChartData;
                        expensesStackBarData = stackBarData;
                        expenseTotalValue = totalValue;
                    }
                } else {
                    //day
                    if (expenses[year].months && expenses[year].months[month] && expenses[year].months[month].days && expenses[year].months[month].days[day]) {
                        const {
                            pieChartData,
                            totalValue
                        } = getTransactionChartsDataForDay(transactionsGrouped.expenses, year, month, day);
                        expensesPieChartData = pieChartData;
                        expenseTotalValue = totalValue;
                    }
                }
            }
        }
        setTotalValueBarData({
            labels: ["Total values"],
            datasets: [
                {
                    data: [incomeTotalValue],
                    backgroundColor: ["green"],
                    label: "Incomes"
                },
                {
                    data: [expenseTotalValue],
                    label: "Expenses",
                    backgroundColor: ["red"],
                }
            ]
        })
        setPieChartData({
            incomes: incomesPieChartData,
            expenses: expensesPieChartData
        })

        setStackBarData({
            expenses: expensesStackBarData,
            incomes: incomesStackBarData
        })
    }

    function getSelectNodes() {
        let selectNodes = getTransactionDateSelectOptions(transactionVariant, transactionsGrouped);
        setSelectNodes(selectNodes);
    }

    const handleTreeSelectChange = (e: TreeSelectChangeEvent) => {
        const tmp = e.value as string;
        const dateFilters = tmp.split(".");
        setSelectNode(tmp);
        setDateFilters({
            year: new Date().getFullYear(),
            month: undefined,
            day: undefined
        })
        if (dateFilters.length === 3) {
            setDateFilters({
                year: parseInt(dateFilters[2]),
                month: parseInt(dateFilters[1]),
                day: parseInt(dateFilters[0])
            })
        } else if (dateFilters.length === 2) {
            setDateFilters({
                year: parseInt(dateFilters[1]),
                month: parseInt(dateFilters[0]),
                day: undefined
            })
        } else if (dateFilters.length === 1) {
            setDateFilters({
                year: parseInt(dateFilters[0]),
                month: undefined,
                day: undefined
            })
        }
    }
    
    return (
        <div className="transaction-visualisations">
            <div className={"transaction-visualisations__header"}>
                <h2>Transactions</h2>
                <div className={"transaction-visualisations__header__buttons"}>
                    <SelectButton value={transactionVariant} onChange={(e) => setTransactionVariant(e.value)}
                                  options={[StackBarVariant.EXPENSE, StackBarVariant.INCOME]}/>
                    {homePage &&
                        <Button size="small" label="See more" onClick={() => {
                            navigate('/transactions')
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
            <div className="transaction-visualisations__row">
                {pieChartData && !(pieChartData.incomes.labels.length === 0 && pieChartData.expenses.labels.length === 0) &&
                    <div className="transaction-visualisations__pie-chart">
                        <Chart
                            data={transactionVariant === StackBarVariant.INCOME ? pieChartData.incomes : pieChartData.expenses}
                            type="pie" options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Share of each category'
                                },
                                legend: {
                                    labels: {
                                        usePointStyle: true
                                    },
                                    position: 'bottom'
                                }
                            },
                            responsive: true,
                            width: '50%'
                        }}/>
                    </div>}
                {totalValueBarData && <div className="transaction-visualisations__total-value">
                    <Chart type="bar" data={totalValueBarData} options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'Total values'
                            },
                            legend: {
                                labels: {
                                    usePointStyle: true
                                },
                                position: 'bottom'
                            }
                        },
                        responsive: true,
                        width: '50%'
                    }}/>
                    <div
                        className={`transaction-visualisations__total-value__text transaction-visualisations__total-value__text--${totalValueBarData.datasets[0].data[0] - totalValueBarData.datasets[1].data[0] >= 0 ? "positive" : "negative"}`}>
                        Total
                        difference: {totalValueBarData.datasets[0].data[0] - totalValueBarData.datasets[1].data[0] >= 0 ? "+" : ""}{totalValueBarData.datasets[0].data[0] - totalValueBarData.datasets[1].data[0]}
                    </div>
                </div>}
            </div>

            {!dateFilters.day && stackBarData && !(stackBarData.incomes.labels.length === 0 && stackBarData.expenses.labels.length === 0) &&
                <Chart type="bar"
                       data={transactionVariant === StackBarVariant.INCOME ? stackBarData.incomes : stackBarData.expenses}
                       options={{
                           type: 'bar',
                           plugins: {
                               title: {
                                   display: true,
                                   text: 'Share of each category by day'
                               },
                           },
                           options: {
                               responsive: true,
                               interaction: {
                                   intersect: false,
                               },
                               scales: {
                                   y: {
                                       stacked: true,
                                       beginAtZero: true
                                   }
                               }
                           }
                       }}/>}
        </div>
    );
}

export default TransactionVisualisations;