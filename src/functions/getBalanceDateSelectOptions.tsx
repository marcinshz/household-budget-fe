import {SelectNode, WalletListItem} from "../types.ts";

export function getBalanceDateSelectOptions(wallets: WalletListItem[], current) {
    const checkedWallets = wallets.filter((wallet) => {
        return wallet.checked;
    })

    let tmp: Date | unknown = null;

    checkedWallets.forEach((wallet) => {
        if (tmp) {
            if (new Date(wallet.createdAt) < tmp) tmp = new Date(wallet.createdAt)
        } else tmp = new Date(wallet.createdAt);
    })

    const oldest = tmp as Date;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();

    let yearNodes: SelectNode[] = [];

    for (let year = oldest.getFullYear(); year <= currentYear; year++) {
        let yearChildren: SelectNode[] = [];
        const monthMax = year === currentYear ? currentMonth : 12;
        for (let month = 1; month <= monthMax; month++) {
            let monthChildren: SelectNode[] = [];
            const dayMax = year === currentYear && month === currentMonth ? currentDay : new Date(year, month, 0).getDate();
            for (let day = 1; day <= dayMax; day++) {
                monthChildren.push({
                    label: day.toString(),
                    id: day.toString() + "." + month.toString() + "." + year.toString(),
                    data: day.toString() + "." + month.toString() + "." + year.toString(),
                    key: day.toString() + "." + month.toString() + "." + year.toString(),
                    children: []
                })
            }
            yearChildren.push({
                label: month.toString(),
                id: month.toString() + "." + year.toString(),
                data: month.toString() + "." + year.toString(),
                key: month.toString() + "." + year.toString(),
                children: monthChildren
            })
        }
        yearNodes.push({
            label: year.toString(),
            id: year.toString(),
            data: year.toString(),
            key: year.toString(),
            children: yearChildren
        })
    }

    console.log(yearNodes);
}