import {BalanceStamp, PieChartData, StackBarData, TransactionsGrouped, WalletListItem} from "../types.ts";

export function getTransactionChartsDataForYear(transactionsGrouped: TransactionsGrouped, year: number) {
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

export function getTransactionChartsDataForMonth(transactionsGrouped: TransactionsGrouped, year: number, month: number, current: boolean) {
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

    labels = Array.from({length: current ? currentDay : new Date(year, month, 0).getDate()}, (_, index) => (index + 1).toString() + "." + month);

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

export function getTransactionChartsDataForDay(transactionsGrouped: TransactionsGrouped, year: number, month: number, day: number) {
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

export function getBalanceChartDataForYear(wallets: WalletListItem[], year: number) {
    const walletsChecked = wallets.filter((wallet) => {
        return wallet.checked;
    })

    let labels = Array.from({length: 12}, (_, index) => (index + 1).toString() + "." + year);
    let data = Array.from({length: 12}, () => 0);
    let eachWalletData = Array.from({length: walletsChecked.length}, () => Array.from({length: 12}, () => 0));

    walletsChecked.forEach((wallet, walletIndex) => {
        labels.forEach((_value, monthIndex) => {
            const month = monthIndex + 1;
            let latest: BalanceStamp | null = null;
            wallet.balanceStamps.forEach((stamp: BalanceStamp) => {
                const stampMonth = new Date(stamp.createdAt).getMonth() + 1;
                const stampYear = new Date(stamp.createdAt).getFullYear();

                if (stampMonth === month && stampYear === year) {
                    if (latest) {
                        if (new Date(latest.createdAt) < new Date(stamp.createdAt)) latest = stamp;
                    } else latest = stamp;
                }
            })
            if (latest) {
                eachWalletData[walletIndex][monthIndex] = (latest as BalanceStamp).balance;
                data[monthIndex] = data[monthIndex] + (latest as BalanceStamp).balance;
            }
        })
    })
    return {
        labels,
        datasets: [
            {
                label: 'Total balance',
                data: data
            },
            ...eachWalletData.map((data, index) => {
                return {
                    label: walletsChecked[index].name,
                    data: data
                }
            })
        ]
    }
}

export function getBalanceChartDataForMonth(wallets: WalletListItem[], year: number, month: number, current: boolean) {
    const walletsChecked = wallets.filter((wallet) => {
        return wallet.checked;
    })
    const currentDay = new Date().getDate();
    const length = new Date(year, month, 0).getDate();

    let labels = Array.from({length: current ? currentDay : length}, (_, index) => (index + 1).toString() + "." + month);
    let totalData = Array.from({length: current ? currentDay : length}, () => 0);
    let eachWalletData = Array.from({length: walletsChecked.length}, () => Array.from({length: current ? currentDay : length}, () => 0));
    walletsChecked.forEach((wallet, walletIndex) => {
        labels.forEach((_value, dayIndex) => {
            const day = dayIndex + 1;
            let latest: BalanceStamp | null = null;
            wallet.balanceStamps.forEach((stamp: BalanceStamp) => {
                const stampDay = new Date(stamp.createdAt).getDate();
                const stampMonth = new Date(stamp.createdAt).getMonth() + 1;
                const stampYear = new Date(stamp.createdAt).getFullYear();

                if (stampMonth === month && stampYear === year && stampDay === day) {
                    if (latest) {
                        if (new Date(latest.createdAt) < new Date(stamp.createdAt)) latest = stamp;
                    } else latest = stamp;
                }
            })

            if (latest) {
                eachWalletData[walletIndex][dayIndex] = (latest as BalanceStamp).balance;
                totalData[dayIndex] = totalData[dayIndex] + (latest as BalanceStamp).balance;
            }
        })
    })

    return {
        labels,
        datasets: [
            {
                label: 'Total balance',
                data: totalData
            },
            ...walletsChecked.map((wallet, walletIndex) => {
                return {
                    label: wallet.name,
                    data: eachWalletData[walletIndex]
                }
            })
        ]
    }
}