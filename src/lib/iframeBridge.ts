import { Bridge } from './bridge';

import { Command, Handler } from '../types';

const iframeId = '__GaasIframeId__';

const cssPrefix = '__GaasJsSdkCssPrefix__';

class IframeBridge {
  protected url: string;

  protected iframe: HTMLIFrameElement | null = null;

  protected wrapper: HTMLDivElement | null = null;

  protected loader: HTMLDivElement | null = null;

  protected bridge: Bridge | null = null;

  private init() {
    //初始化 iframe
    const iframe = this.createIframe();
    //初始化桥
    this.bridge = new Bridge({});

    iframe.onload = () => {
      if (iframe.contentWindow) {
        this.bridge?.setSender(iframe.contentWindow);
      }

      if (this.wrapper && this.loader) {
        try {
          this.wrapper.removeChild(this.loader);
          this.wrapper.style.background = 'transparent';
        } catch (e) {
          console.log(e);
        }
      }
    };
  }

  private createIframe() {
    const wrapper = document.createElement('div');
    const style = document.createElement('style');
    const loader = document.createElement('div');
    const iframe = document.createElement('iframe');

    loader.className = `${cssPrefix}loader`;
    wrapper.className = `${cssPrefix}wrapper`;
    iframe.className = `${cssPrefix}iframe`;

    style.textContent = `
    .${cssPrefix}wrapper{
      background: rgba(0,0,0,0.5);
      display:flex;
      justify-content: center;
      align-items: center;
      width:100vw;
      height:100vh;
      position:fixed;
      z-index:999999999;
      left:0;
      top:0;
    }

    .${cssPrefix}iframe {
      width:100vw;
      height:100vh;
      position:fixed;
      z-index:999999999;
      left:0;
      top:0;
      border:0;
    }
    
    .${cssPrefix}loader {
      width: 50px;
      padding: 8px;
      aspect-ratio: 1;
      border-radius: 50%;
      background: #a952d2;
      --_m: 
        conic-gradient(#0000 10%,#000),
        linear-gradient(#000 0 0) content-box;
      -webkit-mask: var(--_m);
              mask: var(--_m);
      -webkit-mask-composite: source-out;
              mask-composite: subtract;
      animation: l3 1s infinite linear;
    }
    @keyframes l3 {to{transform: rotate(1turn)}}
    `;

    wrapper.appendChild(style);
    wrapper.appendChild(loader);
    wrapper.appendChild(iframe);

    // style set

    iframe.id = iframeId;
    iframe.src = this.url;
    this.wrapper = wrapper;
    this.loader = loader;
    this.iframe = iframe;

    document.body.appendChild(wrapper);

    return iframe;
  }

  constructor(url: string) {
    this.url = url;
    //初始化iframe 节点
    this.init();
  }

  // 注册事件
  register(type: string, handler: Handler) {
    if (this.bridge) {
      this.bridge.on(type, handler);
    }
  }

  hide() {
    if (!this.wrapper) return;
    this.wrapper.style.display = 'none';
  }

  close() {
    if (!this.wrapper) return;
    this.bridge?.destroy();
    document.body.removeChild(this.wrapper);
  }

  send(cmd: Command, callback?: Handler) {
    if (this.bridge) {
      this.bridge.send(cmd, callback);
    }
  }
}

export default IframeBridge;
