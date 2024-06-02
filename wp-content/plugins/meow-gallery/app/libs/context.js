import { createContext } from "preact";
import { useContext, useReducer, useEffect } from "preact/hooks";
import { buildUrlWithParams, nekoFetch } from "./helper";

// const useHandleSWR = (swrData = undefined, defaultData = null, defaultBusy = false) => {
//   const [ data, setData ] = useState(defaultData);
//   const [ error, setError ] = useState(null);
//   const [ busy, setBusy ] = useState(defaultBusy);
//   const [ total, setTotal ] = useState(0);

//   useEffect(() => {
//     if (swrData !== undefined) {
//       if (swrData.success) {
//           setError(null);
//           setData(swrData.data);
//           setTotal(swrData.total ? swrData.total : 0);
//       }
//       else {
//           setError(swrData.error);
//       }
//     }
//     setBusy(swrData === undefined);
//   }, [ swrData ]);

//   return { busy, data, total, error };
// }

export const galleryLayouts = {
  tiles: 'tiles',
  masonry: 'masonry',
  justified: 'justified',
  square: 'square',
  cascade: 'cascade',
  carousel: 'carousel',
  map: 'map',
  horizontal: 'horizontal',
  none: 'none'
}
export const isLayoutTiles = (layout) => layout === galleryLayouts.tiles;
export const isLayoutMasonry = (layout) => layout === galleryLayouts.masonry;
export const isLayoutJustified = (layout) => layout === galleryLayouts.justified;
export const isLayoutSquare = (layout) => layout === galleryLayouts.square;
export const isLayoutCascade = (layout) => layout === galleryLayouts.cascade;
export const isLayoutCarousel = (layout) => layout === galleryLayouts.carousel;
export const isLayoutMap = (layout) => layout === galleryLayouts.map;
export const isLayoutHorizontal = (layout) => layout === galleryLayouts.horizontal;
export const isLayoutNone = (layout) => layout === galleryLayouts.none;
const verticalLayouts = [
  galleryLayouts.tiles,
  galleryLayouts.masonry,
  galleryLayouts.justified,
  galleryLayouts.square,
  galleryLayouts.cascade,
]
export const isVerticalLayout = (layout) => verticalLayouts.includes(layout);

const convertToOptions = (options) => {
  return {
    id: options.id,
    layout: options.layout,
    captions: options.captions,
    animation: options.animation,
    imageSize: options.image_size,
    infinite: options.infinite,
    infiniteBuffer: options.infinite_buffer,
    tilesGutter: options.tiles_gutter,
    tilesGutterTablet: options.tiles_gutter_tablet,
    tilesGutterMobile: options.tiles_gutter_mobile,
    tilesDensity: options.tiles_density,
    tilesDensityTablet: options.tiles_density_tablet,
    tilesDensityMobile: options.tiles_density_mobile,
    masonryGutter: options.masonry_gutter,
    masonryColumns: options.masonry_columns,
    justifiedGutter: options.justified_gutter,
    justifiedRowHeight: options.justified_row_height,
    squareGutter: options.square_gutter,
    squareColumns: options.square_columns,
    cascadeGutter: options.cascade_gutter,
    horizontalGutter: options.horizontal_gutter,
    horizontalImageHeight: options.horizontal_image_height,
    horizontalHideScrollbar: options.horizontal_hide_scrollbar,
    carouselGutter: options.carousel_gutter,
    carouselImageHeight: options.carousel_image_height,
    carouselArrowNavEnabled: options.carousel_arrow_nav_enabled,
    carouselDotNavEnabled: options.carousel_dot_nav_enabled,
    mapEngine: options.map_engine,
    mapHeight: options.map_height,
    mapGutter: options.map_gutter,
    googlemapsToken: options.googlemaps_token,
    googlemapsStyle: options.googlemaps_style,
    mapboxToken: options.mapbox_token,
    mapboxStyle: options.mapbox_style,
    maptilerToken: options.maptiler_token,
    rightClick: options.right_click,
    imageIds: options.image_ids,
    size: options.size,
    customClass: options.custom_class,
    link: options.link,
    isPreview: options.is_preview,
    updir: options.updir,
    classId: options.class_id,
    layouts: options.layouts,
    images: options.images,
    atts: options.atts,
  }
}

