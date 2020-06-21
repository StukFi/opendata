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

<style>
.button-close-popup {
    text-decoration: none;
    position: absolute;
    top: 0;
    right: 12px;
    color: black;
    font-size: 2em;
}

.button-close-popup:hover {
    color: black;
    text-decoration: none;
}

.button-close-popup:focus {
    outline: none;
}
</style>
