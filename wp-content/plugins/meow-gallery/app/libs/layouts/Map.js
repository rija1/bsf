import useMeowGalleryContext from "../context";
import { useMap } from "./hooks";

export const Map = () => {
    const { classId, className, inlineStyle, mglMap } = useMeowGalleryContext();
    const mapId = useMap()

    return (
        <div id={classId} className={className} style={{...inlineStyle, height: `${mglMap.height}px` }}>
            <div id={mapId} class="mgl-ui-map"></div>
        </div>
    );
}