/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

export default function LazyBackground({
  imageUrl = "/tu-imagen-grande.jpg",
  content = null,
  className = ""
}) {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`lazy-background ${className}`}
      style={{
        height: "100%",
        aspectRatio: "2 / 3",
        backgroundImage: isVisible
          ? `url('${imageUrl}')`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      {content}
    </div>
  );
}
