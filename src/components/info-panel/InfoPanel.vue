<template>
    <div v-show="isEnabled">
        <base-backdrop @click="disable" />
        <div class="info-panel">
            <info-panel-header @close="disable" />
            <div class="info-panel-body">
                <p>{{ $t("info.p1") }}</p>
                <p>
                    {{ $t("info.p2") }} <a
                        href="https://github.com/StukFi/opendata"
                        target="_blank"
                    >{{ $t("info.p3") }}</a>.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import InfoPanelHeader from "@/components/info-panel/InfoPanelHeader.vue"
import BaseBackdrop from "@/components/base/BaseBackdrop.vue"
import eventBus from "@/utils/eventBus"

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
        eventBus.$on("info-panel-open", this.enable)
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