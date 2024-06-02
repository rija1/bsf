import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";

export const Square = () => {
    const { classId, className, inlineStyle, images } = useMeowGalleryContext();

    return (
        <div id={classId} className={className} style={inlineStyle}>
            {images.map((image) => <MeowGalleryItem image={image} /> )}
        </div>
    );
}