export const tilesRowClasses = {
  'high' : [
    // 1 image
    'o', 'i',
    // 2 images
    'oo', 'ii', 'oi', 'io',
    // 3 images
    'ooo', 'oii', 'ooi', 'ioo', 'oio', 'ioi', 'iio', 'iii',
    // 4 images
    'iooo', 'oioo', 'ooio', 'oooi', 'iiii', 'oooo',
    // 5 images
    'ioooo', 'ooioo', 'ooooi', 'iiooo', 'iooio', 'ooiio', 'ooioi', 'oooii', 'oiioo', 'oiooi', 'iiioo', 'iiooi', 'iooii', 'ooiii'
  ],
  'medium' : [
    // 1 image
    'o', 'i',
    // 2 images
    'oo', 'ii', 'oi', 'io',
    // 3 images
    'ooo', 'oii', 'ooi', 'ioo', 'oio', 'ioi', 'iio', 'iii'
  ],
  'low': [
    // 1 image
    'o', 'i',
    // 2 images
    //'oo', 'ii', 'oi', 'io'
  ]
}

export const tilesReferences = {
  'o': { 'box': 'a', 'orientation': 'landscape' },
  'i': { 'box': 'a', 'orientation': 'portrait' },
  /**
   * 2 images
   */
  'oo': { 'box': 'a', 'orientation': 'landscape' },
  'ii': { 'box': 'a', 'orientation': 'portrait' },
  'oi': { 'box': 'a', 'orientation': 'landscape' },
  'io': { 'box': 'a', 'orientation': 'portrait' },
  /**
   * 3 images
   */
  'ooo': { 'box': 'c', 'orientation': 'landscape' },
  'ioo': { 'box': 'b', 'orientation': 'landscape' },
  'oio': { 'box': 'a', 'orientation': 'landscape' },
  'ooi': { 'box': 'a', 'orientation': 'landscape' },
  'oii': { 'box': 'a', 'orientation': 'landscape' },
  'ioi': { 'box': 'b', 'orientation': 'landscape' },
  'iio': { 'box': 'c', 'orientation': 'landscape' },
  'iii': { 'box': 'a', 'orientation': 'portrait' },
  /**
   * 4 images
   */
  'oooo-v0': { 'box': 'c', 'orientation': 'landscape' },
  'oooo-v1': { 'box': 'a', 'orientation': 'landscape' },
  'oooo-v2': { 'box': 'a', 'orientation': 'landscape' },
  'oioo': { 'box': 'a', 'orientation': 'landscape' },
  'iooo': { 'box': 'd', 'orientation': 'landscape' },
  'ooio': { 'box': 'd', 'orientation': 'landscape' },
  'oooi': { 'box': 'a', 'orientation': 'landscape' },
  'iiii': { 'box': 'a', 'orientation': 'portrait' },
  /**
   * 5 images
   */
  'aoooo': { 'box': 'a', 'orientation': 'portrait' },
  'ioooo': { 'box': 'a', 'orientation': 'portrait' },
  'ooioo': { 'box': 'c', 'orientation': 'portrait' },
  'ooooi': { 'box': 'e', 'orientation': 'portrait' },
  'iiooo': { 'box': 'a', 'orientation': 'portrait' },
  'iooio': { 'box': 'a', 'orientation': 'portrait' },
  'ooiio': { 'box': 'e', 'orientation': 'landscape' },
  'ooioi': { 'box': 'c', 'orientation': 'portrait' },
  'oooii': { 'box': 'd', 'orientation': 'portrait' },
  'oiioo': { 'box': 'b', 'orientation': 'portrait' },
  'oiooi': { 'box': 'b', 'orientation': 'portrait' },
  'iiioo': { 'box': 'a', 'orientation': 'portrait' },
  'iiooi': { 'box': 'a', 'orientation': 'portrait' },
  'iooii': { 'box': 'a', 'orientation': 'portrait' },
  'ooiii': { 'box': 'c', 'orientation': 'portrait' }
}

/****************************************
  Initial state
****************************************/
let busyCounter = 0;

