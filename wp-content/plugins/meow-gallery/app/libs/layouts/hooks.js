import L from 'leaflet'
import { Loader } from '@googlemaps/js-api-loader'
import { useCallback, useEffect } from "preact/hooks"
import useMeowGalleryContext from '../context';

export const useMap = () => {

    const { id, images, mglMap } = useMeowGalleryContext();
    const mapId = `map-${id}`

    const getLargestImageAvailable = useCallback((image) => {
        if (image.sizes.large) {
            return image.sizes.large
        }
        if (image.sizes.medium) {
            return image.sizes.medium
        }
        if (image.sizes.thumbnail) {
            return image.sizes.thumbnail
        }
    }, [])

    const addTilesLayer = useCallback((map, tilesProvider) => {
        if (tilesProvider == 'openstreetmap') {
            const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            L.tileLayer(url, {
                attribution: attribution,
                maxZoom: 18,
                noWrap: true,
                style: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json'
            }).addTo(map)
        }
        if (tilesProvider == 'maptiler') {
            const url = `https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=${mglMap.maptiler.apiKey}`
            const attribution = '© MapTiler © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            L.tileLayer(url, {
                attribution: attribution,
                maxZoom: 18,
                noWrap: true
            }).addTo(map)
        }
        if (tilesProvider == 'mapbox') {
            let url
            if (mglMap.mapbox.style?.username && mglMap.mapbox.style?.style_id) {
                const { username, style_id: styleId } = mglMap.mapbox.style
                url = `https://api.mapbox.com/styles/v1/${username}/${styleId}/tiles/{z}/{x}/{y}?access_token=${mglMap.mapbox.apiKey}`
            } else {
                url = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mglMap.mapbox.apiKey}`
            }
            const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
            L.tileLayer(url, {
                attribution: attribution,
                tileSize: 512,
                maxZoom: 18,
                zoomOffset: -1,
                id: 'mapbox/streets-v12'
            }).addTo(map)
        }
    }, [])

    const createGmapMarkers = useCallback((map, images) => {
        function CustomMarker(id, latlng, map, imageSrc) {
            this.id = id
            this.latlng_ = latlng
            this.imageSrc = imageSrc
            this.setMap(map)
        }

        CustomMarker.prototype = new google.maps.OverlayView()
        CustomMarker.prototype.draw = function () {
            let div = this.div_
            if (!div) {
                div = this.div_ = document.createElement('div')
                div.className = "gmap-image-marker"
                const img = document.createElement("img")
                img.className = `wp-image-${this.id}`
                img.src = this.imageSrc
                div.appendChild(img)
                const panes = this.getPanes()
                panes.overlayImage.appendChild(div)
            }
            const point = this.getProjection().fromLatLngToDivPixel(this.latlng_)
            if (point) {
                div.style.left = point.x + 'px'
                div.style.top = point.y + 'px'
            }
        }
        CustomMarker.prototype.remove = function () {
            if (this.div_) {
                this.div_.parentNode.removeChild(this.div_)
                this.div_ = null
            }
        }
        CustomMarker.prototype.getPosition = function () {
            return this.latlng_
        }

        images.forEach((image) => {
            const imgGpsAsArray = image.data.gps.split(',')
            const makerImage = {
                image: getLargestImageAvailable(image),
                pos: [imgGpsAsArray[0], imgGpsAsArray[1]]
            }
            new CustomMarker(
                image.id,
                new google.maps.LatLng(makerImage.pos[0],makerImage.pos[1]),
                map,
                makerImage.image
            )
        })
    }, [getLargestImageAvailable])

    const createLeafletMarker = useCallback((map, images) => {
        images.forEach((image, index) => {
            const lightboxable = mglMap.lightboxable ? 'inline-block' : 'none'
            const imageMarkerMarkup = [
                '<div class="image-marker-container" data-image-index="' + index + '">',
                '<div class="rounded-image">',
                '<img class="wp-image-' + image.id + '" src="' + getLargestImageAvailable(image) + '" srcset="' + image.file_srcset + '" sizes="' + image.file_sizes + '" style="display: ' + lightboxable + '">',
                '</div>',
                '</div>'
            ]
            const icon = L.divIcon({
                className: 'image-marker',
                iconSize: null,
                html: imageMarkerMarkup.join('')
            })
            const pos = image.data.gps.split(',')
            L.marker(pos, { icon: icon }).addTo(map)
        })
    }, [getLargestImageAvailable])

    const fitGooglemapMarkers = useCallback((map, images) => {
        const bounds = new google.maps.LatLngBounds()
        images.forEach(image => {
            const gpsAsArray = image.data.gps.split(',')
            const pos = {
                lat: parseFloat(gpsAsArray[0]),
                lng: parseFloat(gpsAsArray[1])
            }
            bounds.extend(pos)
        })
        map.fitBounds(bounds)
    }, [])

    const fitLeafletMarkers = useCallback((map, images) => {
        const latLngArray = []
        images.forEach(image => {
            const imageLatLng = image.data.gps.split(',')
            latLngArray.push(imageLatLng)
        })
        const bounds = new L.LatLngBounds(latLngArray)
        map.fitBounds(bounds)
    }, [])

    const onGoogleMapReady = useCallback((map) => {
        if (images.length > 0) {
            createGmapMarkers(map, images)
            fitGooglemapMarkers(map, images)
        }
    }, [images, createGmapMarkers, fitGooglemapMarkers])

    const onOthersMapReady = useCallback((map, tilesProvider) => {
        if (images.length > 0) {
            addTilesLayer(map, tilesProvider)
            createLeafletMarker(map, images)
            fitLeafletMarkers(map, images)
        }
    }, [images, addTilesLayer, createLeafletMarker, fitLeafletMarkers])

    useEffect(() => {
        if (mglMap.tilesProvider === 'googlemaps') {
            const loader = new Loader({
                apiKey: mglMap.googlemaps.apiKey,
                version: "weekly"
            })
            loader.load().then(() => {
                const map = new google.maps.Map(document.getElementById(mapId), {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 8
                })
                map.setOptions({styles: mglMap.googlemaps.style})
                onGoogleMapReady(map)
                document.body.dispatchEvent(new Event('post-load'))
            })
        } else if (L.DomUtil.get(mapId) != null) {
            L.DomUtil.get(mapId)._leaflet_id = null
            const map = L.map(mapId).setView(mglMap.center, 13)
            onOthersMapReady(map, mglMap.tilesProvider)
            document.body.dispatchEvent(new Event('post-load'))
        }
    }, [mglMap.tilesProvider, onGoogleMapReady, onOthersMapReady, mapId]);

    return mapId
}