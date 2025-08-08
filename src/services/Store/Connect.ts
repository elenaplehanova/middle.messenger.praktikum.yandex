import { isEqual } from "@/utils/isEqual";
import type { Component } from "../Component";
import Store, { StoreEvents } from "./Store";
import type { Indexed } from "@/utils/set";
import cloneDeep from "@/utils/cloneDeep";

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
  return function <P extends Record<string, unknown>>(
    ConnectedComponent: new (props: P) => Component<P>
  ) {
    return class extends ConnectedComponent {
      constructor(props: P = {} as P) {
        let oldState = mapStateToProps(Store.getState());
        super({ ...props, ...oldState });

        Store.on(StoreEvents.Updated, () => {
          const newState = mapStateToProps(Store.getState());

          if (!isEqual(oldState, newState)) {
            this.setProps(newState);
          }
          oldState = cloneDeep(newState);
        });
      }
    };
  };
}
