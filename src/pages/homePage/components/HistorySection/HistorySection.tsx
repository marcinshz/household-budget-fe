import React, {useState} from 'react';
import {SelectButton} from "primereact/selectbutton";
import './HistorySection.scss'
import {Chart} from "primereact/chart";
import {TransactionsGrouped} from "../../../../types.ts";

enum HistorySectionView {
    DAYS = 'days',
    MONTHS = 'months',
    YEARS = 'years',
}

type HistorySectionProps = {
    view?: HistorySectionView;
    data: TransactionsGrouped;
}

function HistorySection({view = HistorySectionView.DAYS, data}: HistorySectionProps) {
    const [historyView, setHistoryView] = useState<HistorySectionView>(view);
    return (
        <div className='history-section'>
            <div className='history-section__row'>
                <h2 className='history-section__header'>History</h2>
                <div className='history-section__filter'>
                    <h3 className='history-section__filter__label'>View by</h3>
                    <SelectButton
                        options={['days', 'months', 'years']}
                        value={historyView}
                        onChange={(e) => setHistoryView(e.value)}
                    />
                </div>
            </div>
            <Chart type="bar" options={{
                type: 'bar',
                data: {},
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Transactions History'
                        },
                    },
                    responsive: true,
                    interaction: {
                        intersect: false,
                    },
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true
                        }
                    }
                }
            }}/>
        </div>
    );
}

export default HistorySection;