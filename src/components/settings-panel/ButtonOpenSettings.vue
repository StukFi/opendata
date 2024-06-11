<template>
    <div
        class="button-open-settings"
        :title="$t('settings.title')"
        @click="handleClick()"
    >
        <span class="button-open-settings__icon" />
    </div>
</template>

<script>
import eventBus from '@/utils/eventBus'

export default {
    name: "ButtonOpenSettings",
    emits: ['settings-panel-open'],
    methods: {
        handleClick() {
            eventBus.$emit('settings-panel-open')
        }
    }
}
</script>

<style lang="scss">
.button-open-settings {
    position: absolute;
    top: 6em;
    left: 1em;
    width: 3em;
    height: 3em;
    z-index: $z-index-button-open-settings;
    border-radius: 0.25em;
    background-color: rgba(255, 255, 255, 0.4);
}

.button-open-settings:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.button-open-settings__icon {
    position: absolute;
    width: 90%;
    height: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.25em;
    background-image: url("~@/assets/icons/cog.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(0, 50, 136, 0.5);
    background-size: 50%;
    cursor: pointer;
}

.button-open-settings__icon:hover {
    background-color: rgba(0, 50, 136, 0.7);
}

@media only screen and (min-width: $breakpoint-md) {
    .button-open-settings {
        left: 1em;
        top: 9.5em;
    }
}
</style>