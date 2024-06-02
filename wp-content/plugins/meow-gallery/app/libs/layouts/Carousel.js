import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { MeowGalleryItem } from "../components/MeowGalleryItem";
import useMeowGalleryContext from "../context";
import { getCenterOffset, getTranslateValues } from "../helper";

export const Carousel = () => {
    const ref = useRef(null);
    const trackRef = useRef(null)
    const { classId, className, inlineStyle, images, carouselGutter, carouselArrowNavEnabled,
        carouselDotNavEnabled } = useMeowGalleryContext()

    const [trackClassNames, setTrackClassNames] = useState([])
    const [trackTransform, setTrackTransform] = useState('')
    const [trackWidth, setTrackWidth] = useState(0)
    const [mglItemElements, setMglItemElements] = useState([])
    const [currentIndex, setCurrentIndex] = useState()
    const [isClicking, setIsClicking] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [startMousePositionX, setStartMousePositionX] = useState(0)
    const [startTrackTranslation, setStartTrackTranslation] = useState(0)
    const [deltaMoveX, setDeltaMoveX] = useState(0)

    const carouselItems = useMemo(() => {
        const numberOfImages = images.length
        return numberOfImages === 0
            ? []
            : [
                {...images.at(-1), classNames: ['clone','last-item'] },
                {...images.at(numberOfImages > 1 ? -2 : -1), classNames: ['clone','before-last-item'] },
                ...images,
                {...images.at(0), classNames: ['clone','first-item'] },
                {...images.at(numberOfImages > 1 ? 1 : 0), classNames: ['clone','second-item'] },
            ].map((image, index) => (
                {
                    ...image,
                    dataIndex: index,
                    classNames: index === currentIndex ? [...(image.classNames ?? []), 'active'] : image.classNames,
                    attributes: { ...image.attributes, 'data-mc-index': index }
                }
            ))
    }, [images, currentIndex])
    const isCloneItem = useCallback((index) => carouselItems.find(v => v.dataIndex === index).classNames.includes('clone'), [carouselItems])
    const currentItem = useMemo(() => carouselItems.find(v => v.dataIndex === currentIndex), [carouselItems, currentIndex])
    const numberOfItems = carouselItems.length
    const firstIndex = 2;
    const lastIndex = numberOfItems - 3;

    // Slide features
    const slideCarouselTo = useCallback((destination, noTransition = false) => {
        if (!ref.current || !mglItemElements.length || destination == null) {
            return
        }
        const newIndex = parseInt(destination)
        setTrackClassNames(noTransition ? ['no-transition'] : [])
        const nextElement = mglItemElements.find(v => v.dataIndex === newIndex).element
        const tx = ( -1 * (getCenterOffset(nextElement) - ref.current.offsetWidth / 2) );
        setTrackTransform(`translate3d(${tx}px, 0, 0)`)

        if (noTransition) {
            setTimeout(() => {
                setTrackClassNames([])
            })
        }
        setCurrentIndex(newIndex)
    }, [ref, mglItemElements])

    const slideCarouselToPrev = useCallback(() => {
        let baseIndex = currentIndex
        if (isCloneItem(currentIndex)) {
            if (currentItem.classNames.includes('last-item')) {
                slideCarouselTo(lastIndex, true)
                baseIndex = lastIndex
            }
        }
        setTimeout(() => {
            const prevIndex = baseIndex === 0 ? numberOfItems - 1 : baseIndex - 1
            slideCarouselTo(prevIndex)
        }, 1)
    }, [isCloneItem, currentIndex, currentItem, numberOfItems, slideCarouselTo])

    const slideCarouselToNext = useCallback(() => {
        let baseIndex = currentIndex
        if (isCloneItem(currentIndex) && currentItem.classNames.includes('first-item')) {
            const nextIndex = carouselItems.find(v => !v.classNames?.includes('clone')).dataIndex
            slideCarouselTo(nextIndex, true)
            baseIndex = nextIndex
        }
        setTimeout(() => {
            const nextIndex = baseIndex === numberOfItems - 1 ? 0 : baseIndex + 1
            slideCarouselTo(nextIndex)
        }, 1)
    }, [isCloneItem, currentIndex, currentItem, carouselItems, numberOfItems, slideCarouselTo])

    // functions for mouse events
    const checkForBorder = () => {
        if (!ref.current || !trackRef.current || !mglItemElements.length) {
            return false
        }
        const carouselPosX = ref.current.getBoundingClientRect().left
        const carouselCenterPosX = carouselPosX + ref.current.offsetWidth / 2
        const leftLimit = mglItemElements[1].element.getBoundingClientRect().left + mglItemElements[1].element.offsetWidth / 2
        const rightLimit = mglItemElements[mglItemElements.length - 2].element.getBoundingClientRect().left + mglItemElements[mglItemElements.length - 2].element.offsetWidth / 2
        if (carouselCenterPosX - leftLimit <= 0) {
            slideCarouselTo(lastIndex, true)
            setStartTrackTranslation(parseFloat( getTranslateValues(trackRef.current)[0] ))
            return true
        }
        if (carouselCenterPosX - rightLimit >= 0) {
            slideCarouselTo(2, true)
            setStartTrackTranslation(parseFloat( getTranslateValues(trackRef.current)[0] ))
            return true
        }
        return false
    }

    const getMagnetizedItem = () => {
        if (!ref.current) {
            return null
        }
        // get the center of the carousel relative to the window
        const carouselPosX = ref.current.getBoundingClientRect().left
        const carouselCenterPosX = carouselPosX + ref.current.offsetWidth / 2
        let smallestMagnetization = false
        let mostMagnetizedItem = 0
        mglItemElements.forEach((data, index) => {
            const itemCenterOffset = data.element.getBoundingClientRect().left + data.element.offsetWidth / 2
            const magnetization =  Math.abs( carouselCenterPosX - itemCenterOffset )
            if (!smallestMagnetization || magnetization < smallestMagnetization) {
                smallestMagnetization = magnetization
                mostMagnetizedItem = index
            }
        })
        return mostMagnetizedItem
    }

    // Mouse events
    const mouseDownHandler = useCallback((e) => {
        if (!trackRef.current) {
            return
        }
        setIsClicking(true)
        if (e.type === 'touchstart') {
            setStartMousePositionX(e.touches[0].pageX)
        } else {
            setStartMousePositionX(e.clientX)
        }
        setStartTrackTranslation(parseFloat(getTranslateValues(trackRef.current)[0]))
    }, [trackRef])

    const mouseMoveHandler = useCallback((e) => {
        if (!isClicking || !trackRef.current) {
            return
        }
        trackRef.current.querySelectorAll('.mwl-img').forEach(mwlImage => {
            mwlImage.classList.remove('mwl-img')
            mwlImage.classList.add('mwl-img-disabled')
        })
        setIsDragging(true)
        trackRef.current.classList.add('no-transition')

        if (checkForBorder()) {
            setStartMousePositionX(e.clientX)
        } else {
            const newDeltaX = e.type === 'touchmove'
                ? startMousePositionX - e.touches[0].pageX
                : startMousePositionX - e.clientX
            setDeltaMoveX(newDeltaX)
            trackRef.current.style.transform = 'translate3d('+ ( startTrackTranslation - newDeltaX ) + 'px, 0, 0)'
        }
    }, [isClicking, trackRef, checkForBorder, startMousePositionX, startTrackTranslation])

    const mouseUpHandler = useCallback(() => {
        if (!trackRef.current) {
            return
        }
        const wasDragging = isDragging
        trackRef.current.classList.remove('no-transition')
        setIsDragging(false)
        setIsClicking(false)
        if (wasDragging) {
            setTimeout(() => {
                document.querySelectorAll('.mwl-img-disabled').forEach(disabledImages => {
                    disabledImages.classList.remove('mwl-img-disabled')
                    disabledImages.classList.add('mwl-img')
                })
            })
            const mostMagnetizedItem = getMagnetizedItem()
            if (mostMagnetizedItem === currentIndex && deltaMoveX >= 80) {
                slideCarouselToNext()
            }
            if (mostMagnetizedItem === currentIndex && deltaMoveX <= -80) {
                slideCarouselToPrev()
            }
            slideCarouselTo(mostMagnetizedItem)
            return false
        }
    }, [trackRef, isDragging, currentIndex, deltaMoveX, slideCarouselToNext, slideCarouselToPrev, getMagnetizedItem])

    // Resize event listener
    useEffect(() => {
        function resizeHandler() {
            slideCarouselTo(currentIndex, true)
        }
        window.addEventListener('resize', resizeHandler)
        return () => window.removeEventListener('resize',  resizeHandler)
    }, [currentIndex, slideCarouselTo])

    // Set track width
    useEffect(() => {
        if (trackWidth === 0 && trackRef.current && carouselItems.length > 0) {
            const mglItemElements = Array.from(trackRef.current?.children)
            setTrackWidth(mglItemElements.reduce((a, b) => a + b.offsetWidth, 0))
            setMglItemElements(mglItemElements.map(element => ({ element, dataIndex: parseInt(element.getAttribute('data-mc-index')) })))
        }
    }, [trackRef.current?.children, carouselItems])

    // Initialisation
    useEffect(() => {
        if (trackWidth > 0) {
            setTimeout(() => {
                slideCarouselTo(firstIndex, true)
            }, 300)
        }
    }, [trackWidth])

    return (
        <div ref={ref} id={classId} className={className} style={inlineStyle}
            data-mgl-gutter={carouselGutter}
            data-mgl-arrow_nav={carouselArrowNavEnabled}
            data-mgl-dot_nav={carouselDotNavEnabled}
        >
            <div ref={trackRef} className={['meow-carousel-track', ...trackClassNames].join(' ')} style={{ width: `${trackWidth}px`, transform: trackTransform, opacity: currentIndex != null ? 1 : 0 }}
                onMouseDown={mouseDownHandler} onTouchStart={mouseDownHandler} mouseMoveHandler={mouseMoveHandler} onTouchMove={mouseMoveHandler} mouseUpHandler={mouseUpHandler} onTouchEnd={mouseUpHandler}
            >
                {carouselItems.map((image) => <MeowGalleryItem key={image.dataIndex} image={image} /> )}
            </div>

            {carouselArrowNavEnabled &&
                <>
                    <div className="meow-carousel-prev-btn" onClick={slideCarouselToPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"/>
                        </svg>
                    </div>
                    <div className="meow-carousel-next-btn" onClick={slideCarouselToNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"/>
                        </svg>
                    </div>
                </>
            }
            {carouselDotNavEnabled &&
                <div className="meow-carousel-nav-dots-container">
                    {carouselItems.map((image) => {
                        if (Object.hasOwn(image, 'classNames') && image.classNames?.includes('clone')) {
                            return null;
                        }
                        const classNames = ['meow-carousel-nav-dot']
                        if (image.dataIndex === currentIndex) {
                            classNames.push('active')
                        } else if (image.dataIndex === firstIndex && lastIndex < currentIndex
                            || image.dataIndex === lastIndex && firstIndex > currentIndex
                        ) {
                            classNames.push('active')
                        }
                        return (
                            <div key={image.dataIndex} className={classNames.join(' ')} onClick={() => slideCarouselTo(image.dataIndex)}>
                                <span></span>
                            </div>
                        );
                    }).filter((image) => image !== null)}
                </div>
            }
        </div>
    );
}