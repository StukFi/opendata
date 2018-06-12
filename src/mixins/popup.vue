<script>
export default {
    name: "Popup",
    data: function() {
        return {
            site: "Location",
            doseRate: 0.0
        };
    },
    mounted: function() {
        var that = this;
        this.$root.$on("mapFeatureFocused", function(data) {
            that.site = data.site;
            that.doseRate = data.doseRate;
        });
    }
}
</script>
