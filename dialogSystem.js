// ============================================================
// Dialog System (Backlog #4 + #5)
// Owner: Abhishek Subramanian
// Self-contained modal dialog UI + send/receive engine.
// ============================================================

class DialogSystem {
    constructor(world) {
        this.world = world;
        this.activeNPC = null;
        this.isOpen = false;
        this.listeners = {
            onStart: [],
            onEnd: [],
            onMessage: [],
            onResponse: []
        };
        this._buildUI();
        this._wireEscapeKey();
    }

    // --- UI construction ---

    _buildUI() {
        const overlay = document.createElement("div");
        overlay.id = "dialog-overlay";
        overlay.className = "dialog-overlay";
        overlay.style.display = "none";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");

        const box = document.createElement("div");
        box.className = "dialog-box";

        const header = document.createElement("div");
        header.className = "dialog-header";

        const title = document.createElement("span");
        title.className = "dialog-npc-name";
        title.id = "dialog-npc-name";
        title.textContent = "Conversation";

        const closeBtn = document.createElement("button");
        closeBtn.className = "dialog-close";
        closeBtn.type = "button";
        closeBtn.textContent = "\u00D7";
        closeBtn.title = "Close (Esc)";
        closeBtn.setAttribute("aria-label", "Close dialog");
        closeBtn.addEventListener("click", () => this.endDialog());

        header.appendChild(title);
        header.appendChild(closeBtn);

        const speech = document.createElement("div");
        speech.id = "dialog-speech";
        speech.className = "dialog-speech";
        speech.setAttribute("aria-live", "polite");

        const responses = document.createElement("div");
        responses.id = "dialog-responses";
        responses.className = "dialog-responses";

        box.appendChild(header);
        box.appendChild(speech);
        box.appendChild(responses);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        this.overlayEl = overlay;
        this.boxEl = box;
        this.titleEl = title;
        this.speechEl = speech;
        this.responsesEl = responses;
    }

    _wireEscapeKey() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && this.isOpen) {
                event.preventDefault();
                this.endDialog();
            }
        });
    }

    // --- Event subscription ---

    on(event, callback) {
        if (this.listeners[event] && typeof callback === "function") {
            this.listeners[event].push(callback);
        }
    }

    _emit(event, payload) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach((cb) => {
            try { cb(payload); }
            catch (err) { console.error("DialogSystem listener error for " + event + ":", err); }
        });
    }

    // --- Lifecycle ---

    startDialog(npc) {
        this.activeNPC = npc || null;
        this.isOpen = true;
        this.titleEl.textContent = (npc && npc.name) ? npc.name : "Conversation";
        this.speechEl.textContent = "";
        this.clearResponses();
        this.overlayEl.style.display = "flex";
        this._emit("onStart", { npc: this.activeNPC });
    }

    endDialog() {
        if (!this.isOpen) return;
        const lastNPC = this.activeNPC;
        this.activeNPC = null;
        this.isOpen = false;
        this.overlayEl.style.display = "none";
        this.clearResponses();
        this.speechEl.textContent = "";
        this._emit("onEnd", { npc: lastNPC });
    }

    // --- Message API ---

    say(text) {
        const message = String(text == null ? "" : text);
        this.speechEl.textContent = message;
        this._emit("onMessage", { from: "npc", text: message, npc: this.activeNPC });
    }

    // choice = { label, value?, condition? }
    // condition() returning false hides the choice entirely (inventory-gated lines).
    setChoices(choices, onSelect) {
        this.clearResponses();
        if (!Array.isArray(choices)) return;

        choices.forEach((choice) => {
            if (!choice || !choice.label) return;
            if (typeof choice.condition === "function" && !choice.condition(this.world)) return;

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "dialog-choice-btn";
            btn.textContent = choice.label;

            btn.addEventListener("click", () => {
                const value = choice.value !== undefined ? choice.value : choice.label;
                this._emit("onResponse", {
                    type: "choice",
                    label: choice.label,
                    value: value,
                    npc: this.activeNPC
                });
                if (typeof onSelect === "function") onSelect(value, choice);
            });

            this.responsesEl.appendChild(btn);
        });
    }

    setFreeTextInput(prompt, onSubmit) {
        this.clearResponses();

        const wrap = document.createElement("div");
        wrap.className = "dialog-input-wrap";

        const label = document.createElement("label");
        label.className = "dialog-input-label";
        label.textContent = prompt || "Type your answer";
        label.htmlFor = "dialog-input-field";

        const inputRow = document.createElement("div");
        inputRow.className = "dialog-input-row";

        const input = document.createElement("input");
        input.type = "text";
        input.id = "dialog-input-field";
        input.className = "dialog-input";
        input.placeholder = "Type and press Enter...";
        input.autocomplete = "off";

        const submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.className = "dialog-submit-btn";
        submitBtn.textContent = "Send";

        const submit = () => {
            const text = input.value.trim();
            if (text === "") return;
            this._emit("onResponse", { type: "text", value: text, npc: this.activeNPC });
            if (typeof onSubmit === "function") onSubmit(text);
        };

        submitBtn.addEventListener("click", submit);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                submit();
            }
        });

        inputRow.appendChild(input);
        inputRow.appendChild(submitBtn);
        wrap.appendChild(label);
        wrap.appendChild(inputRow);
        this.responsesEl.appendChild(wrap);

        setTimeout(() => input.focus(), 0);
    }

    addLeaveOption(label) {
        const text = label || "Leave";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "dialog-choice-btn dialog-leave-btn";
        btn.textContent = text;
        btn.addEventListener("click", () => {
            this._emit("onResponse", { type: "leave", npc: this.activeNPC });
            this.endDialog();
        });
        this.responsesEl.appendChild(btn);
    }

    clearResponses() {
        this.responsesEl.replaceChildren();
    }
}
