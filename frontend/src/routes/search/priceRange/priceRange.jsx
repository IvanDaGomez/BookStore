import { useState } from 'react'
import './priceRange.css'
export default function PriceRange ({ setResults, results, setPriceRange, min, max }) {
  const [minValue, setMinValue] = useState(min)
  const [maxValue, setMaxValue] = useState(max)
  return(<>
{/* 
        <div className="values">
          <div>$<span id="first">{minValue}</span></div> -
          <div>$<span id="second">{maxValue}</span></div>
        </div> */}


        <input className="min input-ranges" name="range_1" type="range" step={10000} min={`${min}`} max={`${1000000}`} value={minValue} onChange={(e)=> setMinValue(e.target.value)}/>
        <input className="max input-ranges" name="range_1" type="range" step={10000} min={`${min}`} max={`${1000000}`} value={maxValue} onChange={(e)=> setMaxValue(e.target.value)}/>

  </>)

}