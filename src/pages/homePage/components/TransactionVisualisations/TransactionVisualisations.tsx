import {useEffect, useState} from 'react';
import {PieChartData, StackBarData, StackBarVariant, TransactionsGrouped} from "../../../../types.ts";
import {Chart} from "primereact/chart";
import {SelectButton} from "primereact/selectbutton";
import './TransactionVisualisations.scss';
import {Button} from "primereact/button";
import {getChartsDataForDay, getChartsDataForMonth, getChartsDataForYear} from "./getChartsData.ts";

type TransactionVisualisationsProps = {
    transactionsGrouped: {
        incomes: TransactionsGrouped,
        expenses: TransactionsGrouped,
    },
    year: number,
    current: boolean,
    month?: number,
    day?: number
}

function TransactionVisualisations({transactionsGrouped, year, current, month, day}: TransactionVisualisationsProps) {
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

    useEffect(() => {
        createVisualisationsData(year, current, month, day);
    }, [transactionsGrouped]);

    function createVisualisationsData(year: number, current: boolean, month?: number, day?: number) {
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

        if (incomes && incomes[year] && incomes[year].overview) {
            if (!month) {
                //year
                const {pieChartData, stackBarData, totalValue} = getChartsDataForYear(transactionsGrouped.incomes, year);
                incomesPieChartData = pieChartData;
                incomesStackBarData = stackBarData;
                incomeTotalValue = totalValue;
            } else {
                //month
                if (!day) {
                    if (incomes[year].months && incomes[year].months[month] && incomes[year].months[month].overview) {
                        const {pieChartData, stackBarData, totalValue} = getChartsDataForMonth(transactionsGrouped.incomes, year, month, current);
                        incomesPieChartData = pieChartData;
                        incomesStackBarData = stackBarData;
                        incomeTotalValue = totalValue;
                    }
                } else {
                    //day
                    if (incomes[year].months && incomes[year].months[month] && incomes[year].months[month].days && incomes[year].months[month].days[day]) {
                        const {pieChartData, totalValue} = getChartsDataForDay(transactionsGrouped.incomes, year, month, day);
                        incomesPieChartData = pieChartData;
                        incomeTotalValue = totalValue;
                    }
                }
            }
        }
        if (expenses && expenses[year] && expenses[year].overview) {
            if (!month) {
                //year
                const {pieChartData, stackBarData, totalValue} = getChartsDataForYear(transactionsGrouped.expenses, year);
                expensesPieChartData = pieChartData;
                expensesStackBarData = stackBarData;
                expenseTotalValue = totalValue;
            } else {
                //month
                if (!day) {
                    if (expenses[year].months && expenses[year].months[month] && expenses[year].months[month].overview) {
                        const {pieChartData, stackBarData, totalValue} = getChartsDataForMonth(transactionsGrouped.expenses, year, month, current);
                        expensesPieChartData = pieChartData;
                        expensesStackBarData = stackBarData;
                        expenseTotalValue = totalValue;
                    }
                } else {
                    //day
                    if (expenses[year].months && expenses[year].months[month] && expenses[year].months[month].days && expenses[year].months[month].days[day]) {
                        const {pieChartData, totalValue} = getChartsDataForDay(transactionsGrouped.expenses, year, month, day);
                        incomesPieChartData = pieChartData;
                        incomeTotalValue = totalValue;
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

    return (
        <div className="transaction-visualisations">
            <div className={"transaction-visualisations__header"}>
                <h2>Your transactions this month</h2>
                <Button size="small" label="See more"/>
            </div>
            <div className="transaction-visualisations__row">
                <div className="transaction-visualisations__pie-chart">
                    {/*TODO dodać coś, co wyświetli komunikat ze nie ma danych jezeli wykres bd pusty. Można to określić po totalValue*/}
                    {pieChartData && <Chart
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
                    }}/>}
                </div>
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
                        className={`transaction-visualisations__total-value__text transaction-visualisations__total-value__text--${totalValueBarData.datasets[0].data[0] - totalValueBarData.datasets[1].data[0] > 0 ? "positive" : "negative"}`}>
                        Total
                        difference: {totalValueBarData.datasets[0].data[0] - totalValueBarData.datasets[1].data[0] > 0 ? "+" : "-"}{totalValueBarData.datasets[0].data[0] - totalValueBarData.datasets[1].data[0]}
                    </div>
                </div>}
            </div>

            {!day && stackBarData && <Chart type="bar"
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

            <SelectButton value={transactionVariant} onChange={(e) => setTransactionVariant(e.value)}
                          options={[StackBarVariant.EXPENSE, StackBarVariant.INCOME]}/>
        </div>
    );
}

export default TransactionVisualisations;