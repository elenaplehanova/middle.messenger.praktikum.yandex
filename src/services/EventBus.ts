type EventCallback<T extends unknown[] = unknown[]> = (...args: T) => void;

export class EventBus {
  private listeners: {
    [event: string]: EventCallback<unknown[]>[];
  } = {};

  on<T extends unknown[]>(event: string, callback: EventCallback<T>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback as EventCallback<unknown[]>);
  }

  off<T extends unknown[]>(event: string, callback: EventCallback<T>): void {
    if (!this.listeners[event]) {
      throw new Error(`No event: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  emit<T extends unknown[]>(event: string, ...args: T): void {
    if (!this.listeners[event]) {
      throw new Error(`No event: ${event}`);
    }

    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }

//   clear(event?: string): void {
//     if (event) {
//       delete this.listeners[event];
//     } else {
//       this.listeners = {};
//     }
//   }
}
