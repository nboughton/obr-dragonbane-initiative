import OBR, { Image, isImage, Item } from '@owlbear-rodeo/sdk';

import { IDs, InitCard, InitListItem, StatTrack } from '../components/models';

import { ref } from 'vue';

export const initiativeItems = ref(<InitListItem[]>[]);
export const maxCards = ref(10);

export const setupInitiativeList = () => {
  const renderList = (items: Item[]) => {
    initiativeItems.value = [];

    for (const item of items) {
      const metadata = item.metadata[IDs.Meta] as InitListItem;
      if (metadata && isImage(item)) {
        initiativeItems.value.push({
          id: item.id,
          name: item.text.plainText ? item.text.plainText : item.name,
          initiative: metadata.initiative,
          hp: metadata.hp,
          wp: metadata.wp,
        });
      }
    }

    initiativeItems.value.sort(
      (a, b) =>
        a.initiative.reduce((acc, cur) => (acc.card < cur.card ? acc : cur)).card -
        b.initiative.reduce((acc, cur) => (acc.card < cur.card ? acc : cur)).card
    );
  };

  const init = (sceneReady: boolean) => {
    if (sceneReady) {
      OBR.scene.items.onChange(renderList);
      OBR.scene.items.getItems().then(renderList);
    }
  };

  OBR.scene.onReadyChange(init);
  OBR.scene.isReady().then(init);
};

export const drawCards = async () => {
  const cards: number[] = [];
  for (let i = 1; i <= maxCards.value; i++) cards.push(i);
  await OBR.scene.items.updateItems(
    (item): item is Item => (item.metadata[IDs.Meta] ? true : false),
    (items) => {
      // Splice out any kept cards
      for (let item of items) {
        const meta = item.metadata[IDs.Meta] as InitListItem;
        meta.initiative.forEach((c) => {
          if (c.keep) {
            const i = cards.findIndex((n) => n === c.card);
            if (i > -1) cards.splice(i, 1);
          }
        });
      }

      // Draw the cards
      for (let item of items) {
        const meta = item.metadata[IDs.Meta] as InitListItem;
        meta.initiative.forEach((_, i) => {
          if (cards.length === 0) {
            OBR.notification.show('No more initiative cards, consider grouping some enemies.', 'WARNING');
            return;
          }

          if (!meta.initiative[i].keep) {
            const c = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
            meta.initiative[i].card = c;
          }
        });
      }
    }
  );
};

export const setLabel = async (id: string, value: string) =>
  await OBR.scene.items.updateItems(
    (item): item is Image => item.id === id,
    (items) => {
      for (let item of items) {
        item.text.plainText = value;
      }
    }
  );

export const setHP = async (id: string, hp: StatTrack) =>
  await OBR.scene.items.updateItems(
    (item): item is Item => item.id === id,
    (items) => {
      for (let item of items) {
        const meta = item.metadata[IDs.Meta] as InitListItem;
        meta.hp = { max: hp.max, cur: hp.cur };
      }
    }
  );

export const setWP = async (id: string, wp: StatTrack) =>
  await OBR.scene.items.updateItems(
    (item): item is Item => item.id === id,
    (items) => {
      for (let item of items) {
        const meta = item.metadata[IDs.Meta] as InitListItem;
        meta.wp = { max: wp.max, cur: wp.cur };
      }
    }
  );

export const setFerocity = async (id: string, value: number) =>
  await OBR.scene.items.updateItems(
    (item): item is Item => item.id === id,
    (items) => {
      for (let item of items) {
        value = value < 1 ? 1 : value;
        const meta = item.metadata[IDs.Meta] as InitListItem;
        const cards: InitCard[] = Array(value).fill({
          card: 0,
          keep: false,
        });
        cards.forEach((_, i) => (cards[i] = { card: 0, keep: false }));
        meta.initiative = cards;
      }
    }
  );

export const markDone = async (id: string, index: number) =>
  await OBR.scene.items.updateItems(
    (item): item is Item => item.id === id,
    (items) => {
      for (let item of items) {
        const meta = item.metadata[IDs.Meta] as InitListItem;
        meta.initiative[index].card = 0;
      }
    }
  );

export const setKeepCard = async (id: string, index: number, value: boolean) =>
  await OBR.scene.items.updateItems(
    (item): item is Item => item.id === id,
    (items) => {
      for (let item of items) {
        const meta = item.metadata[IDs.Meta] as InitListItem;
        meta.initiative[index].keep = value;
      }
    }
  );

export const setCardNumber = async (id: string, index: number, value: number) =>
  await OBR.scene.items.updateItems(
    (item): item is Item => item.id === id,
    (items) => {
      for (let item of items) {
        const meta = item.metadata[IDs.Meta] as InitListItem;
        meta.initiative[index].card = value;
      }
    }
  );
