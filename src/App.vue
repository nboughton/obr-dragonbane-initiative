<template>
  <div class="row items-center mb-sm">
    <strong class="mr-sm">Max. Cards: {{ maxCards }}</strong>
    <SvgIcon class="cog-btn" :path="mdiCog" @click="configDialog?.showModal()" />
  </div>

  <div class="mb-sm init-row" v-for="item in initiativeItems" :key="`init-${item.id}`">
    <div class="row justify-between">
      <div class="col mr-md init-title" @click="charOpen(item)">
        {{ item.name }}
      </div>

      <div class="col">
        <div class="row">
          <InitCard v-for="(card, j) in item.initiative" :key="`card-${uid()}`" :card="card" :id="item.id" :index="j" />
        </div>
      </div>
    </div>

    <div v-if="role == 'GM'" class="row items-center justify-between">
      <div v-if="item.hp.max != 0" class="col mt-sm">
        <div class="row">
          <SvgIcon class="mr-sm" :path="mdiHeart" :fill-pc="item.hp.cur / item.hp.max" />
          {{ item.hp.max }}/{{ item.hp.cur }}
        </div>
      </div>
      <div v-if="item.wp.max != 0" class="col mt-sm">
        <div class="row">
          <SvgIcon class="mr-sm" :path="mdiHead" :fill-pc="item.wp.cur / item.wp.max" />
          {{ item.wp.max }}/{{ item.wp.cur }}
        </div>
      </div>
    </div>
  </div>

  <button class="row init-btn mt-md" @click="drawCards">DRAW INITIATIVE</button>

  <dialog ref="configDialog">
    <div class="card items-center justify-center">
      <div class="row mb-md"><strong>Set Max. Cards</strong></div>
      <input class="row full-width mb-md" type="number" v-model.number="maxCards" />

      <button class="row full-width" @click="configDialog?.close()">DONE</button>
    </div>
  </dialog>

  <dialog ref="charDialog">
    <div class="card items-center justify-center">
      <div class="row mb-md"><strong>Set Label</strong></div>
      <input class="row full-width mb-md" type="text" v-model="charLabel" />

      <div class="row" v-if="role == 'GM'">
        <div class="col justify-center items-center">
          <div class="row mb-sm"><strong>HP</strong></div>
          <div class="row full-width mb-md">
            <input type="number" class="col btn-group-left" placeholder="Max HP" v-model="charHP.max" />
            <input type="number" class="col btn-group-right" placeholder="Cur. HP" v-model="charHP.cur"
              :max="charHP.max" />
          </div>

          <div class="row mb-sm"><strong>WP</strong></div>
          <div class="row full-width mb-md">
            <input type="number" class="col btn-group-left" placeholder="Max WP" v-model="charWP.max" />
            <input type="number" class="col btn-group-right" placeholder="Cur. WP" v-model="charWP.cur"
              :max="charWP.max" />
          </div>
        </div>
      </div>

      <div class="row mb-md"><strong>Set Ferocity</strong></div>
      <input class="row full-width mb-md" type="number" v-model.number="charFerocity" :min="1" />

      <button class="row full-width" @click="charDone()">DONE</button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import InitCard from './components/InitCard.vue';
import SvgIcon from './components/SvgIcon.vue';

import { ref } from 'vue';

import { InitListItem as InitListItem, StatTrack } from './components/models';

import OBR from '@owlbear-rodeo/sdk';
import { mdiCog, mdiHead, mdiHeart } from '@mdi/js';
import { v4 as uid } from 'uuid';

import { setupTheme } from './lib/theme';
import { setupContextMenu } from './lib/contextMenu';
import {
  initiativeItems,
  setupInitiativeList,
  maxCards,
  drawCards,
  setFerocity,
  setLabel,
  setHP,
  setWP,
} from './lib/initiativeList';
import { role, setupRoleView } from './lib/roleView';
import { copyStruct } from './lib/util';

// Template refs
const configDialog = ref<HTMLDialogElement | null>(null);
const charDialog = ref<HTMLDialogElement | null>(null);
const charFerocity = ref(1);
const charLabel = ref('');
const charHP = ref<StatTrack>({ cur: 0, max: 0 });
const charWP = ref<StatTrack>({ cur: 0, max: 0 });

// Control value for item edits
const charItem = ref<InitListItem>({
  id: 'placeholder',
  name: 'placeholder',
  initiative: [],
  hp: { max: 0, cur: 0 },
  wp: { max: 0, cur: 0 },
});

// Operations
const charOpen = (item: InitListItem) => {
  charFerocity.value = item.initiative.length;
  charLabel.value = item.name;
  // Javascript passes objects by reference so we want copies here
  charHP.value = copyStruct(item.hp);
  charWP.value = copyStruct(item.wp);
  charItem.value = copyStruct(item);

  charDialog.value?.showModal();
};
const charDone = async () => {
  if (charLabel.value !== charItem.value.name) await setLabel(charItem.value.id, charLabel.value);

  if (charFerocity.value !== charItem.value.initiative.length) await setFerocity(charItem.value.id, charFerocity.value);

  if (charHP.value.max !== charItem.value.hp.max || charHP.value.cur !== charItem.value.hp.cur)
    await setHP(charItem.value.id, charHP.value);

  if (charWP.value.max !== charItem.value.wp.max || charWP.value.cur !== charItem.value.wp.cur)
    await setWP(charItem.value.id, charWP.value);
  charDialog.value?.close();
};

OBR.onReady(() => {
  setupTheme(), setupRoleView(), setupContextMenu();
  setupInitiativeList();
});
</script>



<style scoped>
.init-card,
.init-title,
.cog-btn {
  cursor: pointer;
}
</style>
