// ============================================================
// Quest Progression System (Backlog #13)
// Owner: Abhishek Subramanian
// Linear stage tracker + fixed-position quest log UI.
// ============================================================

class Quest {
    constructor(def) {
        this.id = def.id;
        this.title = def.title || def.id;
        this.description = def.description || "";
        this.stages = (def.stages || []).map((stage, index) => {
            if (typeof stage === "string") {
                return { id: "stage_" + index, description: stage };
            }
            return {
                id: stage.id || "stage_" + index,
                description: stage.description || ""
            };
        });
        this.currentIndex = -1; // -1 = not started
    }

    isStarted() { return this.currentIndex >= 0; }

    isComplete() {
        return this.stages.length > 0
            && this.currentIndex >= this.stages.length - 1
            && this.isStarted();
    }

    getCurrentStage() {
        if (!this.isStarted() || this.currentIndex >= this.stages.length) return null;
        return this.stages[this.currentIndex];
    }

    findStageIndex(stageId) {
        return this.stages.findIndex((s) => s.id === stageId);
    }
}

class QuestSystem {
    constructor(world) {
        this.world = world;
        this.quests = {};
        this.flags = {};
        this.listeners = {
            onQuestStart: [],
            onStageChange: [],
            onQuestComplete: []
        };
        this._buildUI();
    }

    // --- UI construction ---

    _buildUI() {
        const panel = document.createElement("div");
        panel.id = "quest-log";
        panel.className = "quest-log";

        const header = document.createElement("div");
        header.className = "quest-log-header";

        const title = document.createElement("span");
        title.className = "quest-log-title";
        title.textContent = "Quest Log";

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "quest-log-toggle";
        toggle.textContent = "\u2212";
        toggle.title = "Collapse / expand";
        toggle.setAttribute("aria-label", "Toggle quest log");

        header.appendChild(title);
        header.appendChild(toggle);

        const body = document.createElement("div");
        body.className = "quest-log-body";

        panel.appendChild(header);
        panel.appendChild(body);
        document.body.appendChild(panel);

        toggle.addEventListener("click", () => {
            const collapsed = panel.classList.toggle("collapsed");
            toggle.textContent = collapsed ? "+" : "\u2212";
        });

        this.panelEl = panel;
        this.bodyEl = body;
        this._render();
    }

    _render() {
        this.bodyEl.replaceChildren();
        const active = this.getActiveQuests();
        const completed = Object.values(this.quests).filter((q) => q.isComplete());

        if (active.length === 0 && completed.length === 0) {
            const empty = document.createElement("div");
            empty.className = "quest-log-empty";
            empty.textContent = "No active quests.";
            this.bodyEl.appendChild(empty);
            return;
        }

        if (active.length > 0) {
            const sectionLabel = document.createElement("div");
            sectionLabel.className = "quest-log-section";
            sectionLabel.textContent = "Active";
            this.bodyEl.appendChild(sectionLabel);
            active.forEach((quest) => this.bodyEl.appendChild(this._renderQuestEntry(quest, false)));
        }

        if (completed.length > 0) {
            const sectionLabel = document.createElement("div");
            sectionLabel.className = "quest-log-section";
            sectionLabel.textContent = "Completed";
            this.bodyEl.appendChild(sectionLabel);
            completed.forEach((quest) => this.bodyEl.appendChild(this._renderQuestEntry(quest, true)));
        }
    }

    _renderQuestEntry(quest, completed) {
        const entry = document.createElement("div");
        entry.className = "quest-entry" + (completed ? " quest-entry-complete" : "");

        const titleEl = document.createElement("div");
        titleEl.className = "quest-entry-title";
        titleEl.textContent = quest.title;

        const stageEl = document.createElement("div");
        stageEl.className = "quest-entry-stage";
        const stage = quest.getCurrentStage();
        const stageDesc = stage ? stage.description : "";
        const progress = quest.stages.length > 0
            ? "(" + (quest.currentIndex + 1) + "/" + quest.stages.length + ") "
            : "";
        stageEl.textContent = progress + stageDesc;

        entry.appendChild(titleEl);
        entry.appendChild(stageEl);
        return entry;
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
            catch (err) { console.error("QuestSystem listener error for " + event + ":", err); }
        });
    }

    // --- Quest definition + progression ---

    defineQuest(def) {
        if (!def || !def.id) {
            console.warn("QuestSystem.defineQuest called without id");
            return null;
        }
        const quest = new Quest(def);
        this.quests[def.id] = quest;
        this._render();
        return quest;
    }

    startQuest(questId) {
        const quest = this.quests[questId];
        if (!quest || quest.isStarted()) return;
        quest.currentIndex = 0;
        this._render();
        this._emit("onQuestStart", { quest, stage: quest.getCurrentStage() });
        this._emit("onStageChange", { quest, stage: quest.getCurrentStage() });
        if (quest.isComplete()) this._emit("onQuestComplete", { quest });
    }

    advanceStage(questId) {
        const quest = this.quests[questId];
        if (!quest) return;
        if (!quest.isStarted()) { this.startQuest(questId); return; }
        if (quest.isComplete()) return;
        quest.currentIndex += 1;
        this._render();
        this._emit("onStageChange", { quest, stage: quest.getCurrentStage() });
        if (quest.isComplete()) this._emit("onQuestComplete", { quest });
    }

    setStage(questId, stageId) {
        const quest = this.quests[questId];
        if (!quest) return;
        const targetIndex = quest.findStageIndex(stageId);
        if (targetIndex === -1) {
            console.warn("QuestSystem.setStage: unknown stage '" + stageId + "' for quest '" + questId + "'");
            return;
        }
        if (quest.currentIndex === targetIndex) return;
        quest.currentIndex = targetIndex;
        this._render();
        this._emit("onStageChange", { quest, stage: quest.getCurrentStage() });
        if (quest.isComplete()) this._emit("onQuestComplete", { quest });
    }

    //Aaron helper function
    nextStage(questId) {
        const quest = this.quests[questId];
        if (!quest) return;
        quest.currentIndex = Math.max(quest.currentIndex+1, 0);
        this._render();
        this._emit("onStageChange", { quest, stage: quest.getCurrentStage() });
        if (quest.isComplete()) this._emit("onQuestComplete", { quest });
    }


    completeQuest(questId) {
        const quest = this.quests[questId];
        if (!quest || quest.stages.length === 0 || quest.isComplete()) return;
        quest.currentIndex = quest.stages.length - 1;
        this._render();
        this._emit("onStageChange", { quest, stage: quest.getCurrentStage() });
        this._emit("onQuestComplete", { quest });
    }

    // --- Queries ---

    getStage(questId)      { const q = this.quests[questId]; return q ? q.getCurrentStage() : null; }
    getStageIndex(questId) { const q = this.quests[questId]; return q ? q.currentIndex : -1; }
    isActive(questId)      { const q = this.quests[questId]; return q ? q.isStarted() && !q.isComplete() : false; }
    isComplete(questId)    { const q = this.quests[questId]; return q ? q.isComplete() : false; }
    getActiveQuests()      { return Object.values(this.quests).filter((q) => q.isStarted() && !q.isComplete()); }
    getQuest(questId)      { return this.quests[questId] || null; }

    // --- Generic flag store (for path locks etc.) ---

    setFlag(name, value) { this.flags[name] = value; }
    getFlag(name)        { return this.flags[name]; }
}
