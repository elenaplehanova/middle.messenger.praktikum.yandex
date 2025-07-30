import set from "@/utils/set";
import type { Indexed } from "@/utils/set";
import { EventBus } from "../EventBus";
import isEqual from "@/utils/isEqual";
import cloneDeep from "@/utils/cloneDeep";

export enum StoreEvents {
  Updated = "updated",
}

class Store extends EventBus {
  private state: Indexed = {};

  public getState() {
    return cloneDeep(this.state);
  }

  public set(path: string, value: unknown) {
    const oldValue = this.getState();
    if (!isEqual(oldValue, value)) {
      set(this.state, path, value);
      this.emit(StoreEvents.Updated);
    }
  }
}

export default new Store();
