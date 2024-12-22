import type { NotePluginProps, NoteEditorPluginProps, ItemType } from "../../notes"
import { NotePlugin } from "../../notes"
import { IconCopy, IconCopyCheck, IconMapPin, IconNavigation } from "@tabler/icons-react"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import 'leaflet-geosearch/dist/geosearch.css'
import { useEffect } from "react"
import { notifications } from "@mantine/notifications"
import AddressSearch from "./components/AddressSearchBox"
import { GeoLocation, PhotonProvider } from "./lib/geolocation"
import { ActionIcon, Anchor, CopyButton, Group, Stack, Text, TextInput } from "@mantine/core"

import * as L from "leaflet"
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

import "./LocationPlugin.styles.css"
import { getGoogleMapsLink } from "./lib/helper"

/* fix leaflet icon problem */
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41]
});
L.Marker.prototype.options.icon = DefaultIcon;


interface ContentType {
    location: string
    latlng?: [number, number]
    zoom?: number
    searchstring: string
}


interface MapControllerProps {
    center: [number, number]|undefined
    onLocationClicked: (loc: GeoLocation) => void
    onZoomChange: (zoom: number) => void
}

function MapController({center, onLocationClicked, onZoomChange}: MapControllerProps) {
    const map = useMap()

    map.on("click", (ev) => {
        const provider = new PhotonProvider()
        provider.reverse([ev.latlng.lat, ev.latlng.lng])
            .then(locations => {
                if (locations.length === 0) {
                    notifications.show({title: "Nichts gefunden", message: "An der Stelle wurde nichts gefuden."})
                    return
                }
                onLocationClicked(locations[0])
            })
            .catch(err => {
                console.error(err)
                notifications.show({ title: "Fehler", message:"Bei der Abfrage ist ein Fehler aufgetreten." })
            })
    })

    map.on("zoomend", () => {
        onZoomChange(map.getZoom())
    })

    useEffect(() => {
        if (!center) return
        map.flyTo(center)
    }, center)

    return <></>
}


const LocationPlugin: NotePlugin<ContentType> = {
    forType: { id: "location", text: "Location", icon: IconMapPin, defaultContent: { location: "", searchstring: "" } },
    
    Render: ({ item }: NotePluginProps<ContentType>) => {

        return <>
            { !item.content.latlng && <>
                <Text>{ item.content.location }</Text>
                <Text>{ item.content.searchstring }</Text>

            </>}
            { item.content.latlng &&
                <MapContainer center={item.content.latlng} zoom={item.content.zoom} scrollWheelZoom={true} style={{height: 300}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={item.content.latlng}>
                        <Popup keepInView>
                            <Group justify="space-between" wrap="nowrap">
                                <Stack>
                                    <Text mb="xs">{ item.content.location }</Text>
                                    <Text fs="italic">{ item.content.searchstring }</Text>
                                </Stack>
                                <Stack align="flex-start">
                                    <CopyButton value={item.content.location}>
                                    {({ copied, copy }) => (
                                        <ActionIcon color={copied ? 'teal' : 'blue'} onClick={copy}>
                                            {copied ? <IconCopyCheck /> : <IconCopy />}
                                        </ActionIcon>
                                    )}
                                    </CopyButton>
                                    <ActionIcon onClick={() => window.open(getGoogleMapsLink(item.content))}>
                                        <IconNavigation />
                                    </ActionIcon>
                                </Stack>
                            </Group>
                        </Popup>
                    </Marker>
                </MapContainer>
            }
        </>
    },

    RenderSmall: ({ item }: NotePluginProps<ContentType>) => {
        return (<>
            { item.content.latlng &&
                <MapContainer
                    center={item.content.latlng}
                    zoom={item.content.zoom}
                    scrollWheelZoom={false}
                    style={{height: 150}}
                    boxZoom={false}
                    doubleClickZoom={false}
                    dragging={false}
                    attributionControl={false}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={item.content.latlng}>
                    </Marker>
                </MapContainer>
            }
        </>)
    },

    RenderAsText: ({ item }: NotePluginProps<ContentType>) => {
        return item.content.location
    },

    RenderEditor: ({ item, onChange } : NoteEditorPluginProps<ContentType>) => {
        function onChangeText(location: string) {
            onChange({...item, content: {...item.content, location: location, latlng: undefined}})
        }

        function onAddressSelected(loc: GeoLocation) {   
            onChange({...item, content: {...item.content, latlng: loc.latlng, location: loc.text}})
        }

        function onZoomChange(zoom: number) {
            if (!item.content.latlng) return
            onChange({...item, content: {...item.content, zoom: zoom}})
        }


        return (<>
            <AddressSearch value={item.content.location} onChange={onChangeText} onAddressSelected={onAddressSelected}/>
            <MapContainer center={item.content.latlng||[52.510885,13.3989367]} zoom={13} scrollWheelZoom={true} style={{height: 300}}>
                <MapController center={item.content.latlng} onLocationClicked={onAddressSelected} onZoomChange={onZoomChange}/>
                
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { item.content.latlng && <Marker position={item.content.latlng} /> }
            </MapContainer>
            <TextInput label="Suchstring" value={item.content.searchstring} onChange={ev => onChange({...item, content: {...item.content, searchstring: ev.target.value }})} />
        </>)
    },
    
    asSearchable: (item: ItemType<ContentType>) => {
        return [item.content.location, item.content.searchstring]
    },

    validateContent: async (item: ItemType<ContentType>) => {
        if (item.content.location === "") return false
        return true
    },

    finalize: (item: ItemType<ContentType>) => {
        return item
    }
}

export default LocationPlugin