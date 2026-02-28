/**
 * Geocoding utility using Nominatim (OpenStreetMap)
 */

export interface GeocodingResult {
    lat: number;
    lng: number;
    display_name?: string;
}

/**
 * Converts an address string to latitude and longitude
 * @param address The full address string
 * @returns GeocodingResult or null if not found
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
    if (!address || address.trim().length < 5) return null;

    try {
        // We use the Nominatim API (OpenStreetMap)
        // Note: In production, you should add a proper User-Agent as per Nominatim Usage Policy
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
        )}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'pt-BR',
            },
        });

        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                display_name: data[0].display_name,
            };
        }

        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}
