"use client";

import { useEffect } from "react";
import { useMapEvents, useMap, Marker } from "react-leaflet";

export function LocationMarker({ position, setPosition, onLocationSelect }: {
    position: [number, number],
    setPosition: (pos: [number, number]) => void,
    onLocationSelect: (lat: number, lng: number) => void
}) {
    const map = useMapEvents({
        click(e) {
            const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
            setPosition(newPos);
            onLocationSelect(newPos[0], newPos[1]);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const newPos = marker.getLatLng();
                    setPosition([newPos.lat, newPos.lng]);
                    onLocationSelect(newPos.lat, newPos.lng);
                }
            }}
        />
    );
}

export function MapActions({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}