const initialState = {
  apiUrl: null,
  restNonce: null,

  id: null,
  images: [],
  imageIds: [],
  className: '',
  containerClassName: '',
  inlineStyle: {},
  loadImagesCount: 12,
  canInfiniteScroll: false,

  // settings
  layout: 'tiles',
  captions: 'none',
  animation: false,
  imageSize: 'srcset',
  infinite: false,
  infiniteBuffer: 0,
  tilesGutter: 10,
  tilesGutterTablet: 10,
  tilesGutterMobile: 10,
  tilesDensity: 'high',
  tilesDensityTablet: 'medium',
  tilesDensityMobile: 'low',
  masonryGutter: 5,
  masonryColumns: 3,
  justifiedGutter: 5,
  justifiedRowHeight: 200,
  squareGutter: 5,
  squareColumns: 5,
  cascadeGutter: 10,
  horizontalGutter: 5,
  horizontalImageHeight: 500,
  horizontalHideScrollbar: false,
  carouselGutter: 5,
  carouselImageHeight: 500,
  carouselArrowNavEnabled: true,
  carouselDotNavEnabled: true,
  mapEngine: '',
  mapHeight: 400,
  googlemapsToken: '',
  googlemapsStyle: '[]',
  mapboxToken: '',
  mapboxStyle: { username:'', style_id:'' },
  maptilerToken: '',
  rightClick: false,
  size: 'large',
  customClass: '',
  link: null,
  isPreview: false,
  updir: null,
  classId: null,
  gutter: 5,
  columns: 3,
  layouts: [],
  density: {
    desktop: 'high',
    tablet: 'medium',
    mobile: 'low',
  },
  imageHeight: 500,
  mglMap: {
    defaultEngine: (typeof mgl_map !== 'undefined') ? (mgl_map?.default_engine ?? '') : '',
    tilesProvider: (typeof mgl_map !== 'undefined') ? (mgl_map?.default_engine ?? '') : '',
    height: (typeof mgl_map !== 'undefined') ? (mgl_map?.height ?? 400) : 400,
    googlemaps: {
      apiKey: (typeof mgl_map !== 'undefined') ? (mgl_map?.googlemaps?.api_key ?? '') : '',
      style: (typeof mgl_map !== 'undefined') ? (mgl_map?.googlemaps?.style ?? '') : ''
    },
    mapbox: {
      apiKey: (typeof mgl_map !== 'undefined') ? (mgl_map?.mapbox?.api_key ?? '') : '',
      style: (typeof mgl_map !== 'undefined') ? (mgl_map?.mapbox?.style ?? '') : ''
    },
    maptiler: {
      apiKey: (typeof mgl_map !== 'undefined') ? (mgl_map?.maptiler?.api_key ?? '') : '',
      style: (typeof mgl_map !== 'undefined') ? (mgl_map?.maptiler?.style ?? '') : ''
    },
    center: [51.505, -0.09],
    lightboxable: true,
  },
  atts: {},
};

/****************************************
  Action types
****************************************/

const SET_IMAGES = "SET_IMAGES";
const SET_CLASS_NAMES = "SET_CLASS_NAMES";
const SET_CONTAINER_CLASS_NAMES = "SET_CONTAINER_CLASS_NAMES";
const SET_INLINE_STYLES = "SET_INLINE_STYLES";
const SET_GUTTER = "SET_GUTTER";
const SET_CULLUMNS = "SET_CULLUMNS";
const SET_DENSITY = "SET_DENSITY";
const SET_IMAGE_HEIGHT = "SET_IMAGE_HEIGHT";
const SET_API_URL = "SET_API_URL";
const SET_REST_NONCE = "SET_REST_NONCE";
const SET_CAN_INFINITE_SCROLL = "SET_CAN_INFINITE_SCROLL";
const PUSH_BUSY = 'PUSH_BUSY';
const POP_BUSY = 'POP_BUSY';
const ERROR_UPDATED = 'ERROR_UPDATED';

/****************************************
  Global reducer
****************************************/

