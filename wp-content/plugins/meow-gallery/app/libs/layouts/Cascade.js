import { useCallback, useMemo } from "preact/hooks";
import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";

export const Cascade = () => {
    const { classId, className, inlineStyle, images, layouts } = useMeowGalleryContext();

    const getLayout = useCallback((images) => {
        return images.reverse().map((image) => image.meta.width >= image.meta.height ? 'o' : 'i').join('');
	}, [])

    const getIdealLayout = useCallback((startIndex, size, lastIdeal = null) => {
        if (size <= 0) {
            return { result: false, ideal: lastIdeal, size: null, currentImages: null }
        }
        const currentImages = images.slice(startIndex, startIndex + size)
        const ideal = getLayout(currentImages)
        return layouts.includes(ideal)
            ? { result: true, ideal, size, currentImages }
            : getIdealLayout(startIndex, size - 1, ideal)
    }, [images, layouts, getLayout])

    const arrangedImages = useMemo(() => {
        let startIndex = 0;
        const maxIndex = images.length - 1;
        const arrangedImages = [];
        while (maxIndex >= startIndex) {
            const { result, ideal, size, currentImages } = getIdealLayout(startIndex, 2)
            arrangedImages.push({ showError: !result, layout: ideal, images: currentImages })
            startIndex += size
        }
        return arrangedImages
    }, [images, getIdealLayout]);

    return (
        <div id={classId} className={className} style={inlineStyle}>
            {arrangedImages.map(({ showError, layout, images }) => {
                if (showError) {
                    <div style="padding: 20px; background: darkred; color: white;">
                        MEOW GALLERY ERROR. No layout for {layout}
                    </div>
                }
                return (
                    <div class={`mgl-row mgl-layout-${layout.length}-${layout}`} data-cascade-layout={layout}>
                        {images.map((image, i) => <div class={`mgl-box ${String.fromCharCode(97+i)}`}><MeowGalleryItem image={image} /></div> )}
                    </div>
                )
            })}
        </div>
    );
}