import AbstractProvider, {
    EndpointArgument,
    ProviderOptions,
    RequestType,
    SearchResult,
  } from 'leaflet-geosearch/src/providers/provider.ts'
  
  export type RequestResult = {data: {features: RawResult[]}};
  
  /*
  export interface RawResult {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: [string, string, string, string];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
  }
  */
 export type RawResult = GeoJSON.Feature<GeoJSON.Point> 
  
  export type PhotonProviderOptions = {
    searchUrl?: string;
    reverseUrl?: string;
    lang?: string;
  } & ProviderOptions;
  
  export default class PhotonProvider extends AbstractProvider<
    RawResult[],
    RawResult
  > {
    searchUrl: string;
    reverseUrl: string;
  
    constructor(options: PhotonProviderOptions = {}) {
      super(options);
  
      const host = 'https://photon.komoot.io';
      this.searchUrl = options.searchUrl || `${host}/api`;
      this.reverseUrl = options.reverseUrl || `${host}/reverse`;
    }
  
    endpoint({ query, type }: EndpointArgument): string {
      const params = typeof query === 'string' ? { q: query } : query;
      console.log(params)
  
      switch (type) {
        case RequestType.REVERSE:
          return this.getUrl(this.reverseUrl, params);
  
        default:
          return this.getUrl(this.searchUrl, params);
      }
    }

    parseName(props: any) : string {
      const filterAndJoin = (arr: any[], sep: string) => arr.filter(a => a !== undefined && a !== "").join(sep)
      const name = props.name
      const city = filterAndJoin([props.postcode, props.city], " ")
      const street = filterAndJoin([props.street, props.housenumber], " ")
      const address = filterAndJoin([name, street, city], ", ")

      return address
    }
  
    parse(response: any): SearchResult<RawResult>[] {
      const records = Array.isArray((response.data as any).features)
        ? (response.data as any).features
        : [response.data];
  
      return records.map((r: any) => {
        const result: any = {
          x: Number(r.geometry.coordinates[0]),
          y: Number(r.geometry.coordinates[1]),
          label: this.parseName(r.properties),
          raw: r
        }
        if (r.properties.extent) {
          result.bounds = r.properties.extent.map(parseFloat)
        }

        return result
    });
    }
  }