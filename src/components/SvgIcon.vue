<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    return {
      iconName: computed(() => `#icon-${props.name}`),
      svgClass: computed(() => {
        if (props.className) {
          return `svg-icon ${props.className}`;
        }
        return "svg-icon";
      })
    };
  }
});
</script>

<style scope lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
