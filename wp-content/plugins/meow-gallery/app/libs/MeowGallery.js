import { h } from "preact";
import { setup } from "goober";
import { useCallback, useEffect, useMemo } from "preact/hooks";
import useMeowGalleryContext, { galleryLayouts, isVerticalLayout } from "./context";
import { Justified } from "./layouts/Justified";
import { MeowGalleryContainer } from "./styled/MeowGallery.styled";
import { Masonry } from "./layouts/Masonry";
import { Square } from "./layouts/Square";
import { Cascade } from "./layouts/Cascade";
import { Tiles } from "./layouts/Tiles";
import { Horizontal } from "./layouts/Horizontal";
import { Carousel } from "./layouts/Carousel";
import { Map } from "./layouts/Map";

setup(h);

export const MeowGallery = () => {
  const { layout, containerClassName, isPreview, gutter, density, columns, classId,
    imageHeight, rightClick, mapHeight, infinite, infiniteBuffer, busy, canInfiniteScroll } = useMeowGalleryContext();
  const { loadImages } = useMeowGalleryContext();
  const isVertical = isVerticalLayout(layout);

  const galleryContent = useMemo(() => {
    switch (layout) {
      case galleryLayouts.justified:
        return <Justified />;
      case galleryLayouts.masonry:
        return <Masonry />;
      case galleryLayouts.square:
        return <Square />;
      case galleryLayouts.cascade:
        return <Cascade />;
      case galleryLayouts.tiles:
        return <Tiles />;
      case galleryLayouts.horizontal:
        return <Horizontal />;
      case galleryLayouts.carousel:
        return <Carousel />;
      case galleryLayouts.map:
        return <Map />;
      default:
        return (
          <p>Sorry, not implemented yet! : {layout}</p>
        );
    }
  }, [layout]);

  const onContextMenu = useCallback((e) => {
    if (!rightClick) {
      e.preventDefault();
    }
  }, [rightClick]);

  useEffect(() => {
    if (infinite && isVertical) {
      const onScroll = (e) => {
        if (busy) {
          return;
        }
        const loadImagesArea = document.querySelector(`#${classId}`)?.nextElementSibling;
        if (!loadImagesArea?.classList.contains('mgl-infinite-scroll')) {
          return;
        }
        const scrollValue = window.scrollY + window.innerHeight;
        const loadImagesAreaTop = loadImagesArea.offsetTop - infiniteBuffer;
        const needsLoading = scrollValue > loadImagesAreaTop;
        if (needsLoading) {
          loadImages();
        }
      }
      if (!canInfiniteScroll) {
        return () => window.removeEventListener('scroll', onScroll);
      }
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [infinite, isVertical, infiniteBuffer, busy, loadImages, canInfiniteScroll]);

  return (
    <MeowGalleryContainer
      className={containerClassName}
      layout={layout}
      isPreview={isPreview}
      gutter={gutter}
      columns={columns}
      classId={classId}
      imageHeight={imageHeight}
      mapHeight={mapHeight}
      onContextMenu={onContextMenu}
    >
      {galleryContent}
      {canInfiniteScroll && isVertical && <div className="mgl-infinite-scroll"></div>}
    </MeowGalleryContainer>
  )
}