import { useEffect, useState } from "react";

export default function Carousel({ images }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative">
      <img
        src={images[currentSlide]}
        alt={`Slide ${currentSlide + 1}`}
        className="w-full h-full object-cover transition-all duration-700"
      />
    </div>
  );
}
