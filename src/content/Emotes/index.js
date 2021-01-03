import PersistentSyncStorage from "src/helpers/PersistentSyncStorage";

import CustomEmotes from "src/assets/emotes/dictionary.json";
import OldIceEmotes from "./oldIce.json";
import TwitchEmotes from "./twitch.json";

import Emote from "./Emote";

class Emotes {
  constructor() {
    this.dictionary = new Map();
    this.init = this.init.bind(this);
  }

  init() {
    return Promise.all([
      PersistentSyncStorage.data.options["enableTwitchEmotes"] &&
        this.loadTwitch(),
      PersistentSyncStorage.data.options["enableBetterYTGEmotes"] &&
        this.loadBetterYTG(),
      PersistentSyncStorage.data.options["enableOldIceEmotes"] &&
        this.loadOldIce(),
    ]);
  }

  loadTwitch() {
    const emoteCodes = Object.keys(TwitchEmotes);

    for (let i = emoteCodes.length - 1; i >= 0; i--) {
      const code = emoteCodes[i];
      const emoteId = TwitchEmotes[code];
      const url = `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`;
      this.dictionary.set(code, new Emote({ code, url }));
    }
  }

  loadBetterYTG() {
    const emoteCodes = Object.keys(CustomEmotes);

    for (let i = emoteCodes.length - 1; i >= 0; i--) {
      const code = emoteCodes[i];
      const filename = CustomEmotes[code];
      const url = chrome.runtime.getURL(`/assets/emotes/images/${filename}`);
      this.dictionary.set(code, new Emote({ code, url }));
    }
  }

  loadOldIce() {
    const emoteCodes = Object.keys(OldIceEmotes);

    for (let i = emoteCodes.length - 1; i >= 0; i--) {
      const code = emoteCodes[i];
      const emoteId = OldIceEmotes[code];
      const url = `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`;
      this.dictionary.set(code, new Emote({ code, url }));
    }
  }

  get(key) {
    return this.dictionary.get(key);
  }

  set(key, value) {
    return this.dictionary.set(key, new Emote(value));
  }

  has(key) {
    return this.dictionary.has(key);
  }
}

export default new Emotes();
