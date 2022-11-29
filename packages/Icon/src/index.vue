<template>
  <svg class="xpb-icon" aria-hidden="true" @click="$emit('click', $event)">
    <use :xlink:href="`#${iconClass}`"></use>
  </svg>
</template>

<script>
export default {
  name: 'XIcon',
  props: {
    iconClass: {
      type: String,
      require: true
    }
  }
}
</script>
