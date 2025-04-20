import { Line } from 'react-chartjs-2';
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
import { DiagramProps } from './props';
import 'chartjs-adapter-date-fns';
import React, { useContext } from 'react';
import { getBooleanFieldStatus } from '../../helpers/BooleanFieldStatus';
import { ColorContext } from 'alex-evo-sh-ui-kit';

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

    const {colors} = useContext(ColorContext)
    
  // Правильное объявление ref с типизацией
  const chartRef = React.useRef<ChartJS<'line'> | null>(null);

  React.useEffect(() => {
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

  const chartData: ChartData<'line'> = {
    datasets: [{
      label: label ?? fieldHistory.name,
      data: fieldHistory.data.map(item => ({
        x: new Date(item.datatime).getTime(),
        y: getBooleanFieldStatus(item.value, fieldHistory.high, fieldHistory.low) ? 1 : 0
      })),
      borderColor: colors.Tertiary_color,
      backgroundColor: colors.Tertiary_color,
      fill: false,
      stepped: "before",
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
      />
    </div>
  );
};