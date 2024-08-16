export interface Handler {
  (input?: any): any;
}

export interface BridgeEvent {
  name: string;
  handler: Handler;
}

export interface BridgeOption {
  sender?: Window | null;
  events?: BridgeEvent[];
  senderOrigin?: string;
}
