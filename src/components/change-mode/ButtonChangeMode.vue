<template>
    <div
        class="button-change-mode"
        :title="$t('changeMode.title')"
        @click="handleClick"
    >
        <span class="button-change-mode__icon" />
        <h3>
            <span :class="{ selected: isDoseRate, notSelected: !isDoseRate}">{{ $t("doseRate") }}</span> /
            <span :class="{ selected: isAirRadionuclides, notSelected: !isAirRadionuclides }">{{ $t("airRadionuclides") }}</span>
        </h3>
    </div>
</template>

<script>
import eventBus from "../../utils/eventBus"

export default {
    name: "ButtonChangeMode",
    computed: {
        mode() {
            return this.$store.state.settings.settings.mode
        },
        isDoseRate() {
            return this.mode === "dose_rates"
        },
        isAirRadionuclides() {
            return this.mode === "air_radionuclides"
        }
    },
    methods: {
        handleClick() {
            const newMode = this.mode === "dose_rates" ? "air_radionuclides" : "dose_rates"
            eventBus.$emit("mode-changed", newMode)
        }
    }
}
</script>

<style lang="scss" scoped>
.button-change-mode {
    position: absolute;
    top: 6em;
    right: 1em;
    width: 3em;
    height: 3em;
    z-index: $z-index-button-change-mode;
    border-radius: 0.25em;
    background-color: rgba(255, 255, 255, 0.4);
}

h3 {
    color: rgba(0, 50, 136, 0.5);
    position: relative;
    left: 5em;
    bottom: 0.3em;
    width: 10.5em;
    font-size: 0.7em;
}

.selected {
    font-weight: 1000;
    font-size: 1.15em;
    color: rgba(0, 50, 136, 0.6);
}

.notSelected {
    font-weight: 700;
}

.button-change-mode:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.button-change-mode__icon {
    position: absolute;
    width: 90%;
    height: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.25em;
    background-image: url("/icons/change-mode.svg");
    background-repeat: no-repeat;
    background-position: 50% 65%;
    background-color: rgba(0, 50, 136, 0.5);
    background-size: 50%;
    cursor: pointer;
}

.button-change-mode__icon:hover {
    background-color: rgba(0, 50, 136, 0.7);
}

@media only screen and (min-width: $breakpoint-md) {
    .button-change-mode {
        left: 1em;
        top: 13em;
    }
}
@media only screen and (min-width: $breakpoint-sm) {
    .button-change-mode {
        left: 1em;
        top: 13em;
    }
}
</style>
