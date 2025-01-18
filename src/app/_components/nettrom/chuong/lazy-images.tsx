import MangaImage from "~/app/_components/manga-image";
import {
  ScrollPosition,
  trackWindowScroll,
} from "react-lazy-load-image-component";

const Gallery = ({
  images,
  threshold,
  scrollPosition,
}: {
  images: string[];
  scrollPosition: ScrollPosition;
  threshold: number;
}) => (
  <div className="flex flex-col items-center">
    {" "}
    {/* Centering container */}
    {images.map((image, index) => (
      <div className="flex w-full justify-center" key={image}>
        {" "}
        {/* Centering each image */}
        <MangaImage
          key={image}
          alt={`Trang ${index}`}
          data-index={index}
          scrollPosition={scrollPosition}
          src={image}
          threshold={threshold}
          index={index}
          className="custom-manga-image-class"
        />
      </div>
    ))}
  </div>
);

export default trackWindowScroll(Gallery);
