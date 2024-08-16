export interface SuccessProps {
  success: boolean;
  n?: string;
  nickName?: string;
  loginSymbol?: string;
  isRegister?: boolean;
  type?: string;
}

export interface LinkMGAccountResultParams {
  status: boolean;
  channel: string;
  channelUid: string;
  account: string;
  nickName: string;
}

export interface LoginProps {
  hasClose?: boolean;
  channel?: string;
  inviteCode?: string;
  hasGuest?: boolean;
  onLoginSuccess?: (params: SuccessProps) => void;
}

export enum WalletPageTabKey {
  Token = '1',
  Nft = '2',
}

export interface WalletProps {
  hasWallet: boolean;
  userNumber?: string;
  tabKey?: WalletPageTabKey;
  onLoginSuccess?: (params: SuccessProps) => void;
  onLaunchWalletSuccess?: (params: SuccessProps) => void;
  onLinkMGAccountFinish?: (res: LinkMGAccountResultParams) => void;
}

export enum MarketPageTabKey {
  Buy = '0',
  Sell = '1',
}

export interface MarketProps {
  hasWallet: boolean;
  userNumber: string;
  tabKey?: MarketPageTabKey;
  batchListing?: { assetId: number; assetTokenId: string }[];
  assetId?: number;
  assetType?: string;
  categoryName?: string;
  onLoginSuccess?: (params: SuccessProps) => void;
  onLaunchWalletSuccess?: (params: SuccessProps) => void;
  onLinkMGAccountFinish?: (res: LinkMGAccountResultParams) => void;
}

export interface PayProps {
  hasWallet: boolean;
  userNumber?: string;
  orderNumber: string;
  onPaySuccess?: () => void;
  onLoginSuccess?: (params: SuccessProps) => void;
  onLaunchWalletSuccess?: (params: SuccessProps) => void;
  onLinkMGAccountFinish?: (res: LinkMGAccountResultParams) => void;
}

export interface TransferProps {
  /**
   * hasWallet must be true
   */
  hasWallet: true;
  userNumber: string;
  assetChainId?: number;
  assetId?: number;
  assetTokenId?: string;
  onTransferFinish?: (res: { success: boolean; error?: string }) => void;
  onLoginSuccess?: (params: SuccessProps) => void;
  onLaunchWalletSuccess?: (params: SuccessProps) => void;
  onLinkMGAccountFinish?: (res: LinkMGAccountResultParams) => void;
}

export interface VerifyCodeProps {
  userNumber?: string;
  onVerifyCodeSuccess?: () => void;
  onLinkMGAccountFinish?: (res: LinkMGAccountResultParams) => void;
}

export interface StakingProps {
  activityNumber: string;
}

export interface LinkMGAccountProps {
  userNumber?: string;
  onLinkMGAccountFinish?: (res: LinkMGAccountResultParams) => void;
}
