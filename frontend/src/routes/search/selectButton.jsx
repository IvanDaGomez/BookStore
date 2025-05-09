/* eslint-disable react/prop-types */
/*
Filter type: {
  name: string,
  param: string,
  values: string[]
}
*/
export default function SelectButton ({ filter, callback, index }) {
  return (<>
  <div className="filterWrapper"
  style={{ zIndex: 100 - index}}>
    <div className="filters">
      <div className="filterOption">
        {filter.name}
      </div>
      {filter.values.map((value, i) => (
        <div className="filterOption" key={i}
        
        onClick={callback}
        >
          {value}
        </div>
      ))}
    </div>
  </div>
  </>)
}