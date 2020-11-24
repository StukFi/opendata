<template>
    <a
        href="#"
        class="button-close-popup"
        @click="$emit('click')"
    >&times;</a>
</template>

<script>
export default {
    name: "ButtonClosePopup"
}
</script>

<style lang="scss">
.button-close-popup {
    text-decoration: none;
    position: absolute;
    top: 0;
    right: 0.75em;
    color: black;
    font-size: $font-lg;
}

.button-close-popup:hover {
    color: black;
    text-decoration: none;
}

.button-close-popup:focus {
    outline: none;
}
</style>
