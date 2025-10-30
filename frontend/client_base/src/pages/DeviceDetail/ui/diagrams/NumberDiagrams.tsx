import { ColorContext, IColorContext } from 'alex-evo-sh-ui-kit';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { useContext } from 'react';
import { Line } from 'react-chartjs-2';

import { DiagramProps } from './props';

import './Diagramm.scss'

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



export const NumberDiagram: React.FC<DiagramProps> = ({data: fieldHistory, label}) => {

  const {colors} = useContext<IColorContext>(ColorContext)

  if(fieldHistory === null)
    return null

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const values = fieldHistory?.data.map((item) => ({...item, value: parseFloat(item.value)})).reverse();

    const chartData: ChartData<'line'> = {
      datasets: [{
        label: label ?? fieldHistory.name,
        data: values.map(item => ({
          x: new Date(item.datatime).getTime(),
          y: item.value
        })),
        borderColor: colors.Tertiary_color,
        backgroundColor: colors.Tertiary_color,
        fill: true,
        tension: 0,
        pointRadius: 5,
      }],
    };


const options: ChartOptions<'line'> = {
    responsive: true,
    animation: {
      duration: 0
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'MM-dd HH:mm'
          },
          tooltipFormat: 'yyyy-MM-dd HH:mm'
        },
        min: twentyFourHoursAgo.getTime(),
        max: now.getTime(),
        title: {
          display: true,
          text: 'Time (Last 24 hours)'
        }
      },
    },
    plugins: {
      legend: { 
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.dataset.label || '';
            const value = ctx.parsed.y;
            return `${label}: ${value} (${new Date(ctx.parsed.x).toLocaleTimeString()})`;
          },
        },
      },
    },
  };
 

  return <div className='diagramm-min'>
    <Line data={chartData} options={options} /> 
  </div> 
};
