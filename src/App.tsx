import { useState, useEffect } from 'react';
import image from './assets/0-floor.png';
import polygonData from './assets/data.json';
import styles from "./style.module.css";
import PolygonFilter from "./PolygonFilter.tsx";
import DisplayPolygonDataOnHover from './DisplayPolygonDataOnHover.tsx';

interface PolygonData {
  code: number;
  status: string;
  price: number;
}

const App: React.FC = () => {
  // Extract all price values
  const prices = polygonData.map(item => item.price);
  // Find minimum and maximum prices
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<PolygonData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [minValue, setMinValue] = useState<number>(minPrice); // Initial min value
  const [maxValue, setMaxValue] = useState<number>(maxPrice); // Initial max value

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxValue - 100);
    setMinValue(value);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minValue + 100);
    setMaxValue(value);
  };

  const handleStatusChanged = (newStatus: string) => {
    setSelectedStatus(newStatus);
  };

  // Apply filters to polygons using the DOM API
  const applyFilters = () => {
    const svgElement = document.querySelector("#uuid-59b76a1b-abe3-40a4-afca-d4837b2fbc74") as SVGElement;
    if (!svgElement) return;

    polygonData.forEach((polygon) => {
      const { code, status, price } = polygon;
      const polygonElement = svgElement.querySelector(`polygon[data-code="${code}"]`);

      if (polygonElement) {
        const matchesStatus = !selectedStatus || status === selectedStatus;
        const matchesPrice = price >= minValue && price <= maxValue;

        // Toggle visibility based on filters
        polygonElement.setAttribute("visibility", matchesStatus && matchesPrice ? "visible" : "hidden");

        // Event listeners for hover
        polygonElement.addEventListener("mouseenter", (event) => handleMouseEnter(event, polygon));
        polygonElement.addEventListener("mouseleave", handleMouseLeave);
      }
    });
  };

  // Mouse enter event to show tooltip
  const handleMouseEnter = (event: Event, polygon: PolygonData) => {
    const mouseEvent = event as MouseEvent;
    setHoveredPolygon(polygon);
    setTooltipPosition({ x: mouseEvent.clientX, y: mouseEvent.clientY });
  };

  // Mouse leave event to hide tooltip
  const handleMouseLeave = () => {
    setHoveredPolygon(null);
  };

  // Reapply filters whenever the filter state changes
  useEffect(() => {
    applyFilters();
  }, [selectedStatus, minValue, maxValue]);

  return (
    <>
      {/* Background Image */}
      <img
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: '#272727',
          objectFit: 'cover'
        }}
        src={image}
        alt="Background"
      />

      {/* Filter Controls */}
      <div className={styles.filterContainer}>
        <PolygonFilter
          onStatusChange={handleStatusChanged}
          minPriceValue={minPrice}
          maxPriceValue={maxPrice}
          currentMinPrice={minValue}
          onMinPriceChange={handleMinChange}
          currentMaxPrice={maxValue}
          onMaxPriceChange={handleMaxChange}
        />
      </div>

      <DisplayPolygonDataOnHover />

      {hoveredPolygon && (
        <div
          style={{
            position: 'fixed',
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '.5rem',
            padding: '.8rem .5rem',
            borderRadius: '5px',
            pointerEvents: 'none',
            zIndex: 15,
          }}
        >
          <div className={styles.polygon_item_hover}>
            <span>Status</span>
            <span className={`${styles.data_item_show_hover} ${styles.polygon_data_status_hover}`}>
              {hoveredPolygon.status}
            </span>
          </div>
          <div className={styles.polygon_item_hover}>
            <span>Price</span>
            <span className={`${styles.data_item_show_hover} ${styles.polygon_data_price_hover}`}>
              ${hoveredPolygon.price}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default App;


