import { useEffect, useState, useRef } from 'react'
import styles from './Map.module.scss'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function Map() {

    const [map, setMap] = useState()
    
    const mapNode = useRef(null)


    useEffect(() => {

        if (typeof window === "undefined" || mapNode.current === null) return

        const mapboxMap = new mapboxgl.Map({
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
            container: mapNode.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [16.05, 48],
            zoom: 4,
        })

        mapboxMap.on('load', () => {
            mapboxMap.getStyle().layers.forEach((layer) => {
                if (layer.id.endsWith('-label')) {
                    mapboxMap.setLayoutProperty(layer.id, 'text-field', [
                      'coalesce',
                      ['get', 'name_ru'],
                      ['get', 'name'],
                   ])
                }
             })
        })

        setMap(mapboxMap)

        return () => {
            mapboxMap.remove()
        }
    }, [])

    return (
        <div className={styles.container}>
            <div ref={mapNode} style={{ width: "100%", height: "100%" }} />
        </div>
    )
}