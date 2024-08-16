# gaas-js-sdk

[![NPM version](https://img.shields.io/npm/v/gaas-js-sdk.svg?style=flat)](https://npmjs.org/package/gaas-js-sdk)
[![NPM downloads](http://img.shields.io/npm/dm/gaas-js-sdk.svg?style=flat)](https://npmjs.org/package/gaas-js-sdk)

## Introduction

This is a javascript SDK for gaas platform.

## Install

npm i gaas-js-sdk

## Usage

```js
import { GaasJsSdk } from 'gaas-js-sdk';

const gaasJsSdk = new GaasJsSdk({
  clientAppId: 'your app id',
});

// use gaas login
gaasJsSdk.login({
  onLoginSuccess: (r) => {
    const { code, data } = r;
    if (code === '000000') {
      const code = data.n;
      // todo : use code to get userInfo from your server
    }
  },
});
```

## API

1. const gaasJsSdk = new GaasJsSdk(options:GaasOptions)

```js
enum LoginMethods {
  google = 'Google',
  metamask = 'MetaMask',
  okx = 'OKx',
}

interface GaasOptions {
  clientAppId: string;
  gameName?: string;
  loginMethods?: Array<LoginMethods>;
  locale?: string;
  isNeedBindWallet?: boolean;
}
```

2. gaasJsSdk.login(params: LoginParams)

```js
interface LoginParams {
  hasClose?: boolean;
  channel?: string;
  inviteCode?: string;
  hasGuest?: boolean;
  onLoginSuccess?: (params: SuccessProps) => void;
}

interface SuccessProps {
  success: boolean;
  n?: string;
  nickName?: string;
  loginSymbol?: string;
  isRegister?: boolean;
  type?: string;
}
```

3. gaasJsSdk.wallet(params: WalletProps)

```js
interface WalletProps {
  hasWallet: boolean;
  userNumber?: string;
  tabKey?: string;
  onLoginSuccess?: (params: SuccessProps) => void;
}
```

4. gaasJsSdk.market(params: MarketProps)

```js
interface MarketProps {
  hasWallet: boolean;
  userNumber?: string;
  tabKey?: string;
  batchListing?: { assetId: number, assetTokenId: string }[];
  assetId?: number;
  assetType?: string;
  categoryName?: string;
  onLoginSuccess?: (params: SuccessProps) => void;
}
```

5. gaasJsSdk.pay(params: PayProps)

```js
interface PayProps {
  hasWallet: boolean;
  userNumber?: string;
  orderNumber: string;
  onPaySuccess?: () => void;
  onLoginSuccess?: (params: SuccessProps) => void;
}
```

6. gaasJsSdk.transfer(params: TransferType)

```js
interface TransferType {
  hasWallet: boolean;
  userNumber?: string;
  onTransferSuccess?: (res: { success: boolean, error?: string }) => void;
  onLoginSuccess?: (params: SuccessProps) => void;
  assetChainId: number;
  assetId?: number;
  assetTokenId?: string;
}
```

## LICENSE

MIT
