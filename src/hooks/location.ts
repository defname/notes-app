import { useEffect, useState } from "react"
import { AdditionalSearchParams, GeoLocation, PhotonProvider } from "../lib/geolocation"



export function useSearchLocation(searchStr: string, params?: AdditionalSearchParams) {
    const [results, setResults] = useState<GeoLocation[]>([])
    const [error, setError] = useState<string|undefined>()
    const provider = new PhotonProvider()

    useEffect(() => {
        provider.search(searchStr, params)
            .then(results => {
                setResults(results)
            })
            .catch(err => {
                console.error(err)
                setResults([])
                setError("Fehler beim Abrufen der Suchergenisse.")
            })
    }, [searchStr])

    return [results, error] as [GeoLocation[], string|undefined]
}
