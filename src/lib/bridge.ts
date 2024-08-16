import { Logger } from '../utils';
import { BridgeEvent, BridgeOption, Handler } from '../types/bridge';
import { CMD, Command } from '../types/cmd';

if (console && typeof console.log === 'function') console.log('bridge version:', process.env.__VERSION__);

enum CommandType {
  CALLBACK = '__CALLBACK__',
  InitSenderType = '__INIT_SENDER__',
  InitSenderReadyType = '__INIT_SENDER_READY__',
}

const GaasTarget = '__GaasAppTarget__';

const SenderOriginAll = '*';

export class Bridge {
  private sender: Window | null;

  private senderOrigin: string = SenderOriginAll;

  private handlerMap = new Map();

  private pendingSend: CMD[] = [];

  //通信双方都准备就绪
  private ready: boolean = false;

  private timer: any = null;

  private retryTime = 0;

  private maxTime: number = 100;

  private handler: any = null;

  constructor(options: BridgeOption = {}) {
    const { sender = null, events = [], senderOrigin } = options;
    this.sender = sender;
    if (senderOrigin) {
      this.senderOrigin = senderOrigin;
    }
    this.init(events);

    Logger.info('init bridge', window.location.href);
  }

  private onReady() {
    if (this.pendingSend.length > 0) {
      this.pendingSend.forEach((cmd) => {
        const callback = cmd.callback || undefined;

        delete cmd.callback;
        this.send(cmd, callback);
      });
      this.pendingSend = [];
    }

    Logger.info('ready', location.href);
  }

  private shakeHandValid(type: string, event: MessageEvent) {
    if (type === CommandType.InitSenderType) {
      Logger.info('init sender handler,,,');
      if (!this.sender) this.sender = event.source as WindowProxy;
      this.innerSend({ type: CommandType.InitSenderReadyType });
      this.ready = true;
      this.onReady();
    }

    if (type === CommandType.InitSenderReadyType) {
      Logger.info('init sender ready,,,', location.href);
      clearInterval(this.timer);
      this.timer = null;
      this.ready = true;
      this.onReady();
    }
  }

  private getHandlerList(type: string) {
    return this.handlerMap.get(type);
  }

  private startListen() {
    const handler = (event: MessageEvent) => {
      try {
        const data: CMD = event.data;

        if (data.target !== GaasTarget) return;

        const d = data?.data;

        if (!d) return;

        Logger.info('from origin:', event.origin, 'data:', data);
        //握手信息监测
        this.shakeHandValid(data.type, event);

        const cb = data?.cb;

        const handlerList = this.getHandlerList(data.type);

        if (Array.isArray(handlerList) && handlerList.length) {
          handlerList.forEach(async (handler) => {
            const d = await handler(data.data);

            if (cb) {
              this.send({
                type: cb,
                data: d,
              });
            }
          });
        }
      } catch (e) {
        Logger.info(e);
      }
    };

    this.handler = handler;
    //监听消息
    window.addEventListener('message', handler);
  }

  private init(events: BridgeEvent[]) {
    if (Array.isArray(events) && events.length > 0) {
      events.forEach((event) => {
        const { name, handler } = event;
        if (name && typeof handler === 'function') {
          this.on(name, handler);
        }
      });
    }

    this.startListen();
    // 如果有固定的通信对端 发起握手 通知对方身份
    if (this.senderOrigin !== SenderOriginAll) this.shakeHand();
  }

  private transferData(d: any) {
    const o = Object(d);
    const keys = Object.keys(o);
    keys.forEach((key) => {
      const value = o[key];
      if (typeof value === 'function') {
        console.warn('Gaas Bridge can not send data that  include  function attr!');
        delete o[key];
      }
    });

    return o;
  }

  private innerSend(cmd: CMD, callback?: Handler) {
    const d = this.transferData(cmd.data);

    cmd.data = d;

    cmd.target = GaasTarget;

    if (this.sender) {
      if (callback) {
        const id = `${cmd.type}-${Date.now()}-${CommandType.CALLBACK}`;
        cmd.cb = id;
        this.on(id, callback);
      }
      this.sender.postMessage(cmd, '*');
    }
  }

  private removeListen() {
    window.removeEventListener('message', this.handler);
  }

  // 握手 建立通信
  private shakeHand() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      if (this.retryTime > this.maxTime) {
        clearInterval(this.timer);
      }
      this.retryTime = this.retryTime + 1;
      this.innerSend({
        type: CommandType.InitSenderType,
      });
      Logger.info('init sender,,,', location.href);
    }, 100);
  }

  destroy() {
    this.removeListen();
  }

  removeAll() {
    this.handlerMap = new Map();
  }

  setSender(sender: Window) {
    this.sender = sender;
    this.shakeHand();
  }

  remove(type: string, handler: Handler) {
    if (!handler) {
      //remove type all
      this.handlerMap.set(type, []);
      return;
    }
    const old = this.handlerMap.get(type);

    if (!old || !Array.isArray(old)) return;

    const index = old.indexOf(handler);

    if (index > -1) {
      old.splice(index, 1);
    }
  }

  on(type: string, handler: Handler) {
    const old = this.handlerMap.get(type);
    if (!old) {
      this.handlerMap.set(type, [handler]);
    } else {
      const index = old.indexOf(handler);
      if (index > -1) {
        console.error('Try to add same handler');
        return;
      }
      old.push(handler);
    }
  }

  send(cmd: Command, callback?: Handler) {
    if (!this.ready) {
      this.pendingSend.push({ ...cmd, callback });
      return;
    }
    this.innerSend(cmd, callback);
  }
}
