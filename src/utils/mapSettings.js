import { Tile as TileLayer, VectorTile as VectorTileLayer } from "ol/layer"
import { OSM, VectorTile, XYZ, TileWMS } from "ol/source"
import MVT from "ol/format/MVT"
import { applyStyle } from "ol-mapbox-style"
let customLayer, applyCustomStyle

// In this file, you can modify the default map layer and even add a
// new custom map layer. https://openlayers.org/en/latest/apidoc/
// The file includes a few working examples of custom maps. The examples
// can be enabled by removing the comment around the code
// and disabled by commenting around the code.

// This project uses the EPSG:3857 projection.

// API keys can be stored in an .env file in the root directory of the project.
// API keys can be imported with "import.meta.env.VITE_APIKEYNAME".
// Env variables need to begin with VITE_ for them to be used in the app.
// Note that API keys will still be visible in the frontend, but not in Github.

const VITE_MML_API_KEY = import.meta.env.VITE_MML_API_KEY

//////////////////////////////////////////////////////////////////////////
///                           DEFAULT OPENSTREETMAP                    ///
//////////////////////////////////////////////////////////////////////////
// This section configures the default OpenStreetMap layer, which is 
// a tile layer using the OpenStreetMap tile source.

const defaultLayer = new TileLayer({
    source: new OSM({
        url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    }),
    preload: 100,
})

//////////////////////////////////////////////////////////////////////////
///                           CUSTOM MAP SETTINGS                      ///
//////////////////////////////////////////////////////////////////////////
// Enable custom maps by setting the flag below to true or false.
// After enabling, you can switch between the default and a custom 
// map in the settings panel.

const customMapsEnabled = false // true

//////////////////////////////////////////////////////////////////////////
///                    EXAMPLE CUSTOM WMTS VECTORTILE MAP              ///
//////////////////////////////////////////////////////////////////////////
// This section configures a custom WMTS vector tile map layer using 
// data from the Finnish National Land Survey (Maanmittauslaitos).
// The vector tile format used is MVT, and the data is fetched using 
// the provided API key.

/* customLayer = new VectorTileLayer({
    source: new VectorTile({
        format: new MVT(),
        url: `https://avoin-karttakuva.maanmittauslaitos.fi/vectortiles/taustakartta/wmts/1.0.0/taustakartta/default/v20/WGS84_Pseudo-Mercator/{z}/{y}/{x}.pbf?api-key=${VITE_MML_API_KEY}`
    }),
    preload: 100,
    declutter: true,
}) */

//////////////////////////////////////////////////////////////////////////
///                EXAMPLE STYLE FOR WMTS VECTORTILE MAP               ///
//////////////////////////////////////////////////////////////////////////
// This function applies a custom style to the WMTS vector tile map layer 
// by fetching a style JSON file from the Maanmittauslaitos server.

/* applyCustomStyle = (layer) => {
    fetch(`https://avoin-karttakuva.maanmittauslaitos.fi/vectortiles/stylejson/v20/backgroundmap.json?TileMatrixSet=WGS84_Pseudo-Mercator&api-key=${VITE_MML_API_KEY}`)
        .then(response => response.json())
        .then(styleJson => {
            applyStyle(layer, styleJson)
        })
        .catch(error => {
            console.log("Error fetching style JSON:", error)
        })
} */

//////////////////////////////////////////////////////////////////////////
///                   EXAMPLE CUSTOM WMS TILE LAYER                    ///
//////////////////////////////////////////////////////////////////////////
// This section configures a custom WMS (Web Map Service) layer.
// The layer uses the TileWMS source to fetch tiles from a WMS server.

/* customLayer = new TileLayer({
    source: new TileWMS({
        url: "https://tiles.kartat.kapsi.fi/ortokuva",
        params: {
            "LAYERS": "ortokuva",
            "FORMAT": "image/png"
        },
        preload: 100,
    })
}) */

//////////////////////////////////////////////////////////////////////////
///              EXAMPLE CUSTOM WMS TILE LAYER (Alternative)           ///
//////////////////////////////////////////////////////////////////////////
// This section configures another custom WMS (Web Map Service) layer.

/* customLayer = new TileLayer({
    source: new TileWMS({
        url: "https://ows.mundialis.de/services/service",
        params: {
            "LAYERS": "TOPO-WMS",
            "FORMAT": "image/png"
        },
        preload: 100,
    })
}) */

//////////////////////////////////////////////////////////////////////////
///                 EXPORTS FOR MAP LAYER CONFIGURATION                ///
//////////////////////////////////////////////////////////////////////////

export { defaultLayer, customLayer, applyCustomStyle, customMapsEnabled }