<template>
    <div :key="label" class="container">
      <input
        :id="id"
        type="radio"
        class="radio-button-input"
        :checked="isChecked"
        @change="onChange"
      >
      <label class="label" :for="id">{{ label }}</label>
    </div>
  </template>
  
  <script>
  export default {
    name: "BaseRadioButton",
    emits: ['update:modelValue'],
    props: {
      label: {
        type: String,
        required: true
      },
      ownValue: {
        type: String,
        required: true
      },
      modelValue: {
        type: String,
        required: true
      }
    },
    compatConfig: {
      MODE: 3,
      COMPONENT_V_MODEL: false
    },
    data() {
      return {
        id: String(Math.random())
      };
    },
    computed: {
      isChecked() {
        return this.ownValue === this.modelValue;
      }
    },
    methods: {
      onChange() {
        this.$emit("update:modelValue", this.ownValue);
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .container {
    display: inline-block;
  }
  
  .radio-button-input {
    opacity: 0;
    position: fixed;
    width: 0;
  
    &:checked + label {
      color: black;
      background-color: white;
      border-color: black;
      opacity: 1;
    }
  }
  
  .label {
    display: inline-block;
    background-color: #ddd;
    color: rgba(0, 0, 0, 0.5);
    padding: 0.75em 1em;
    font-family: sans-serif, Arial;
    font-size: $font-md;
    border: 2px solid #444;
    opacity: 0.75;
    border-radius: 4px;
  
    &:hover {
      cursor: pointer;
    }
  }
  </style>
  