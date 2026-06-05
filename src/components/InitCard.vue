<template>
  <div :class="`init-card ml-sm ${card.keep ? 'keep' : ''}`" @click="editOpen">
    {{ card.card === 0 ? '' : card.card }}
  </div>

  <dialog ref="editCard">
    <div class="card items-center justify-center">
      <div class="row mb-md"><strong>Set Card Value</strong></div>
      <input class="row full-width mb-md" type="number" v-model.number="n" :min="0" :max="maxCards" />

      <div class="row mb-md full-width items-center">
        <span class="col mr-sm">Keep Card</span>
        <input class="col" type="checkbox" v-model="k" />
      </div>

      <button class="row full-width mb-md" @click="editDone()">UPDATE</button>

      <button class="row full-width" @click="editDone(true)">END TURN</button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { InitCard } from './models';

import { maxCards, setCardNumber, setKeepCard } from '../lib/initiativeList';

const props = defineProps<{
  card: InitCard;
  id: string;
  index: number;
}>();

const n = ref(0); // Card number
const k = ref(false); // Keep card
const editCard = ref<HTMLDialogElement | null>(null);

const editOpen = () => {
  n.value = props.card.card;
  k.value = props.card.keep;
  editCard.value?.showModal();
};

const editDone = async (endTurn?: boolean) => {
  if (endTurn && !k.value) n.value = 0;
  if (n.value != props.card.card) await setCardNumber(props.id, props.index, n.value);
  if (k.value != props.card.keep) await setKeepCard(props.id, props.index, k.value);
  editCard.value?.close();
};
</script>
