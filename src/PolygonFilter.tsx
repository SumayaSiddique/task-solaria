import React from 'react';
import styles from "./style.module.css";

interface PolygonFilterProps {
    onStatusChange: (status: string) => void;
    minPriceValue: number;
    maxPriceValue: number;
    currentMinPrice: number;
    currentMaxPrice: number;
    onMinPriceChange: React.ChangeEventHandler<HTMLInputElement>;
    onMaxPriceChange: React.ChangeEventHandler<HTMLInputElement>;
}

const PolygonFilter: React.FC<PolygonFilterProps> = ({
    onStatusChange,
    minPriceValue,
    maxPriceValue,
    currentMinPrice,
    currentMaxPrice,
    onMinPriceChange,
    onMaxPriceChange
}) => {
    const minThumbPercent = ((currentMinPrice - minPriceValue) / (maxPriceValue - minPriceValue)) * 100;
    const maxThumbPercent = ((currentMaxPrice - minPriceValue) / (maxPriceValue - minPriceValue)) * 100;

    const formatCurrency = (value: number): string => {
        if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        return `${value}`;
    };

    const statusOptions = ['available', 'reserved', 'sold', ''];
    const statusLabels = ['Available', 'Reserved', 'Sold', 'All'];

    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterItem}>
                <span>Type</span>
                <div className={styles.filterButtons}>
                    {statusOptions.map((option, index) => (
                        <button
                            key={index}
                            className={`${styles.filterButton} ${styles[option]}`}
                            onClick={() => onStatusChange(option)}
                        >
                            {statusLabels[index]}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.filterItem}>
                <label htmlFor="priceRangeSlider">Price:</label>
                <div className={styles.sliderControls}>
                    <input
                        id="minPriceSlider"
                        type="range"
                        min={minPriceValue}
                        max={maxPriceValue}
                        value={currentMinPrice}
                        onChange={onMinPriceChange}
                        style={{ zIndex: currentMinPrice > currentMaxPrice - 1 ? 5 : 3 }}
                    />
                    <input
                        id="maxPriceSlider"
                        type="range"
                        min={minPriceValue}
                        max={maxPriceValue}
                        value={currentMaxPrice}
                        onChange={onMaxPriceChange}
                    />
                    <div
                        className={styles.sliderTrack}
                        style={{
                            left: `${minThumbPercent}%`,
                            right: `${100 - maxThumbPercent}%`,
                        }}
                    />
                </div>
                <div className={styles.priceRangeDisplay}>
                    <span>Min: {formatCurrency(currentMinPrice)}$</span>
                    <span>Max: {formatCurrency(currentMaxPrice)}$</span>
                </div>
            </div>
        </div>
    );
};

export default PolygonFilter;


