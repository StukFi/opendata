<template>
    <div id="popup-basic" class="popup">
        <div class="popup-content">
            <p style="text-align:center;"><b>{{site}}</b></p>
            <p style="text-align:center;font-size:2em;">{{doseRate}}</p>
        </div>
    </div>
</template>

<script>
import Popup from "../mixins/popup"

export default {
    name: "PopupBasic",
    mixins: [Popup]
}
</script>

<style>
#popup-basic {
    width: 280px;
    left: -140px;
}

#popup-basic:after,
#popup-basic:before {
    left: 139px;
}
</style>
