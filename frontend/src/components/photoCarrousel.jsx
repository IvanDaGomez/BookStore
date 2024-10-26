/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";


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
      <BsArrowLeftCircleFill onClick={prevSlide} className="arrow arrow-left" />
      {data.map((item, idx) => {
        return (
          <img
            src={item.src}
            alt={item.alt}
            key={idx}
            className={slide === idx ? "slide" : "slide slide-hidden"}
          />
        );
      })}
      <BsArrowRightCircleFill
        onClick={nextSlide}
        className="arrow arrow-right"
      />
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