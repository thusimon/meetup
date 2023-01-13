import WebSocket, { MessageEvent, CloseEvent } from 'ws';

class Socket {
  ws: WebSocket;
  url: string;
  constructor(url: string) {
    this.url = url;
  }
  async connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.url);
      ws.onopen = (evt) => {
        this.ws = ws;
        resolve('success');
      }
      ws.onerror = (evt) => {
        reject(evt.message);
      }
    });
  }
  send(data: string) {
    this.ws.send(data);
  }
  onMessage(callback: (evt: MessageEvent) => void) {
    this.ws.onmessage = callback;
  }
  onClose(callback: (evt: CloseEvent) => void) {
    this.ws.onclose = callback
  }
};

export default Socket;