const globalStateReducer = (state, action) => {
  switch (action.type) {

    case ERROR_UPDATED: {
      const { apiErrors } = action;
      return {...state, apiErrors };
    }

    case SET_IMAGES: {
      const { images } = action;
      return { ...state, images };
    }

    case PUSH_BUSY: {
      const { status = '' } = action;
      return { ...state, busy: ++busyCounter > 0, status };
    }

    case POP_BUSY: {
      const { status = '' } = action;
      return { ...state, busy: --busyCounter > 0, status };
    }

    case SET_CLASS_NAMES: {
      const { layout, customClass, animation, captions } = action;

      const classNameList = [];
      classNameList.push('mgl-gallery');
      classNameList.push('mgl-' + layout);

      if (customClass) {
        classNameList.push(customClass);
      }
      if (animation) {
        classNameList.push('is-animated');
        classNameList.push(animation);
      }
      if (captions) {
        classNameList.push('captions-' + captions);
      }

      return { ...state, className: classNameList.join(' ') };
    }

    case SET_CONTAINER_CLASS_NAMES: {
      const { layout } = action;
      const classNameList = [];
      classNameList.push('mgl-' + layout + '-container');
      return { ...state, containerClassName: classNameList.join(' ') };
    }

    case SET_INLINE_STYLES: {
      const { layout, justifiedRowHeight } = action;
      const inlineStyle = isLayoutJustified(layout) ? {"--rh": `${justifiedRowHeight}px`} : {};
      return { ...state, inlineStyle };
    }

    case SET_GUTTER: {
      const { layout, tilesGutter, tilesGutterTablet, tilesGutterMobile, masonryGutter, justifiedGutter, squareGutter,
        cascadeGutter, horizontalGutter, carouselGutter, mapGutter } = action;

      const gutters = {
        [galleryLayouts.tiles]: {
          desktop: parseInt(tilesGutter),
          tablet: parseInt(tilesGutterTablet),
          mobile: parseInt(tilesGutterMobile),
        },
        [galleryLayouts.masonry]: parseInt(masonryGutter),
        [galleryLayouts.justified]: parseInt(justifiedGutter),
        [galleryLayouts.square]: parseInt(squareGutter),
        [galleryLayouts.cascade]: parseInt(cascadeGutter),
        [galleryLayouts.horizontal]: parseInt(horizontalGutter),
        [galleryLayouts.carousel]: parseInt(carouselGutter),
        [galleryLayouts.map]: parseInt(mapGutter),
      };

      return { ...state, gutter: gutters[layout] };
    }

    case SET_CULLUMNS: {
      const { layout, masonryColumns, squareColumns } = action;

      const columns = {
        [galleryLayouts.masonry]: parseInt(masonryColumns),
        [galleryLayouts.square]: parseInt(squareColumns),
      };

      return { ...state, columns: columns[layout] };
    }

    case SET_DENSITY: {
      const { tilesDensity, tilesDensityTablet, tilesDensityMobile } = action;

      const density = {
        desktop: tilesDensity,
        tablet: tilesDensityTablet,
        mobile: tilesDensityMobile,
      };

      return { ...state, density };
    }

    case SET_IMAGE_HEIGHT: {
      const { layout, horizontalImageHeight, carouselImageHeight } = action;

      const imageHeight = {
        [galleryLayouts.horizontal]: parseInt(horizontalImageHeight),
        [galleryLayouts.carousel]: parseInt(carouselImageHeight),
      };

      return { ...state, imageHeight: imageHeight[layout] };
    }

    case SET_API_URL: {
      const { apiUrl } = action;
      return { ...state, apiUrl };
    }

    case SET_REST_NONCE: {
      const { restNonce } = action;
      return { ...state, restNonce };
    }

    case SET_CAN_INFINITE_SCROLL: {
      const { infinite, images, imageIds } = action;
      const canInfiniteScroll = infinite && images.length < imageIds.length
      return { ...state, canInfiniteScroll };
    }

    default:
      return state;
  }
};

/****************************************
  Global state
****************************************/

const MeowGalleryContext = createContext();

const useMeowGalleryContext = () => {
  const actions = {};
  const [state, dispatch] = useContext(MeowGalleryContext);

  actions.loadImages = async () => {
    const loadedImageIds = state.images.map(image => image.id);
    const imageIds = state.imageIds.filter(imageId => !loadedImageIds.includes(imageId)).slice(0, state.loadImagesCount);
    if (imageIds.length) {
      actions.fetchImages(imageIds);
    }
  };

  actions.fetchImages = async (imageIds) => {
    dispatch({ type: PUSH_BUSY });

    const url = buildUrlWithParams(`${state.apiUrl}/images/`, {
      imageIds: JSON.stringify(imageIds),
      atts: JSON.stringify(state.atts),
      layout: state.layout,
      size: state.size
    });

    try {
      const response = await nekoFetch(url, { nonce: state.restNonce });
      if (response.success) {
        dispatch({ type: SET_IMAGES, images: [...state.images, ...response.data] });
      }
    }
    catch (err) {
      if (err.message) {
        alert(err.message);
      }
    }
    finally {
      dispatch({ type: POP_BUSY });
    }
  };


  return { ...state, ...actions };
};


