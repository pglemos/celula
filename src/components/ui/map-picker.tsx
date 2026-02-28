"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { geocodeAddress } from "@/lib/geocoding";
import { cn } from "@/lib/utils";

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });

// Helper components that depend on react-leaflet hooks
const LocationMarker = dynamic(() => import("./map-picker-internal").then(mod => mod.LocationMarker), { ssr: false });
const MapActions = dynamic(() => import("./map-picker-internal").then(mod => mod.MapActions), { ssr: false });

interface MapPickerProps {
    defaultLat?: number;
    defaultLng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
    address?: string;
    className?: string;
}

export function MapPicker({
    defaultLat = -23.5505,
    defaultLng = -46.6333,
    onLocationSelect,
    address,
    className
}: MapPickerProps) {
    const [position, setPosition] = useState<[number, number]>([defaultLat, defaultLng]);
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [L, setL] = useState<any>(null);
    const lastGeocodedAddress = useRef<string>("");

    useEffect(() => {
        setIsMounted(true);
        // Import leaflet only on client side
        import("leaflet").then((leaflet) => {
            const L = leaflet.default;
            const DefaultIcon = L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            });
            L.Marker.prototype.options.icon = DefaultIcon;
            setL(L);
        });
    }, []);

    const handleGeocode = useCallback(async () => {
        if (!address || address === lastGeocodedAddress.current || address.length < 10) return;

        setLoading(true);
        try {
            const result = await geocodeAddress(address);
            if (result) {
                const newPos: [number, number] = [result.lat, result.lng];
                setPosition(newPos);
                onLocationSelect(result.lat, result.lng);
                lastGeocodedAddress.current = address;
            }
        } catch (error) {
            console.error("Manual geocode error:", error);
        } finally {
            setLoading(false);
        }
    }, [address, onLocationSelect]);

    useEffect(() => {
        if (defaultLat && defaultLng && (defaultLat !== position[0] || defaultLng !== position[1])) {
            setPosition([defaultLat, defaultLng]);
        }
    }, [defaultLat, defaultLng, position]);

    if (!isMounted || !L) return (
        <div className={cn("h-[300px] w-full bg-secondary/10 animate-pulse flex items-center justify-center text-muted-foreground rounded-xl border border-dashed border-border/50", className)}>
            Carregando mapa...
        </div>
    );

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 text-xs gap-1.5 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                    onClick={handleGeocode}
                    disabled={loading || !address || address.length < 10}
                >
                    {loading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Search className="h-3.5 w-3.5" />
                    )}
                    Localizar no Mapa
                </Button>
                <p className="text-[10px] text-muted-foreground leading-tight mt-1">
                    Arraste o pino ou clique no mapa para ajustar a posição exata.
                </p>
            </div>

            <div className="h-[300px] w-full rounded-xl overflow-hidden border border-border/50 shadow-inner relative group">
                <MapContainer
                    center={position}
                    zoom={15}
                    className="h-full w-full z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* @ts-ignore */}
                    <LocationMarker
                        position={position}
                        setPosition={setPosition}
                        onLocationSelect={onLocationSelect}
                    />
                    {/* @ts-ignore */}
                    <MapActions center={position} />
                </MapContainer>

                <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-border/50 shadow-lg text-[10px] font-mono text-slate-600 pointer-events-none">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-primary" />
                        Lat: {position[0].toFixed(5)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3 w-3 text-primary" />
                        Lng: {position[1].toFixed(5)}
                    </div>
                </div>
            </div>
        </div>
    );
}
