export class WebSocketClient {
  private socket: WebSocket;
  private url: string;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onOpenCallback: ((data: any) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;
    this.socket.onerror = this.handleError;
    this.socket.onclose = this.handleClose;
  }

  private handleOpen = (event: Event) => {
    if (this.onOpenCallback) {
      this.onOpenCallback(event);
    }
  };

  private handleMessage = (event: MessageEvent) => {
    if (this.onMessageCallback) {
      this.onMessageCallback(event.data);
    }
  };

  private handleError = (event: Event) => {
    console.error("WebSocket error:", event);
  };

  private handleClose = (event: CloseEvent) => {
    console.log("WebSocket connection closed:", event);
  };

  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ content: message, type: "message" }));
    } else {
      console.warn(
        "WebSocket is not open. Ready state:",
        this.socket.readyState
      );
    }
  }

  public getMessages(): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          content: "0",
          type: "get old",
        })
      );
    } else {
      console.warn(
        "WebSocket is not open. Ready state:",
        this.socket.readyState
      );
    }
  }

  public close(): void {
    this.socket.close();
  }

  public onMessage(callback: (data: any) => void): void {
    this.onMessageCallback = callback;
  }

  public onOpen(callback: (data: any) => void): void {
    this.onOpenCallback = callback;
  }
}
