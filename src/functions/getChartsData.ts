import {PieChartData, StackBarData, TransactionsGrouped} from "../types.ts";

export function getChartsDataForYear(transactionsGrouped: TransactionsGrouped, year: number) {
    let categoryLabels: string[] = [];
    let categoryValues: number[][] = [];
    let totalValue = 0;
    let pieChartData: PieChartData = {
        labels: [],
        datasets: []
    };
    let stackBarData: StackBarData = {
        labels: [],
        datasets: []
    }
    let labels: string[] = [];
    pieChartData = {
        labels: transactionsGrouped[year].overview.labels,
        datasets: [{
            label: 'Incomes',
            data: transactionsGrouped[year].overview.values
        }]
    }

    transactionsGrouped[year].overview.labels.forEach((label) => {
        if (!categoryLabels.includes(label)) {
            categoryLabels.push(label);
        }
    })
    categoryValues = Array.from({length: categoryLabels.length}, () => Array.from({length: 12}, () => 0));
    categoryLabels.forEach((label, index) => {
        for (const [key, month] of Object.entries(transactionsGrouped[year].months)) {
            month.overview.labels.forEach((overviewLabel: string, overviewIndex: number) => {
                if (overviewLabel === label) {
                    categoryValues[index][parseInt(key) - 1] = categoryValues[index][parseInt(key) - 1] + month.overview.values[overviewIndex];
                }
            })
        }
    })
    labels = Array.from({length: 12}, (_, index) => (index + 1).toString() + "." + year);
    stackBarData = {
        labels,
        datasets: categoryLabels.map((label, index) => {
            return {
                label: label,
                data: categoryValues[index],
                stack: "Incomes"
            }
        })
    }

    stackBarData.datasets.forEach((dataset) => {
        dataset.data.forEach((value) => {
            totalValue = totalValue + value;
        })
    })

    return {
        pieChartData,
        stackBarData,
        totalValue
    }
}

const currentDay = new Date().getDate();

export function getChartsDataForMonth(transactionsGrouped: TransactionsGrouped, year: number, month: number, current: boolean) {
    let categoryLabels: string[] = [];
    let categoryValues: number[][] = [];
    let totalValue = 0;
    let pieChartData: PieChartData = {
        labels: [],
        datasets: []
    };
    let stackBarData: StackBarData = {
        labels: [],
        datasets: []
    }
    let labels: string[] = [];

    pieChartData = {
        labels: transactionsGrouped[year].months[month].overview.labels,
        datasets: [
            {
                label: 'Incomes',
                data: transactionsGrouped[year].months[month].overview.values
            }
        ]
    }

    transactionsGrouped[year].months[month].overview.labels.forEach((label) => {
        if (!categoryLabels.includes(label)) {
            categoryLabels.push(label);
        }
    })
    categoryValues = Array.from({length: categoryLabels.length}, () => Array.from({length: current ? currentDay : new Date(year, month, 0).getDate()}, () => 0));
    categoryLabels.forEach((label, index) => {
        for (const [key, day] of Object.entries(transactionsGrouped[year].months[month].days)) {
            day.overview.labels.forEach((overviewLabel: string, overviewIndex: number) => {
                if (overviewLabel === label) {
                    categoryValues[index][parseInt(key) - 1] = categoryValues[index][parseInt(key) - 1] + day.overview.values[overviewIndex];
                }
            })
        }
    })

    labels = Array.from({length: currentDay}, (_, index) => (index + 1).toString() + "." + month);

    stackBarData = {
        labels,
        datasets: categoryLabels.map((label, index) => {
            return {
                label: label,
                data: categoryValues[index],
                stack: "Incomes"
            }
        })
    }

    stackBarData.datasets.forEach((dataset) => {
        dataset.data.forEach((value) => {
            totalValue = totalValue + value;
        })
    })

    return {
        pieChartData,
        stackBarData,
        totalValue
    }
}

export function getChartsDataForDay(transactionsGrouped: TransactionsGrouped, year: number, month: number, day: number) {
    let totalValue = 0;
    let pieChartData: PieChartData = {
        labels: [],
        datasets: []
    };
    pieChartData = {
        labels: transactionsGrouped[year].months[month].days[day].overview.labels,
        datasets: [
            {
                label: 'Incomes',
                data: transactionsGrouped[year].months[month].days[day].overview.values
            }
        ]
    }

    //bez StackBarData dla dnia

    //TotalValueBarData
    transactionsGrouped[year].months[month].days[day].overview.values.forEach((value) => {
        totalValue = totalValue + value;
    })
    return {
        pieChartData,
        totalValue
    }
}