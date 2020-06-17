<template>
    <div
        class="button-open-settings"
        :title="$t('settings')"
        @click="$root.$emit('settings-panel-open')"
    >
        <span class="button-open-settings__icon" />
    </div>
</template>

<script>
export default {
    name: "ButtonOpenSettings"
}
</script>

<style>
.button-open-settings {
    position: absolute;
    bottom: 40px;
    left: 15px;
    width: 45px;
    height: 45px;
    z-index: 1;
    border-radius: 4px;
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
    border-radius: 4px;
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

@media only screen and (min-width: 768px) {
    .button-open-settings {
        top: 100px;
    }
}
</style>

<i18n>
{
    "en": {
        "settings": "Settings"
    },
    "fi": {
        "settings": "Asetukset"
    }
}
</i18n>
