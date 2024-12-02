import { useState } from "react";


export default function DoubleSlider({ width, min, max }) {
  const [minValue, setMinValue] = useState(min || 2500);
  const [maxValue, setMaxValue] = useState(max || 7500);
  const priceGap = 1000;

  const handleMinChange = (e) => {
    let value = parseInt(e.target.value);
    if (maxValue - value >= priceGap) {
      setMinValue(value);
    }
  };

  const handleMaxChange = (e) => {
    let value = parseInt(e.target.value);
    if (value - minValue >= priceGap) {
      setMaxValue(value);
    }
  };

  const handleRangeInput = (e) => {
    let value = parseInt(e.target.value);
    if (e.target.className === "range-min" && maxValue - value >= priceGap) {
      setMinValue(value);
    } else if (e.target.className === "range-max" && value - minValue >= priceGap) {
      setMaxValue(value);
    }
  };

  return (
    <div className="wrapper" style={{ width }}>
      <div className="price-input">
        <div className="field">
          <span>Min</span>
          <input
            type="number"
            className="input-min"
            value={minValue}
            onChange={handleMinChange}
          />
        </div>
        <div className="separator">-</div>
        <div className="field">
          <span>Max</span>
          <input
            type="number"
            className="input-max"
            value={maxValue}
            onChange={handleMaxChange}
          />
        </div>
      </div>
      <div className="slider">
        <div
          className="progress"
          style={{
            left: `${(minValue / max) * 100}%`,
            right: `${100 - (maxValue / max) * 100}%`
          }}
        ></div>
      </div>
      <div className="range-input">
        <input
          type="range"
          className="range-min"
          min={min}
          max={max}
          value={minValue}
          step="100"
          onChange={handleRangeInput}
        />
        <input
          type="range"
          className="range-max"
          min={min}
          max={max}
          value={maxValue}
          step="100"
          onChange={handleRangeInput}
        />
      </div>
    </div>
  );
}
