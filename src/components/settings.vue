<template>
    <div class="settings">
        <div class="settings-button" @click="enable()">
            <span class="settings-button__icon"></span>
        </div>
        <div class="settings-panel__background" v-if="isEnabled"></div>
        <div class="settings-panel container" v-if="isEnabled">
            <div class="row">
                <div class="col">
                    <b-form-group label="Language">
                        <b-form-select v-model="language">
                            <option>Finnish</option>
                            <option>English</option>
                        </b-form-select>
                    </b-form-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bFormGroup from "bootstrap-vue/es/components/form-group/form-group"
import bButton from "bootstrap-vue/es/components/button/button"
import bFormSelect from "bootstrap-vue/es/components/form-select/form-select"

export default {
    name: "Settings",
    components: {
        'bButton': bButton
    },
    data: function() {
        return {
            isEnabled: true
        };
    },
    computed: {
        language: {
            get() {
                return this.$store.state.settings.language;
            },
            set(language) {
                this.$store.commit("setLanguage", language);
            }
        }
    },
    methods: {
        enable() {
            this.isEnabled = true;
        }
    }
}
</script>

<style>
.settings-button {
    position: absolute;
    top: 100px;
    left: 15px;
    width: 50px;
    height: 50px;
    z-index: 1;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.4);
}

.settings-button:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.settings-button__icon {
    position: absolute;
    width: 90%;
    height: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    background-image: url("../../assets/icons/cog.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(0, 50, 136, 0.5);
    background-size: 50%;
}

.settings-button__icon:hover {
    background-color: rgba(0, 50, 136, 0.7);
}

.settings-panel__background {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 4;
    background-color: rgba(0, 0, 0, 0.5);
}

.settings-panel {
    position: fixed;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    width: 50%;
    height: 50%;
    padding: 5% 5%;
    z-index: 5;
    background-color: white;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.5);
}
</style>