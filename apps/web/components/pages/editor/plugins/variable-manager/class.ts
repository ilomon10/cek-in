"use client";

import { Editor } from "grapesjs";
import { get, set, unset, has, cloneDeep } from "lodash";
import { createNanoEvents, Emitter } from "nanoevents";

export type VariableMeta = {
  label?: string; // human label e.g. "User name"
  type: "input" | "select" | "group" | "root";
  [key: string]: any;
};

export type VariableState = {
  _meta: VariableMeta;
  [key: string]:
    | VariableState
    | VariableState[]
    | VariableMeta
    | string
    | undefined;
};

type VariableEvents = {
  change: (vars: VariableState) => void;
  update: (path: string, value: any) => void;
  remove: (path: string) => void;
  clear: () => void;
};

/**
 * VariableManager — manages a hierarchical variable tree with nanoevents-based pub/sub.
 */
export class VariableManager {
  private vars: VariableState = { _meta: { type: "root" } };
  private emitter: Emitter<VariableEvents>;

  constructor(
    public editor: Editor,
    initial?: VariableState
  ) {
    this.emitter = createNanoEvents<VariableEvents>();
    if (initial) this.setState(initial);

    editor.on("project:load", ({ project }) => {
      if (project.variables) this.setState(project.variables);
    });
    editor.on("project:get", ({ project }) => {
      project.variables = this.toJSON();
    });
  }

  /** Get the entire variable tree */
  getState(): VariableState {
    return cloneDeep(this.vars);
  }

  /** Replace full state */
  setState(next: VariableState) {
    this.vars = cloneDeep(next);
    this.publish();
  }

  /** Convert to JSON safely */
  toJSON(): VariableState {
    return this.getState();
  }

  /** Get variable by lodash path */
  get(path: string): any {
    return get(this.vars, path);
  }

  /** Set variable or subtree by path */
  set(path: string, value: any) {
    set(this.vars, path, cloneDeep(value));
    this.publish("update", path, value);
  }

  /** Update variable shallowly */
  update(path: string, patch: Partial<VariableState>) {
    if (!has(this.vars, path)) {
      throw new Error(`Variable path not found: ${path}`);
    }
    const existing = get(this.vars, path) as VariableState;
    const merged = { ...existing, ...patch };
    set(this.vars, path, merged);
    this.publish("update", path, merged);
  }

  /** Remove variable subtree */
  remove(path: string) {
    if (!has(this.vars, path)) return false;
    unset(this.vars, path);
    this.publish("remove", path);
    return true;
  }

  /** Clear all variables */
  clear() {
    const rootMeta = this.vars._meta;
    this.vars = { _meta: rootMeta };
    this.publish("clear");
  }

  /** Subscribe to variable changes — now event-driven */
  on<K extends keyof VariableEvents>(event: K, cb: VariableEvents[K]) {
    return this.emitter.on(event, cb);
  }

  /** Internal: trigger events + GrapesJS compatibility event */
  private publish(event: keyof VariableEvents = "change", ...args: any[]) {
    const snapshot = this.getState();
    this.emitter.emit("change", snapshot);
    if (event !== "change") this.emitter.emit(event as any, ...(args as any));
    this.editor.trigger("variable:changed", snapshot);
  }
}
