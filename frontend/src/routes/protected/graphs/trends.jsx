import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
export default function Trends({ info }) {

  const [topViewedTopics, setTopViewedTopics] = useState([]);
  useEffect(() => {
    if (Object.keys(info).length === 0) {
      return
    }
    setTopViewedTopics(
      Object.entries(info.trends).filter(obj => obj[0] !== '')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20).map((obj) => {
        return obj[0]
      }
    ))
  }, [info])
  return (<>
  <h2>Tendencias</h2>
  <p>En esta sección se mostrarán las tendencias de los libros más vendidos y los más vistos.</p>
  <div className="topViewedContainer">
    {topViewedTopics.map((topic, index) => (
      <div className="topViewed" key={index}>
        {topic}
      </div>
   ))}
  </div>
  </>)
}