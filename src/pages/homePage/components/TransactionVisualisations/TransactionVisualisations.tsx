import {useEffect, useState} from 'react';
import {PieChartData, StackBarData, StackBarVariant, TransactionsGrouped} from "../../../../types.ts";
import {Chart} from "primereact/chart";
import {SelectButton} from "primereact/selectbutton";
import './TransactionVisualisations.scss';
import {Button} from "primereact/button";

type TransactionVisualisationsProps = {
    transactionsGrouped: {
        incomes: TransactionsGrouped,
        expenses: TransactionsGrouped,
    },
    year: number,
    current: boolean,
    month: number,
    day?: number
}

const date = new Date();
const currentDay = date.getDate();

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
        console.log(transactionsGrouped);
    }, [transactionsGrouped]);

    function createVisualisationsData(year: number, current: boolean, month?: number, day?: number) {
        const {incomes, expenses} = transactionsGrouped;

        let incomeCategoryLabels: string[] = [];
        let expenseCategoryLabels: string[] = [];
        let incomeCategoryValues: number[][] = [];
        let expenseCategoryValues: number[][] = [];
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
            let labels: string[] = [];
            if (!month) {
                //przygotuj dla roku
                //PieChart Data
                incomesPieChartData = {
                    labels: incomes[year].overview.labels,
                    datasets: [{
                        label: 'Incomes',
                        data: incomes[year].overview.values
                    }]
                }

                //StackBarData
                incomes[year].overview.labels.forEach((label) => {
                    if (!incomeCategoryLabels.includes(label)) {
                        incomeCategoryLabels.push(label);
                    }
                })
                incomeCategoryValues = Array.from({length: incomeCategoryLabels.length}, () => Array.from({length: 12}, () => 0));
                incomeCategoryLabels.forEach((label, index) => {
                    for (const [key, month] of Object.entries(incomes[year].months)) {
                        month.overview.labels.forEach((overviewLabel: string, overviewIndex: number) => {
                            if (overviewLabel === label) {
                                incomeCategoryValues[index][parseInt(key) - 1] = incomeCategoryValues[index][parseInt(key) - 1] + month.overview.values[overviewIndex];
                            }
                        })
                    }
                })
                labels = Array.from({length: 12}, (_, index) => (index + 1).toString() + "." + year);
                incomesStackBarData = {
                    labels,
                    datasets: incomeCategoryLabels.map((label, index) => {
                        return {
                            label: label,
                            data: incomeCategoryValues[index],
                            stack: "Incomes"
                        }
                    })
                }

                //TotalValueBarData
                incomesStackBarData.datasets.forEach((dataset) => {
                    dataset.data.forEach((value) => {
                        incomeTotalValue = incomeTotalValue + value;
                    })
                })

            } else {
                //przygotuj dla miesiąca
                if (!day) {
                    if (incomes[year].months && incomes[year].months[month] && incomes[year].months[month].overview) {
                        //PieChart Data
                        incomesPieChartData = {
                            labels: incomes[year].months[month].overview.labels,
                            datasets: [
                                {
                                    label: 'Incomes',
                                    data: incomes[year].months[month].overview.values
                                }
                            ]
                        }

                        //StackBarData
                        incomes[year].months[month].overview.labels.forEach((label) => {
                            if (!incomeCategoryLabels.includes(label)) {
                                incomeCategoryLabels.push(label);
                            }
                        })
                        incomeCategoryValues = Array.from({length: incomeCategoryLabels.length}, () => Array.from({length: current ? currentDay : new Date(year, month, 0).getDate()}, () => 0));
                        incomeCategoryLabels.forEach((label, index) => {
                            for (const [key, day] of Object.entries(incomes[year].months[month].days)) {
                                day.overview.labels.forEach((overviewLabel: string, overviewIndex: number) => {
                                    if (overviewLabel === label) {
                                        incomeCategoryValues[index][parseInt(key) - 1] = incomeCategoryValues[index][parseInt(key) - 1] + day.overview.values[overviewIndex];
                                    }
                                })
                            }
                        })

                        labels = Array.from({length: currentDay}, (_, index) => (index + 1).toString() + "." + month);

                        incomesStackBarData = {
                            labels,
                            datasets: incomeCategoryLabels.map((label, index) => {
                                return {
                                    label: label,
                                    data: incomeCategoryValues[index],
                                    stack: "Incomes"
                                }
                            })
                        }

                        //TotalValueBarData
                        incomesStackBarData.datasets.forEach((dataset) => {
                            dataset.data.forEach((value) => {
                                incomeTotalValue = incomeTotalValue + value;
                            })
                        })
                    }
                } else {
                    //przygotuj dla dnia
                    if (incomes[year].months && incomes[year].months[month] && incomes[year].months[month].days && incomes[year].months[month].days[day]) {
                        //PieChart Data
                        incomesPieChartData = {
                            labels: incomes[year].months[month].days[day].overview.labels,
                            datasets: [
                                {
                                    label: 'Incomes',
                                    data: incomes[year].months[month].days[day].overview.values
                                }
                            ]
                        }

                        //bez StackBarData dla dnia

                        //TotalValueBarData
                        incomes[year].months[month].days[day].overview.values.forEach((value) => {
                            incomeTotalValue = incomeTotalValue + value;
                        })
                    }
                }

            }
        }
        if (expenses && expenses[year] && expenses[year].overview) {
            let labels: string[] = [];
            if (!month) {
                //przygotuj dla roku
                //PieChart Data
                expensesPieChartData = {
                    labels: expenses[year].overview.labels,
                    datasets: [{
                        label: 'Expenses',
                        data: expenses[year].overview.values
                    }]
                }

                //StackBarData
                expenses[year].overview.labels.forEach((label) => {
                    if (!expenseCategoryLabels.includes(label)) {
                        expenseCategoryLabels.push(label);
                    }
                })
                expenseCategoryValues = Array.from({length: expenseCategoryLabels.length}, () => Array.from({length: 12}, () => 0));
                expenseCategoryLabels.forEach((label, index) => {
                    for (const [key, month] of Object.entries(expenses[year].months)) {
                        month.overview.labels.forEach((overviewLabel: string, overviewIndex: number) => {
                            if (overviewLabel === label) {
                                expenseCategoryValues[index][parseInt(key) - 1] = expenseCategoryValues[index][parseInt(key) - 1] + month.overview.values[overviewIndex];
                            }
                        })
                    }
                })

                labels = Array.from({length: 12}, (_, index) => (index + 1).toString() + "." + year);
                //here
                expensesStackBarData = {
                    labels,
                    datasets: expenseCategoryLabels.map((label, index) => {
                        return {
                            label: label,
                            data: expenseCategoryValues[index],
                            stack: "Incomes"
                        }
                    })
                }

                //TotalValueBarData
                expensesStackBarData.datasets.forEach((dataset) => {
                    dataset.data.forEach((value) => {
                        expenseTotalValue = expenseTotalValue + value;
                    })
                })
            } else {
                //przygotuj dla miesiąca
                if (!day) {
                    if (expenses[year].months && expenses[year].months[month] && expenses[year].months[month].overview) {
                        //PieChart Data
                        expensesPieChartData = {
                            labels: expenses[year].months[month].overview.labels,
                            datasets: [
                                {
                                    label: 'Incomes',
                                    data: expenses[year].months[month].overview.values
                                }
                            ]
                        }

                        //StackBarData
                        expenses[year].months[month].overview.labels.forEach((label) => {
                            if (!expenseCategoryLabels.includes(label)) {
                                expenseCategoryLabels.push(label);
                            }
                        })
                        expenseCategoryValues = Array.from({length: expenseCategoryLabels.length}, () => Array.from({length: current ? currentDay : new Date(year, month, 0).getDate()}, () => 0));
                        expenseCategoryLabels.forEach((label, index) => {
                            for (const [key, day] of Object.entries(expenses[year].months[month].days)) {
                                day.overview.labels.forEach((overviewLabel: string, overviewIndex: number) => {
                                    if (overviewLabel === label) {
                                        expenseCategoryValues[index][parseInt(key) - 1] = expenseCategoryValues[index][parseInt(key) - 1] + day.overview.values[overviewIndex];
                                    }
                                })
                            }
                        })

                        labels = Array.from({length: currentDay}, (_, index) => (index + 1).toString() + "." + month);

                        expensesStackBarData = {
                            labels,
                            datasets: expenseCategoryLabels.map((label, index) => {
                                return {
                                    label: label,
                                    data: expenseCategoryValues[index],
                                    stack: "Incomes"
                                }
                            })
                        }
                        console.log('stak', expensesStackBarData)

                        //TotalValueBarData
                        expensesStackBarData.datasets.forEach((dataset) => {
                            dataset.data.forEach((value) => {
                                expenseTotalValue = expenseTotalValue + value;
                            })
                        })
                    }
                } else {
                    //przygotuj dla dnia
                    if (expenses[year].months && expenses[year].months[month] && expenses[year].months[month].days && expenses[year].months[month].days[day]) {
                        //PieChart Data
                        expensesPieChartData = {
                            labels: expenses[year].months[month].days[day].overview.labels,
                            datasets: [
                                {
                                    label: 'Incomes',
                                    data: expenses[year].months[month].days[day].overview.values
                                }
                            ]
                        }

                        //bez StackBarData dla dnia

                        //TotalValueBarData
                        expenses[year].months[month].days[day].overview.values.forEach((value) => {
                            expenseTotalValue = expenseTotalValue + value;
                        })
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