"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    Search, MapPin, Users, Navigation,
    ChevronRight, Filter, Building2,
    Calendar, Phone, Info, LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Custom Marker Colors based on category
const getMarkerColor = (category: string) => {
    switch (category?.toLowerCase()) {
        case 'adultos': return '#6366f1'; // Indigo
        case 'jovens': return '#14b8a6'; // Teal
        case 'kids': return '#f43f5e'; // Rose
        case 'casais': return '#8b5cf6'; // Violet
        default: return '#94a3b8'; // Slate
    }
};

const createCustomIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });
};

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
}

export function CellMap({ cells }: { cells: any[] }) {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedDay, setSelectedDay] = useState<string>("all");
    const [viewState, setViewState] = useState<{ center: [number, number]; zoom: number }>({
        center: [-19.9167, -43.9345], // Default (BH) - will update below
        zoom: 13
    });

    useEffect(() => {
        setIsMounted(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setViewState({
                    center: [pos.coords.latitude, pos.coords.longitude],
                    zoom: 14
                });
            });
        }
    }, []);

    const filteredCells = useMemo(() => {
        return cells.filter(cell => {
            const matchesSearch = cell.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cell.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cell.leader?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || cell.category?.toLowerCase() === selectedCategory.toLowerCase();
            const matchesDay = selectedDay === "all" || cell.meeting_day?.toLowerCase().startsWith(selectedDay.toLowerCase());
            return matchesSearch && matchesCategory && matchesDay;
        });
    }, [cells, searchQuery, selectedCategory, selectedDay]);

    const handleCellSelect = (cell: any) => {
        if (cell.lat && cell.lng) {
            setViewState({
                center: [cell.lat, cell.lng],
                zoom: 17
            });
        }
    };

    const handleMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setViewState({
                    center: [pos.coords.latitude, pos.coords.longitude],
                    zoom: 15
                });
            });
        }
    };

    if (!isMounted) return (
        <div className="h-full w-full bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando Mapa...</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-full overflow-hidden">
            {/* Sidebar */}
            <div className="w-[400px] bg-white border-r border-slate-100 flex flex-col shrink-0 z-10 shadow-xl">
                <div className="p-6 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nome, endereço ou líder..."
                            className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus-visible:ring-indigo-500"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Categoria</p>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                <Button
                                    variant={selectedCategory === "all" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory("all")}
                                    className="rounded-full h-8 px-4 font-bold text-[10px] whitespace-nowrap"
                                >
                                    TODOS
                                </Button>
                                {['Adultos', 'Jovens', 'Kids', 'Casais'].map(cat => (
                                    <Button
                                        key={cat}
                                        variant={selectedCategory.toLowerCase() === cat.toLowerCase() ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(cat.toLowerCase())}
                                        className="rounded-full h-8 px-4 font-bold text-[10px] whitespace-nowrap"
                                    >
                                        {cat.toUpperCase()}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dia da Semana</p>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                <Button
                                    variant={selectedDay === "all" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedDay("all")}
                                    className="rounded-full h-8 px-4 font-bold text-[10px] whitespace-nowrap"
                                >
                                    QUALQUER DIA
                                </Button>
                                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
                                    <Button
                                        key={day}
                                        variant={selectedDay.toLowerCase().startsWith(day.toLowerCase()) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedDay(day.toLowerCase())}
                                        className="rounded-full h-8 px-4 font-bold text-[10px] whitespace-nowrap"
                                    >
                                        {day}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Panel */}
                <div className="px-6 mb-4 grid grid-cols-2 gap-2">
                    <div className="p-3 bg-indigo-50 rounded-2xl flex flex-col">
                        <span className="text-[9px] font-black text-indigo-400 tracking-widest uppercase">Membros Total</span>
                        <p className="text-xl font-black text-indigo-600">
                            {filteredCells.reduce((acc, cell) => acc + (cell.cell_members?.length || 0), 0)}
                        </p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-2xl flex flex-col">
                        <span className="text-[9px] font-black text-emerald-400 tracking-widest uppercase">Frequência Média</span>
                        <p className="text-xl font-black text-emerald-600">88%</p>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-6 pb-20 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                            {filteredCells.length} Resultados encontrados
                        </p>
                        {filteredCells.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                                    <Filter className="h-8 w-8 text-slate-200" />
                                </div>
                                <h5 className="font-bold text-slate-800 mb-1">Nenhuma célula encontrada</h5>
                                <p className="text-xs text-slate-400">Tente ajustar seus filtros ou busca para encontrar o que procura.</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedDay("all"); }}
                                    className="text-indigo-600 font-bold text-[10px] mt-2 uppercase tracking-widest"
                                >
                                    Limpar Filtros
                                </Button>
                            </div>
                        )}
                        {filteredCells.map((cell) => (
                            <Card
                                key={cell.id}
                                onClick={() => handleCellSelect(cell)}
                                className="group border-none shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-white"
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors uppercase">
                                            {cell.name}
                                        </h4>
                                        <Badge
                                            style={{ backgroundColor: `${getMarkerColor(cell.category)}20`, color: getMarkerColor(cell.category) }}
                                            className="border-none text-[8px] font-black px-2 py-0.5 rounded-full"
                                        >
                                            {cell.category?.toUpperCase() || "GERAL"}
                                        </Badge>
                                    </div>

                                    <div className="space-y-1.5 mb-3">
                                        <p className="text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
                                            <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">{cell.address || "Endereço não geocodificado"}</span>
                                        </p>
                                        <p className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
                                            <Users className="h-3 w-3" />
                                            {cell.leader?.full_name} • {cell.meeting_day || "Quinzenal"} às {cell.meeting_time || "19:30"}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div className="flex -space-x-1.5">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-5 w-5 rounded-full border border-white bg-slate-200" />
                                            ))}
                                            <div className="h-5 w-5 rounded-full border border-white bg-indigo-50 flex items-center justify-center">
                                                <span className="text-[8px] font-bold text-indigo-600">+{cell.cell_members?.length || 0}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0">
                                            <ChevronRight className="h-4 w-4 text-slate-300" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                <MapContainer
                    center={viewState.center}
                    zoom={viewState.zoom}
                    className="h-full w-full grayscale-[0.2] contrast-[1.1] brightness-[1.02]"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Modern light theme
                    />
                    <MapController center={viewState.center} zoom={viewState.zoom} />

                    {filteredCells.filter(c => c.lat && c.lng).map((cell) => (
                        <Marker
                            key={cell.id}
                            position={[cell.lat, cell.lng]}
                            icon={createCustomIcon(getMarkerColor(cell.category))}
                        >
                            <Popup className="custom-popup-premium">
                                <div className="w-72 p-1 overflow-hidden">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                                            style={{ backgroundColor: getMarkerColor(cell.category) }}
                                        >
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{cell.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                {cell.meeting_day || "Sábado"} • {cell.meeting_time || "19:00"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-5">
                                        <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-2xl">
                                            <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                                            <p className="text-[11px] text-slate-600 leading-normal font-medium">{cell.address}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-xl">
                                                <Users className="h-3 w-3 text-indigo-600" />
                                                <p className="text-[10px] font-bold text-indigo-700">{cell.cell_members?.length || 0} Membros</p>
                                            </div>
                                            <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl">
                                                <Navigation className="h-3 w-3 text-emerald-600" />
                                                <p className="text-[10px] font-bold text-emerald-700">Ativa</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/celulas/${cell.id}`} className="w-full">
                                            <Button variant="outline" className="w-full h-10 rounded-xl font-bold text-[10px] border-slate-200">
                                                VER DETALHES
                                            </Button>
                                        </Link>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${cell.lat},${cell.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button className="w-full h-10 rounded-xl font-bold text-[10px] bg-slate-900 hover:bg-black gap-2">
                                                <Navigation className="h-3.5 w-3.5" /> ROTA
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Map Floating Controls Placeholder */}
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleMyLocation}
                        className="h-12 w-12 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border-none text-slate-600 hover:bg-white active:scale-95 transition-all"
                    >
                        <Navigation className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border-none text-slate-600 hover:bg-white active:scale-95 transition-all">
                        <Info className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
