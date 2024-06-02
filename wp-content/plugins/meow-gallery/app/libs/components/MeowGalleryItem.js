import { useMemo } from "preact/hooks";
import useMeowGalleryContext, { isLayoutJustified } from "../context";

export const MeowGalleryItem = ({ image }) => {

  const { isPreview, captions, layout } = useMeowGalleryContext();
  const { img_tag: img, img_element: element, link_href: linkUrl, link_target: linkTarget, link_rel: linkRel,
    meta, caption, id, attributes, classNames = [] } = image;
  const className = ['mgl-item', ...classNames].join(' ');

  const itemStyle = useMemo(() => {
    if (isLayoutJustified(layout)) {
      const { width, height } = meta;
      return { '--w': width, '--h': height }
    }
    return {};
  }, [layout, meta]);

  return (
    <figure className={className} style={itemStyle} {...attributes}>
      <div className="mgl-icon">
        {!isPreview && linkUrl ? (
          <div className="mgl-img-container">
            <a href={linkUrl} target={linkTarget} rel={linkRel}
              dangerouslySetInnerHTML={{ __html: img }}
            />
          </div>
        ) : (
          <div className="mgl-img-container" dangerouslySetInnerHTML={{ __html: img }} />
        )}
      </div>
      {captions && caption && (
        <figcaption className="mgl-caption">
          <p dangerouslySetInnerHTML={{ __html: caption }} />
        </figcaption>
      )}
    </figure>
  )
}