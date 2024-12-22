interface GetGoogleMapsLinkParams {
    location?: string
    latlng?: [number, number]
}

export function getGoogleMapsLink(location: GetGoogleMapsLinkParams) {
    const url = (dest: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`
    if (location.latlng) return url(`${location.latlng[0]},${location.latlng[1]}`)
    return url(location.location || "")
}