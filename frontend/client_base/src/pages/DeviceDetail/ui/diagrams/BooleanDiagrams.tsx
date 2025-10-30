import { ColorContext, IColorContext } from 'alex-evo-sh-ui-kit';
import { 
  Chart as ChartJS, 
  LinearScale,
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale,
  ChartData,
  ChartOptions
} from 'chart.js';
import { useContext, useEffect, useRef } from 'react';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

import { DiagramProps } from './props';
import { getBooleanFieldStatus } from '../../helpers/BooleanFieldStatus';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export const BooleanTimelineChart: React.FC<DiagramProps> = ({ data: fieldHistory, label }) => {

    const {colors} = useContext<IColorContext>(ColorContext)
    
  // Правильное объявление ref с типизацией
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  useEffect(() => {
    // При размонтировании компонента уничтожаем график
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  if (!fieldHistory?.data?.length) {
    return <div>No data available</div>;
  }

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  function t(d:string){
    const d2 = new Date(d)
    return d2.getTime()
  }

  const chartData: ChartData<'line'> = {
    datasets: [{
      label: label ?? fieldHistory.name,
      data: fieldHistory.data.map(item => ({
        x: t(item.datatime),
        y: getBooleanFieldStatus(item.value, fieldHistory.high, fieldHistory.low) ? 1 : 0
      })),
      borderColor: colors.Tertiary_color,
      backgroundColor: colors.Tertiary_color,
      fill: false,
      stepped: "after",
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
      y: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (value) => 
            typeof value === 'number' ? (value === 1 ? "ON" : "OFF") : value,
        },
      },
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
            const value = ctx.parsed.y === 1 ? "ON" : "OFF";
            return `${label}: ${value} (${new Date(ctx.parsed.x).toLocaleTimeString()})`;
          },
        },
      },
    },
  };

  return (
    <div className='diagramm-min'>
      <Line 
        data={chartData} 
        options={options} 
        ref={chartRef}
        width={"auto"}
      />
    </div>
  );
};