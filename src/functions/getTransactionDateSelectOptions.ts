import {SelectNode, StackBarVariant, TransactionsGrouped} from "../types.ts";
import * as _ from "lodash";

export function getTransactionDateSelectOptions(transactionVariant: StackBarVariant, transactionsGrouped: {
    incomes: TransactionsGrouped,
    expenses: TransactionsGrouped
}) {
    let tmp: TransactionsGrouped = {};
    if (transactionVariant === StackBarVariant.EXPENSE) {
        tmp = transactionsGrouped.expenses;
    } else {
        tmp = transactionsGrouped.incomes;
    }
    let selectNodes: SelectNode[] = [];

    _.forEach(tmp, (_value, yearKey) => {
        let yearChildren: SelectNode[] = [];
        _.forEach(tmp[yearKey].months, (_value, monthKey) => {
            let monthChildren: SelectNode[] = [];
            _.forEach(tmp[yearKey].months[monthKey].days, (_value, dayKey) => {
                monthChildren.push({
                    label: dayKey,
                    id: dayKey,
                    key: dayKey + "." + monthKey + "." + yearKey,
                    data: dayKey + "." + monthKey + "." + yearKey,
                    children: []
                })
            })
            yearChildren.push({
                label: monthKey,
                id: monthKey,
                key: monthKey + "." + yearKey,
                data: monthKey + "." + yearKey,
                children: monthChildren
            })
        })
        selectNodes.push({
            label: yearKey,
            id: yearKey,
            key: yearKey,
            data: yearKey,
            children: yearChildren
        })
    })
    return selectNodes;
}