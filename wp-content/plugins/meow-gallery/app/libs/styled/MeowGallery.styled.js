import { styled } from "goober";
import {
    isLayoutTiles,
    isLayoutMasonry,
    isLayoutJustified,
    isLayoutSquare,
    isLayoutCascade,
    isLayoutCarousel,
    isLayoutMap,
    isLayoutHorizontal
} from "../context";

export const MeowGalleryContainer = styled('div')`
    ${props => isLayoutJustified(props.layout) && `
        #${props.classId} {
            display: ${props.isPreview ? 'block' : 'none'};
            margin: ${-1 * props.gutter / 2}px;
        }

        #${props.classId} .mgl-item {
            margin: ${props.gutter / 2}px;
        }
    `}

    ${props => isLayoutMasonry(props.layout) && `
        .mgl-masonry {
            display: ${props.isPreview ? 'block' : 'none'};
        }

        #${props.classId} {
            column-count: ${props.columns};
            margin: ${-1 * props.gutter / 2}px;
        }

        #${props.classId} .mgl-item, figcaption {
            padding: ${props.gutter / 2}px;
        }

        @media screen and (max-width: 800px) {
            #${props.classId} {
                column-count: 2;
            }
        }

        @media screen and (max-width: 600px) {
            #${props.classId} {
                column-count: 1;
            }
        }
    `}

    ${props => isLayoutSquare(props.layout) && `
        .mgl-square {
            display: ${props.isPreview ? 'block' : 'none'};
        }

        #${props.classId} {
		    margin: ${-1 * props.gutter / 2}px;
        }

        #${props.classId} .mgl-item {
            width: calc(100% / ${props.columns});
            padding-bottom: calc(100% / ${props.columns});
        }

        ${props.columns > 2 && `
            @media screen and (max-width: 460px) {
                #${props.classId} .mgl-item {
                    width: 50%;
                    padding-bottom: 50%;
                }
            }
        `}

        ${props.columns > 1 && `
            @media screen and (max-width: 360px) {
                #${props.classId} .mgl-item {
                    width: 100%;
                    padding-bottom: 100%;
                }
            }
        `}

        #${props.classId}.custom-gallery-class .mgl-item {
            padding-bottom: calc(100% / ${props.columns} / 1.5) !important;
        }

        #${props.classId} .mgl-item .mgl-icon {
            padding: ${props.gutter / 2}px;
        }

        #${props.classId} .mgl-item figcaption {
            padding: ${props.gutter / 2}px;
        }
    `}

    ${props => isLayoutCascade(props.layout) && `
        .mgl-cascade {
            display: ${props.isPreview ? 'block' : 'none'};
        }

        #${props.classId} {
            margin: ${-1 * props.gutter / 2}px;
        }

        #${props.classId} .mgl-box {
            padding: ${props.gutter / 2}px;
        }

        @media screen and (max-width: 600px) {
            #${props.classId}  figcaption {
                display: none
            }
        }
    `}

    ${props => isLayoutTiles(props.layout) && `
        .mgl-tiles {
            display: ${props.isPreview ? 'block' : 'none'};
        }

        #${props.classId} {
            margin: ${-1 * props.gutter.desktop / 2}px;
            width: calc(100% + ${props.gutter.desktop}px);
        }

        #${props.classId} .mgl-box {
            padding: ${props.gutter.desktop / 2}px;
        }

        @media screen and (max-width: 768px) {
            #${props.classId} {
                margin: ${-1 * props.gutter.tablet / 2}px;
                width: calc(100% + ${props.gutter.tablet}px);
            }

            #${props.classId} .mgl-box {
                padding: ${props.gutter.tablet / 2}px;
            }
        }

        @media screen and (max-width: 460px) {
            #${props.classId} {
                margin: ${-1 * props.gutter.mobile / 2}px;
                width: calc(100% + ${props.gutter.mobile}>px);
            }

            #${props.classId} .mgl-box {
                padding: ${props.gutter.mobile / 2}px;
            }
        }
    `}

    ${props => isLayoutHorizontal(props.layout) && `
        #${props.classId} {
            min-height: ${props.imageHeight}px;
        }

        #${props.classId} .meow-horizontal-track {
            height: ${props.imageHeight}px;
        }

        #${props.classId} .meow-horizontal-prev-btn, #${props.classId} .meow-horizontal-next-btn {
            top: ${props.imageHeight/2}px;
        }

        #${props.classId} .mgl-item {
            padding: 0 ${props.gutter / 2}px;
        }

        #${props.classId} .mgl-item figcaption {
            width: calc(100% - ${props.gutter}px);
            padding: 0 ${props.gutter / 2}px;
            left: ${props.gutter / 2}px;
        }
    `}

    ${props => isLayoutCarousel(props.layout) && `
        #${props.classId} {
            min-height: ${props.imageHeight}px;
        }

        #${props.classId} .meow-carousel-track {
            height: ${props.imageHeight}px;
        }

        #${props.classId} .meow-carousel-prev-btn, #${props.classId} .meow-carousel-next-btn {
            top: ${props.imageHeight / 2}px;
        }

        #${props.classId} .mgl-item {
            padding: 0 ${props.gutter / 2}px;
        }

        #${props.classId} .mgl-item figcaption {
            width: calc(100% - ${props.gutter}px);
            padding: 0 ${props.gutter / 2}px;
            left: ${props.gutter / 2}px;
        }
    `}

    ${props => isLayoutMap(props.layout) && `
        #${props.classId} .mgl-item .mgl-icon .mgl-map-container {
            height: ${props.mapHeight}px;
        }
    `}
`;