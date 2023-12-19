import {useEffect, useState} from 'react';
import {PieChartData, StackBarData, StackBarVariant, TransactionsGroupedTest} from "../../../../types.ts";
import {Chart} from "primereact/chart";
import {SelectButton} from "primereact/selectbutton";
import './TransactionVisualisations.scss';
import {Button} from "primereact/button";

type TransactionVisualisationsProps = {
    transactionsGrouped: {
        incomes: TransactionsGroupedTest,
        expenses: TransactionsGroupedTest
    }
}

const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth() + 1;
const currentDay = date.getDate();

function TransactionVisualisations({transactionsGrouped}: TransactionVisualisationsProps) {
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
        createVisualisationsData();
    }, [transactionsGrouped]);

    function createVisualisationsData() {
        const {incomes, expenses} = transactionsGrouped;
        let incomeCategoryLabels: string[] = [];
        let expenseCategoryLabels: string[] = [];
        let incomeCategoryValues: number[][] = [];
        let expenseCategoryValues: number[][] = [];

        let tmpPieChartData = pieChartData;

        if (incomes && incomes[currentYear] && incomes[currentYear].months && incomes[currentYear].months[currentMonth] && incomes[currentYear].months[currentMonth].overview) {
            //PieChart Data
            tmpPieChartData.incomes = {
                labels: incomes[currentYear].months[currentMonth].overview.labels,
                datasets: [
                    {
                        label: 'Incomes',
                        data: incomes[currentYear].months[currentMonth].overview.values
                    }
                ]
            }

            //StackBarData
            incomes[currentYear].months[currentMonth].overview.labels.forEach((label) => {
                if (!incomeCategoryLabels.includes(label)) {
                    incomeCategoryLabels.push(label);
                }
            })
            incomeCategoryValues = Array.from({length: incomeCategoryLabels.length}, () => Array.from({length: currentDay}, () => 0));
            incomeCategoryLabels.forEach((label, index) => {
                for (const [_, day] of Object.entries(incomes[currentYear].months[currentMonth].days)) {
                    day.list.forEach((transaction) => {
                        const tmpId = new Date(transaction.createdAt).getDate() - 1;
                        if (label === transaction.category.name) {
                            incomeCategoryValues[index][tmpId] = incomeCategoryValues[index][tmpId] + transaction.value;
                        }
                    })
                }
            })

        }

        if (expenses && expenses[currentYear] && expenses[currentYear].months && expenses[currentYear].months[currentMonth] && expenses[currentYear].months[currentMonth].overview) {
            //PieChart Data
            tmpPieChartData.expenses = {
                labels: expenses[currentYear].months[currentMonth].overview.labels,
                datasets: [
                    {
                        label: 'Incomes',
                        data: expenses[currentYear].months[currentMonth].overview.values
                    }
                ]
            }

            //StackBarData
            expenses[currentYear].months[currentMonth].overview.labels.forEach((label) => {
                if (!expenseCategoryLabels.includes(label)) {
                    expenseCategoryLabels.push(label);
                }
            })
            expenseCategoryValues = Array.from({length: expenseCategoryLabels.length}, () => Array.from({length: currentDay}, () => 0));
            expenseCategoryLabels.forEach((label, index) => {
                for (const [_, day] of Object.entries(expenses[currentYear].months[currentMonth].days)) {
                    day.list.forEach((transaction) => {
                        const tmpId = new Date(transaction.createdAt).getDate() - 1;
                        if (label === transaction.category.name) {
                            expenseCategoryValues[index][tmpId] = expenseCategoryValues[index][tmpId] + transaction.value;
                        }
                    })
                }
            })
        }
        const dayLabels = Array.from({length: currentDay}, (_, index) => (index + 1).toString() + "." + currentMonth);

        let incomeStackData: StackBarData = {
            labels: dayLabels,
            datasets: incomeCategoryLabels.map((label, index) => {
                return {
                    label: label,
                    data: incomeCategoryValues[index],
                    stack: "Incomes"
                }
            })
        }

        let expenseStackData: StackBarData = {
            labels: dayLabels,
            datasets: expenseCategoryLabels.map((label, index) => {
                return {
                    label: label,
                    data: expenseCategoryValues[index],
                    stack: "Expenses"
                }
            })
        }

        setStackBarData({
            incomes: incomeStackData,
            expenses: expenseStackData
        })
        setPieChartData(tmpPieChartData);

        //TotalValueBarData
        let tmp = 0;
        let totalValues = [];

        incomeStackData.datasets.forEach((dataset) => {
            dataset.data.forEach((value) => {
                tmp = tmp + value;
            })
        })
        totalValues.push(tmp);
        tmp = 0;
        expenseStackData.datasets.forEach((dataset) => {
            dataset.data.forEach((value) => {
                tmp = tmp + value;
            })
        })
        totalValues.push(tmp);

        setTotalValueBarData({
            labels: ["Total values"],
            datasets: [
                {
                    data: [totalValues[0]],
                    backgroundColor: ["green"],
                    label: "Incomes"
                },
                {
                    data: [totalValues[1]],
                    label: "Expenses",
                    backgroundColor: ["red"],
                }
            ]
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

            {stackBarData && <Chart type="bar"
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