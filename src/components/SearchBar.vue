<template>
    <div
        v-on-clickaway="blur"
        class="search-bar"
    >
        <span
            class="search-bar__icon"
            @click="search()"
        />
        <input
            ref="searchBarInput"
            :value="searchTerm"
            type="text"
            maxlength="28"
            spellcheck="false"
            class="search-bar__input"
            @input="searchTerm = $event.target.value"
            @click="showSuggestions()"
            @focus="showSuggestions()"
            @keyup.enter="search()"
        >
        <div
            v-show="displaySuggestions && suggestions.length != 0"
            class="search-bar__suggestions"
        >
            <p
                v-for="suggestion in suggestions"
                :key="suggestion"
                class="search-bar__suggestions-item"
                @click="searchTerm = suggestion, search()"
            >
                {{ suggestion }}
            </p>
        </div>
    </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway"

export default {
    name: "SearchBar",
    mixins: [ clickaway ],
    data: function () {
        return {
            features: [],
            suggestions: [],
            searchTerm: "",
            displaySuggestions: false
        }
    },
    watch: {
        searchTerm: function () {
            this.updateSuggestions()
        }
    },
    mounted () {
        this.$root.$on("doseRateLayerChanged", this.onDoseRateLayerChanged)
    },
    methods: {
        onDoseRateLayerChanged (layer) {
            this.features = layer.getSource().getFeatures()
            if (this.displaySuggestions) {
                this.updateSuggestions()
            }
        },
        blur () {
            this.$refs.searchBarInput.blur()
            this.hideSuggestions()
        },
        showSuggestions () {
            this.updateSuggestions()
            this.displaySuggestions = true
        },
        hideSuggestions () {
            this.displaySuggestions = false
        },
        updateSuggestions () {
            this.suggestions = []
            this.features.forEach((feature) => {
                var site = feature.get("site")
                if (site.toLowerCase().startsWith(this.searchTerm.toLowerCase())) {
                    if (!this.suggestions.includes(site)) {
                        this.suggestions.push(site)
                    }
                }
            })

            this.suggestions.sort((a, b) => {
                return (a > b) ? 1 : (a < b) ? -1 : 0
            })
        },
        search() {
            if (this.searchTerm.length == 0) {
                return
            }

            for (var i = 0; i < this.features.length; ++i) {
                var site = this.features[i].get("site")
                if (site.toLowerCase() == this.searchTerm.toLowerCase()) {
                    this.searchTerm = site
                    this.blur()
                    this.$root.$emit("featureSelectedViaSearch", this.features[i])
                    return
                }
            }
        }
    }
}
</script>

<style>
.search-bar {
    position: absolute;
    height: 45px;
    width: 300px;
    top: 75px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.4);
}

.search-bar:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.search-bar__input {
    height: 40px;
    width: 295px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    line-height: 40px;
    background-color: rgba(0, 50, 136, 0.5);
    border-radius: 4px;
    text-align: center;
    color: white;
    border: none;
}

.search-bar__input:hover {
    background-color: rgba(0, 60, 136, 0.7);
}

.search-bar__input:focus {
    outline: none;
}

.search-bar__icon {
    position: absolute;
    width: 45px;
    height: 45px;
    background-image: url("~@/assets/icons/magnifying-glass.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 35%;
    z-index: 5;
}

.search-bar__icon:hover {
    cursor: pointer;
}

.search-bar__suggestions {
    position: relative;
    top: 55px;
    max-height: 212px;
    overflow: scroll;
    overflow-x: unset;
    background-color: white;
    border: 1px solid #CCC;
}

.search-bar__suggestions-item {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    margin: 0;
}

.search-bar__suggestions:hover {
    cursor: pointer;
}

@media only screen and (min-width: 768px) {
    .search-bar {
        top: 100px;
    }
}
</style>
