/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";


export const Carousel = ({ data }) => {
  const [slide, setSlide] = useState(0);
  const [time, setTime] = useState(false)

  const nextSlide = () => {
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]); // Only re-run if data changes
  return (
    <div className="carousel">
      <div className="arrow arrow-left" onClick={prevSlide} >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={32} height={32} color={"#808080"} fill={"none"}>
    <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
      </div>
      {data.map((item, idx) => {
        return (
          <div className={slide === idx ? "slide" : "slide slide-hidden"} style={{backgroundImage: `url(${item.src})`}} key={idx}>
            {item?.extraComponents && item.extraComponents.map((component, index)=>(
              <div key={index} style={{position: 'absolute', height: component.height, width: component.width, top: component?.top, left: component?.left, right: component?.right, bottom: component?.bottom}}>
                {component.component}
              </div>
            ))}
          </div>

        );
      })}
      <div className="arrow arrow-right" onClick={nextSlide} style={{transform: (document.body.scrollHeight > document.body.clientHeight) ? 'translateX(-2rem)': 'none'}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={32} height={32} color={"#8e8894"} fill={"none"}>
        <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg></div>

      <span className="indicators">
        {data.map((_, idx) => {
          return (
            <button
              key={idx}
              className={
                slide === idx ? "indicator" : "indicator indicator-inactive"
              }
              onClick={() => setSlide(idx)}
            ></button>
          );
        })}
      </span>
    </div>
  );
};