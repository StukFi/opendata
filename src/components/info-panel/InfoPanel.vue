<template>
    <div v-show="isEnabled">
        <base-backdrop @click="disable" />
        <div class="info-panel">
            <info-panel-header @close="disable" />
            <div class="info-panel-body">
                <p>{{ $t("p1") }}</p>
                <p v-html="$t('p2')" />
            </div>
        </div>
    </div>
</template>

<script>
import InfoPanelHeader from "./InfoPanelHeader"
import BaseBackdrop from "@/components/base/BaseBackdrop"

export default {
    name: "InfoPanel",
    components: {
        InfoPanelHeader,
        BaseBackdrop,
    },
    data: function () {
        return {
            isEnabled: false
        }
    },
    mounted () {
        this.$root.$on("info-panel-open", this.enable)
    },
    methods: {
        enable () {
            this.isEnabled = true

            // Reset scrollbar to top when the user opens the panel.
            this.$nextTick(() => {
                if (this.$refs.panelBody) {
                    this.$refs.panelBody.scrollTop = 0
                }
            })
        },
        disable () {
            this.isEnabled = false
        }
    }
}
</script>

<style lang="scss">
.info-panel {
    width: 90%;
    max-width: 30em;
    height: auto;
    max-height: 25em;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: $font-lg;
    font-family: $font-medium;
    z-index: $z-index-settings-panel;
    color: $color-font-dark;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: $border-radius-lg;
    overflow-y: hidden;
    padding: 1.5em 1.5em;
}

.info-panel-body {
    height: auto;
    overflow: auto;

    p {
        margin-top: 0;
        margin-right: 0.5em;
        font-family: $font-regular;

        &:last-of-type {
            margin-bottom: 0;
        }
    }
}

.info-panel-body > *:not(:last-child) {
    margin-bottom: 2em;
}
</style>

<i18n>
{
    "en": {
        "p1": "Opendata is an open source application developed by STUK that enables viewing of external radiation results from around Finland. The application gets its data from the Finnish Meteorological Institute's open data API.",
        "p2": "To learn more visit the project on <a href='https://github.com/StukFi/opendata' target='_blank'>GitHub</a>."
    },
    "fi": {
        "p1": "Opendata on STUKin kehittämä avoimen lähdekoodin applikaatio, jolla voit tarkastella Suomen ulkoisen säteilyn valvontaverkon mittaustuloksia. Applikaatio saa datansa Ilmatieteen laitoksen avoimen datan rajapinnasta.",
        "p2": "Lue lisää projektin <a href='https://github.com/StukFi/opendata' target='_blank'>GitHub-sivuilta</a>."
    }
}
</i18n>
