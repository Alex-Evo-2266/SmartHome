import "./Loading.scss"; // Стиль для компонента

export const Loading = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Загрузка...</p>
  </div>
);