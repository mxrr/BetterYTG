import Emotes from "./Emotes";
import PersistentSyncStorage from "src/helpers/PersistentSyncStorage";

class Message {
  constructor(messageNode) {
    this.node = messageNode;
    this.id = this.node.id; // this.id should not be used to reference the node, dom id changes due to optimisitc updates
    this.hasEmotes = null;
    this.observer = null;
    this.parsedText = ""; // This should be fine since you can't edit/change messages

    this.parseText();

    if (
      PersistentSyncStorage.data.options["enableChatColors"] &&
      this.node.getAttribute("author-type") !== "owner"
    ) {
      this.setAuthorColor();
    }

    if (this.hasEmotes) {
      this.node.setAttribute("bytg-id", this.id);
      this.setHtml();
      this.watch();
    }
  }

  get textNode() {
    const node = this.node.querySelector("#message");
    return {
      node,
      text: node.innerText,
    };
  }

  parseText() {
    const rawWords = this.textNode.text.split(" ");

    for (let i = 0, length = rawWords.length; i < length; i++) {
      const word = this.parseIllegalCharcters(rawWords[i]);
      const emote = Emotes.get(word);

      if (typeof emote === "undefined") {
        this.parsedText += word + " ";
      } else {
        this.hasEmotes = true;
        this.parsedText += emote.html + " ";
      }
    }
  }

  watch() {
    this.observer = new MutationObserver((mutations) => {
      let emoteRemoved = false;

      mutations.forEach((mutation) => {
        if (typeof mutation.removedNodes === "undefined") return;
        if (mutation.removedNodes.length <= 0) return; // This must be after undefined check

        for (
          let i = 0, length = mutation.removedNodes.length;
          i < length;
          i++
        ) {
          const removedNode = mutation.removedNodes[i];
          if (
            typeof removedNode.className === "string" && // check if className exists, is 'SVGAnimatedString' when window resized and removed
            ~removedNode.className.indexOf("BYTG-Emote") !== 0
          ) {
            emoteRemoved = true;
          }
        }
      });

      if (emoteRemoved && document.body.contains(this.node)) {
        this.setHtml();
      }
    });

    this.observer.observe(this.node, {
      childList: true,
      attributes: false,
      characterData: false,
      subtree: true,
    });
  }

  setHtml() {
    this.textNode.node.textContent = this.parsedText;
  }

  setAuthorColor() {
    let imageSrc = this.node.querySelector("#img").src;
    if (imageSrc[0] !== "h") {
      // src for client user input is data instead of http/s
      imageSrc = document.querySelector(
        "yt-live-chat-message-input-renderer #avatar #img"
      ).src;
    }

    // Get only the identifying part from the image url
    const parsedURLId = imageSrc.split("/")[4].split("=")[0];

    // Get a character halfway into the string to use for the colour
    const colorId = parsedURLId[parsedURLId.length / 2];

    if (colorId) {
      this.node.classList.add(`BYTG-chat-color-${colorId}`);
    } else {
      console.warn(
        `couldn't get colorID from ${parsedURLId[parsedURLId.length / 2]} url`
      );
    }
  }

  parseIllegalCharcters(word) {
    // ﻿ === 'ZERO WIDTH NO-BREAK SPACE'
    return word.replace("﻿", "").trim();
  }

  destroy() {
    if (this.observer !== null) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

export default Message;
