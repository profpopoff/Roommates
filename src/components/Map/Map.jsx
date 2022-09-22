import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import ReactMapGL, { Marker, Popup } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

import styles from './Map.module.scss'
import Loading from '../Loading/Loading'

export default function Map({ apartments }) {

    const [loading, setLoading] = useState(true)

    const filters = useSelector((state) => state.filters.filters)

    const [viewport, setViewport] = useState({
        latitude: 55.7522,
        longitude: 37.6156,
        zoom: 10
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setViewport({ ...viewport, latitude: position.coords.latitude, longitude: position.coords.longitude })
        })
    }, [])

    const [selectedMarker, setSelectedMarker] = useState({})

    const markers = useMemo(() => apartments.map((apartment, index) => (
        apartment.isVisible &&
        ((filters.withRoommates && ['bed', 'room'].includes(apartment.type)) || (!filters.withRoommates && ['flat', 'house', 'townhouse'].includes(apartment.type))) &&
        (apartment.price.value <= filters.price[1] && apartment.price.value >= filters.price[0]) &&
        (apartment.stats.floor <= filters.floor[1] && apartment.stats.floor >= filters.floor[0]) &&
        filters.type.includes(apartment.type) &&
        (!filters.city ? true : apartment.address.city === filters.city) &&
        <Marker
            key={`marker-${index}`}
            longitude={apartment.coordinates.longitude}
            latitude={apartment.coordinates.latitude}
            anchor="bottom"
            onClick={e => {
                e.originalEvent.stopPropagation()
                setSelectedMarker(apartment)
            }}
        >
            <FontAwesomeIcon
                className={styles.marker}
                icon={faLocationDot}
            />
        </Marker>
    )), [filters])

    return (
        <section className={styles.container}>
            {loading && <Loading />}
            <ReactMapGL
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                {...viewport}
                onMove={e => setViewport(e.viewport)}
                onLoad={() => setLoading(false)}
            >
                {markers}
                {selectedMarker._id &&
                    <Popup
                        className={styles.popup}
                        latitude={selectedMarker.coordinates.latitude}
                        longitude={selectedMarker.coordinates.longitude}
                        anchor="bottom"
                        onClose={() => setSelectedMarker({})}
                    >
                        <h3>{selectedMarker.address.street}, д.{selectedMarker.address.house}</h3>
                        <div className={styles.price}>
                            <span>{selectedMarker.price.value.toLocaleString('ru', {
                                style: 'currency',
                                currency: selectedMarker.price.currency,
                                minimumFractionDigits: 0
                            })}</span>/месяц
                        </div>
                        <Link href={`/apartment/${selectedMarker._id}`} passHref>
                            <span className={styles.details}>Подробная информция</span>
                        </Link>
                    </Popup>}
            </ReactMapGL>
        </section>
    )
}