import { useState } from "react";
import "./priceRange.css";
// eslint-disable-next-line react/prop-types
export default function PriceRange({ min = 0, max = 1000000 }) {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const formatNumber = (number) => {
    const numberString = number.toString();
    const parts = numberString.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedIntegerPart + decimalPart;
  };

  const handleMinChange = (value) => {
    if (value <= maxValue) {
      setMinValue(value);
    }
  };

  const handleMaxChange = (value) => {
    if (value >= minValue) {
      setMaxValue(value);
    }
  };

  return (
    <>
    <div className="priceSelector">
      <span>{formatNumber(minValue)}</span>
      <div>
        <input
          className="min input-ranges"
          name="range_1"
          type="range"
          step={10000}
          min={min}
          max={max}
          value={minValue}
          onChange={(e) => handleMinChange(parseInt(e.target.value, 10))}
        />
        <input
          className="max input-ranges"
          name="range_1"
          type="range"
          step={10000}
          min={min}
          max={max}
          value={maxValue}
          onChange={(e) => handleMaxChange(parseInt(e.target.value, 10))}
        />
      </div>
      <span>{formatNumber(maxValue)}</span>
      </div>
    </>
  );
};