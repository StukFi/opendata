<template>
    <div id="popup-detailed" class="popup">
        <a href="#" id="popup-closer" class="popup-closer"></a>
        <div class="popup-content">
            <p style="text-align:center;"><b>{{site}}</b></p>
            <p style="text-align:center;font-size:2em;">{{doseRate}}</p>
            <time-series-graph></time-series-graph>
        </div>
    </div>
</template>

<script>
import Popup from "../mixins/popup"
import TimeSeriesGraph from "./time-series-graph"

export default {
    name: "PopupDetailed",
    mixins: [Popup],
    components: {
        TimeSeriesGraph
    }
}
</script>
