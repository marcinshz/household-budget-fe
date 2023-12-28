import {format} from "date-fns";
import {ProgressBar} from "primereact/progressbar";
import {Card} from "primereact/card";
import {Limit} from '../../../../../types';
import './ExpenseLimitCard.scss';

export type ExpenseLimitCardProps = {
    limit: Limit;
    currency: string;
}

function ExpenseLimitCard({limit, currency}: ExpenseLimitCardProps) {
    return (
        <Card title={limit.category.name}
              subTitle={format(new Date(limit.start), 'dd.MM.yyyy') + " - " + format(new Date(limit.deadline), 'dd.MM.yyyy')}
              key={limit.id}>
            <div className="expense-limit-card">
                <ProgressBar value={Math.round(limit.currentValue / limit.value * 100)}/>
                <div className="expense-limit-card__values">
                    <h3>{limit.currentValue + ' ' + currency}</h3>
                    <h3>{limit.value + ' ' + currency}</h3>
                </div>
            </div>

        </Card>
    );
}

export default ExpenseLimitCard;