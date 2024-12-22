export interface GeoLocation {
    text: string
    latlng: [number, number]
}


export type AdditionalSearchParams = { [key: string]: string }

abstract class GeoProvider {
    abortController: AbortController

    constructor() {
        this.abortController = new AbortController()
    }

    buildQueryUrl(url: string, params: AdditionalSearchParams = {}): string {
        const p: string = params ? Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&") : ""
        return p !== "" ? `${url}&${p}` : url
    }

    async search(searchStr: string, params?: AdditionalSearchParams): Promise<GeoLocation[]> {
        const url = this.buildQueryUrl(this.queryUrl(searchStr), params)
        return this.fetchResults(url)
    }

    async reverse(latlng: [number, number], params?: AdditionalSearchParams): Promise<GeoLocation[]> {
        const url = this.buildQueryUrl(this.reverseQueryUrl(latlng), params)

        return this.fetchResults(url)
    }

    async fetchResults(url: string) : Promise<GeoLocation[]> {
        const results = await fetch(url, { signal: this.abortController.signal }).then(response => response.json())
        return this.convertResults(results)
    }

    /* function to create the query url from the search string */
    abstract queryUrl(searchStr: string): string

    /* function to create the url for reverse search */
    abstract reverseQueryUrl(latlng: [number, number]): string

    /* convert the result from the query to the simple format we use here */
    abstract convertResults(results: any): GeoLocation[]
}

export class PhotonProvider extends GeoProvider {
    baseUrl: string

    constructor() {
        super()

        this.baseUrl = "https://photon.komoot.io"
    }

    queryUrl(searchStr: string): string {
        return `${this.baseUrl}/api?lang=de&q=${searchStr}`
    }

    reverseQueryUrl(latlng: [number, number]): string {
        return `${this.baseUrl}/reverse?lat=${latlng[0]}&lon=${latlng[1]}`
    }

    convertResults(results: any): GeoLocation[] {
       return results.features.map((f: any) => ({
            latlng: f.geometry.coordinates.reverse(),
            text: this.parseLocationName(f.properties)
        }))
    }

    parseLocationName(props: any) : string {
        const filterAndJoin = (arr: any[], sep: string) => arr.filter(a => a !== undefined && a !== "").join(sep)
        const name = props.name
        const city = filterAndJoin([props.postcode, props.city], " ")
        const street = filterAndJoin([props.street, props.housenumber], " ")
        const address = filterAndJoin([name, street, city], ", ")

        return address
    }
}