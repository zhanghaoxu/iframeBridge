export enum LoginMethods {
  Google = 'Google',
  Metamask = 'MetaMask',
  OKx = 'OKx',
  Apple = 'Apple',
  Facebook = 'Facebook',
  MG = 'MG',
}

export enum LoginType {
  MG = 'MG',
  Channel = 'CHANNEL',
}

export interface GaasOptions {
  clientAppId: string;
  gameName?: string;
  /**
   * LoginType.MG
   * 
   * SupportLoginMethods = ['MetaMask', 'Google', 'OKx']
   *
   * LoginType.CHANNEL
   *
   * SupportLoginMethods = ['Apple', 'Facebook', 'Google', 'MG'];
   */
  loginMethods?: Array<LoginMethods>;
  locale?: string;
  isNeedBindWallet?: boolean;
  loginType?: LoginType;
  hasGuest?: boolean;
}
