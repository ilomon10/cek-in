import { Component, Editor } from "grapesjs";
import { createNanoEvents, Emitter } from "nanoevents";

export type SectionType = {
  id: string;
  label?: string;
  icon?: string;
  component: Component;
};

export type SectionState = SectionType[];

type SectionEvents = {
  change: (items: SectionState) => void;
  add: (section: SectionType) => void;
  remove: (id: string) => void;
  update: (section: SectionType) => void;
  clear: () => void;
};

/**
 * SectionManager — watches GrapesJS "section" components and provides event-driven updates.
 */
export class SectionManager {
  private items: SectionState = [];
  private emitter: Emitter<SectionEvents>;

  constructor(public editor: Editor) {
    this.emitter = createNanoEvents<SectionEvents>();
    // Initial scan

    editor.on("project:load", () => {
      this.scanSections();
    });

    // Watch for section changes
    editor.on("component:add", (component) => {
      if (component.get("type") === "section") this.addSection(component);
    });

    editor.on("component:remove", (component) => {
      if (component.get("type") === "section") this.removeSection(component);
    });

    editor.on("component:update", (component) => {
      if (component.get("type") === "section") this.updateSection(component);
    });
  }

  /** Get current section list */
  getState(): SectionState {
    return [...this.items];
  }

  /** Rescan all sections in editor (fallback for full rebuild) */
  private scanSections() {
    const all = this.editor.getWrapper()!.findType("section");
    this.items = all.map((component) => ({
      id: component.getId(),
      label: component.get("name") || "Untitled Section",
      icon: undefined,
      component,
    }));
    this.publish("change", this.items);
  }

  private addSection(component: Component) {
    if (this.items.findIndex((item) => item.id === component.getId()) > -1) {
      return;
    }
    const section = {
      id: component.getId(),
      label: component.get("name") || "Untitled Section",
      component,
    };
    this.items.push(section);
    this.publish("add", section);
  }

  private removeSection(component: Component) {
    const id = component.getId();
    this.items = this.items.filter((s) => s.id !== id);
    this.publish("remove", id);
  }

  private updateSection(component: Component) {
    const id = component.getId();
    const idx = this.items.findIndex((s) => s.id === id);
    if (idx !== -1) {
      console.log(id, idx);
      const existing = this.items[idx]!;
      const updated: SectionType = {
        id: existing.id,
        label: component.get("name") || existing.label,
        icon: existing.icon,
        component: component,
      };
      this.items[idx] = updated;
      this.publish("update", updated);
    }
  }

  clear() {
    this.items = [];
    this.publish("clear");
  }

  on<K extends keyof SectionEvents>(event: K, cb: SectionEvents[K]) {
    return this.emitter.on(event, cb);
  }

  private publish(event: keyof SectionEvents, ...args: any[]) {
    this.emitter.emit(event as any, ...(args as any));
    if (event !== "change") this.emitter.emit("change", this.getState());
    this.editor.trigger("section:changed", this.getState());
  }
}
