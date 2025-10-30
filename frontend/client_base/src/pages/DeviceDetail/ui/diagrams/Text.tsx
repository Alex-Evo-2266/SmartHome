// Timeline.tsx

import { DiagramProps } from './props';
import { StatusDevice } from '../../../../entites/devices';
import { FieldHistoryItem } from '../../../../entites/devices/models/history';

const Timeline: React.FC<DiagramProps> = ({ 
  data: history, 

}) => {
    const   showStatus = true, showValueDiff = false 
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: StatusDevice) => {
    switch (status) {
      case StatusDevice.ONLINE: return '#51cf66';
      case StatusDevice.OFFLINE: return '#868e96';
      case StatusDevice.UNLINK: return '#fcc419';
      case StatusDevice.UNKNOWN: return '#ff6b6b';
      default: return '#adb5bd';
    }
  };

  if (!history)
    return null

  const renderValue = (item: FieldHistoryItem, index: number) => {
    if (!showValueDiff || index === 0) {
      return <div className="timeline-value">{item.value}</div>;
    }

    const prevItem = history.data[index - 1];
    return (
      <div className="value-diff">
        <div className="diff-line del">
          <span className="diff-prefix">-</span> {prevItem.value}
        </div>
        <div className="diff-line add">
          <span className="diff-prefix">+</span> {item.value}
        </div>
      </div>
    );
  };

  return (
    <div className='diagramm-min diagramm-min-text'>
        <div className="timeline-container">
            <h3 className="timeline-title">
                История поля: {history.name} ({history.type})
                {history.low && history.high && 
                <span className="range">Диапазон: [{history.low} - {history.high}]</span>}
            </h3>
            
            <div className="timeline">
                {history.data.map((item, index) => (
                <div key={item.id} className="timeline-item">
                    <div className="timeline-marker" 
                        style={{ backgroundColor: getStatusColor(item.status) }} />
                    
                    <div className="timeline-content">
                    <div className="timeline-header">
                        <span className="timeline-date">{formatDateTime(item.datatime)}</span>
                        {showStatus && (
                        <span className="timeline-status" 
                                style={{ color: getStatusColor(item.status) }}>
                            {item.status}
                        </span>
                        )}
                    </div>
                    
                    {renderValue(item, index)}
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Timeline;