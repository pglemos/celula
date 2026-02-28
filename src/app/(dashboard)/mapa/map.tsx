"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Navigation } from "lucide-react";
import Link from "next/link";

// Fix for Leaflet default icon issues in Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export function CellMap({ cells }: { cells: any[] }) {
    const [isMounted, setIsMounted] = useState(false);
    
    // Default center (can be tuned to tenant city)
    const [center, setCenter] = useState<[number, number]>([-23.5505, -46.6333]);

    useEffect(() => {
        setIsMounted(true);
        // Tentar obter localização do usuário para centrar o mapa
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setCenter([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    }, []);

    if (!isMounted) return <div className="h-full w-full bg-secondary/10 animate-pulse flex items-center justify-center text-muted-foreground">Carregando mapa...</div>;

    return (
        <MapContainer 
            center={center} 
            zoom={13} 
            className="h-full w-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />
            
            {cells.filter(c => c.lat && c.lng).map((cell) => (
                <Marker key={cell.id} position={[cell.lat, cell.lng]}>
                    <Popup className="custom-popup">
                        <div className="w-64 p-1">
                            <h3 className="font-bold text-base mb-1">{cell.name}</h3>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="text-[10px]">{cell.category || "Célula"}</Badge>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Users className="h-3 w-3" /> {cell.cell_members?.length || 0}
                                </span>
                            </div>
                            
                            <div className="space-y-2 text-xs mb-3">
                                <p className="flex items-start gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                    <span>{cell.address || cell.address_neighborhood || "Endereço não informado"}</span>
                                </p>
                                <p className="text-muted-foreground">Líder: {cell.leader?.full_name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Link href={`/celulas/${cell.id}`} className="w-full">
                                    <button className="w-full py-2 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors text-center block">
                                        Ver Detalhes
                                    </button>
                                </Link>
                                <a 
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${cell.lat},${cell.lng}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <button className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors flex items-center justify-center gap-1">
                                        <Navigation className="h-3.5 w-3.5" /> Rota
                                    </button>
                                </a>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
