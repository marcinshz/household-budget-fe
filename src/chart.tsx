import {Chart} from 'chart.js';
import autocolors from 'chartjs-plugin-autocolors';
import {Chart as PrimeChart, ChartProps} from 'primereact/chart';

Chart.register(autocolors);
export const MyChart = (props: ChartProps) => <PrimeChart {...props}/>