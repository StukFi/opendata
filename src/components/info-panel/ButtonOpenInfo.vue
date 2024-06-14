<template>
    <div
        class="button-open-info"
        :title="$t('info.title')"
        @click="handleClick()"
    >
        <span class="button-open-info__icon" />
    </div>
</template>

<script>
import eventBus from '../../utils/eventBus';

export default {
    name: "ButtonOpenInfo",
    emits: ['info-panel-open'],
    methods: {
        handleClick() {
            eventBus.$emit('info-panel-open')
        }
    }
}
</script>

<style lang="scss" scoped>
.button-open-info {
    position: absolute;
    top: 6em;
    right: 1em;
    width: 3em;
    height: 3em;
    z-index: $z-index-button-open-settings;
    border-radius: 0.25em;
    background-color: rgba(255, 255, 255, 0.4);
}

.button-open-info:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.button-open-info__icon {
    position: absolute;
    width: 90%;
    height: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.25em;
    background-image: url("src/assets/icons/info.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(0, 50, 136, 0.5);
    background-size: 50%;
    cursor: pointer;
}

.button-open-info__icon:hover {
    background-color: rgba(0, 50, 136, 0.7);
}

@media only screen and (min-width: $breakpoint-md) {
    .button-open-info {
        left: 1em;
    }
}
</style>