/****************************************
  Global state provider
****************************************/

export const MeowGalleryContextProvider = ({ options, galleryOptions, galleryImages, atts, apiUrl, restNonce, children }) => {
  const [state, dispatch] = useReducer(globalStateReducer, { ...initialState, ...convertToOptions({...options, ...galleryOptions, images: galleryImages, atts}) });

  const { layout, customClass, animation, captions, justifiedRowHeight, tilesGutter, tilesGutterMobile, tilesGutterTablet,
    tilesDensity, tilesDensityMobile, tilesDensityTablet, masonryGutter, justifiedGutter, squareGutter, cascadeGutter, horizontalGutter,
    carouselGutter, masonryColumns, squareColumns, horizontalImageHeight, carouselImageHeight, mapGutter, infinite, images, imageIds } = state;

  // // Fetch images
  // const swrImagesKey = useMemo( () => {
  //   return [buildUrlWithParams(`${apiUrl}/images/`, {
  //     imageIds: JSON.stringify(imageIds),
  //     atts: JSON.stringify(atts),
  //     layout,
  //     size
  //   }), { headers: { 'X-WP-Nonce': restNonce } }];
  // }, [apiUrl, restNonce, imageIds, atts, layout, size] );
  // const { data: swrImages, mutate: mutateImages } = useSWR(swrImagesKey, jsonFetcher);
  // const { busy: busyImages, data: images, error: imagesError } = useHandleSWR(swrImages, [], true);
  // useEffect(() => { dispatch({ type: SET_IMAGES, images }); }, [images]);
  // useEffect(() => { dispatch({ type: busyImages ? PUSH_BUSY : POP_BUSY }) }, [busyImages]);
  // useEffect(() => { dispatch({ type: ERROR_UPDATED, apiError: imagesError }); }, [imagesError]);

  // Set class names ans inline styles
  useEffect(() => { dispatch({ type: SET_CLASS_NAMES, layout, customClass, animation, captions }); }, [layout, customClass, animation, captions]);
  useEffect(() => { dispatch({ type: SET_CONTAINER_CLASS_NAMES, layout }); }, [layout]);
  useEffect(() => { dispatch({ type: SET_INLINE_STYLES, layout, justifiedRowHeight: justifiedRowHeight }); }, [layout, justifiedRowHeight]);
  useEffect(() => { dispatch({ type: SET_GUTTER, layout, tilesGutter, tilesGutterMobile, tilesGutterTablet, masonryGutter, justifiedGutter, squareGutter,
    cascadeGutter, horizontalGutter, carouselGutter, mapGutter }); }
  , [layout, tilesGutter, tilesGutterMobile, tilesGutterTablet, masonryGutter, justifiedGutter, squareGutter, cascadeGutter, horizontalGutter, carouselGutter, mapGutter]);
  useEffect(() => { dispatch({ type: SET_CULLUMNS, layout, masonryColumns, squareColumns }); }, [layout, masonryColumns, squareColumns]);
  useEffect(() => { dispatch({ type: SET_DENSITY, tilesDensity, tilesDensityMobile, tilesDensityTablet }); }, [tilesDensity, tilesDensityMobile, tilesDensityTablet]);
  useEffect(() => { dispatch({ type: SET_IMAGE_HEIGHT, layout, horizontalImageHeight, carouselImageHeight }); }, [layout, horizontalImageHeight, carouselImageHeight]);
  useEffect(() => { dispatch({ type: SET_API_URL, apiUrl }); }, [apiUrl]);
  useEffect(() => { dispatch({ type: SET_REST_NONCE, restNonce }); }, [restNonce]);
  useEffect(() => { dispatch({ type: SET_CAN_INFINITE_SCROLL, infinite, images, imageIds }); }, [infinite, images.length, imageIds?.length ?? []]);

  return (
    <MeowGalleryContext.Provider value={[state, dispatch]}>
      {children}
    </MeowGalleryContext.Provider>
  );
};

export default useMeowGalleryContext;

