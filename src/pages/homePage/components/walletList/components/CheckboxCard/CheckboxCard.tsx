import {Card} from "primereact/card";
import {Checkbox, CheckboxChangeEvent} from "primereact/checkbox";
import './CheckboxCard.scss'
interface CheckboxCardProps{
    title: string,
    subTitle:string,
    checked: boolean,
    onChange: (event: CheckboxChangeEvent) => void

}
function CheckboxCard({title, subTitle, checked, onChange}: CheckboxCardProps) {
    return (
        <label className="checkbox-card">
            <Card title={title} subTitle={subTitle}>
                <Checkbox checked={checked} onChange={onChange}/>
            </Card>
        </label>
    );
}

export default CheckboxCard;