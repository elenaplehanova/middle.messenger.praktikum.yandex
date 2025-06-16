import isEqual from "@/utils/isEqual";
import { Component } from "../Component";
import Store, { StoreEvents } from "./Store";

type Indexed<T = unknown> = {
  [key in string]: T;
};

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
  return function <P extends Record<string, unknown>>(
    ConnectedComponent: new (props: P) => Component<P>
  ) {
    return class extends ConnectedComponent {
      constructor(props: P) {
        let oldState = mapStateToProps(Store.getState());
        super({ ...props, ...oldState });

        Store.on(StoreEvents.Updated, () => {
          const newState = mapStateToProps(Store.getState());

          if (!isEqual(oldState, newState)) {
            this.setProps(newState);
          }
          oldState = newState;
        });
      }
    };
  };
}
