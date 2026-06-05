<template>
  <svg xmlns="http://www.w3.org/2000/svg" :height="height ? height : 24" :width="width ? width : 24">
    <linearGradient v-if="fillPc" :id="`lg-${id}`" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%" :stop-color="colours.primary.light" />
      <stop :offset="`${percent}%`" :stop-color="colours.primary.light" />
      <stop :offset="`${percent}%`" :stop-color="colours.primary.dark" />
      <stop offset="100%" :stop-color="colours.primary.dark" />
    </linearGradient>
    <path v-if="fillPc" :d="path" :fill="`url(#lg-${id})`" />
    <path v-else :d="path" />
  </svg>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { v4 as uid } from 'uuid';
import { colours } from '../lib/theme';

const props = defineProps<{
  path: string;
  height?: number;
  width?: number;
  fillPc?: number;
}>();

const id = ref(uid());
const percent = computed((): number => (props.fillPc ? Math.floor(props.fillPc * 100) : 100));

onMounted(() => (id.value = uid()));
</script>
