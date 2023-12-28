import {SelectNode, WalletListItem} from "../types.ts";

export function getBalanceDateSelectOptions(wallets: WalletListItem[]) {
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

    if (!oldest) return;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let yearNodes: SelectNode[] = [];

    for (let year = oldest.getFullYear(); year <= currentYear; year++) {
        let yearChildren: SelectNode[] = [];
        const monthMax = year === currentYear ? currentMonth : 12;
        for (let month = oldest.getMonth() + 1; month <= monthMax; month++) {
            yearChildren.push({
                label: month.toString(),
                id: month.toString() + "." + year.toString(),
                data: month.toString() + "." + year.toString(),
                key: month.toString() + "." + year.toString(),
                children: []
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

    return yearNodes
}