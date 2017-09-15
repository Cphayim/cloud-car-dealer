declare namespace wx {
  // 存储
  export function getStorageSync(key: string): any;
  export function setStorageSync(key: string, data: any): void;
  export function removeStorageSync(key: string): void;
  export function clearStorageSync(): void;


  export function login(args: any): void;
  export function getApp(): any;

  export function getSystemInfoSync(): any;
  export function getUserInfo(args: any): void;

  // 导航
  export function navigateTo(args: { url: string, success?: (res) => void, fail?: (err) => void }): void;
  export function redirectTo(args: { url: string, success?: (res) => void, fail?: (err) => void }): void;
  export function switchTab(args: { url: string, success?: (res) => void, fail?: (err) => void }): void;
  export function reLaunch(args: { url: string, success?: (res) => void, fail?: (err) => void }): void;
  export function navigateBack(args?: { delta?: number }): void;

  // http 请求
  export function request(args: Object): void;

  // 弹框相关
  export function showToast(args: Object): void;
  export function hideToast(): void;
  export function showLoading(args: Object): void;

  export function showModal(args: Object): void;

  export function showActionSheet(args: {
    itemList?: string[],
    itemColor?: string,
    success?: any,
    fail?: any
  }): void;

  // 下拉刷新 
  export function stopPullDownRefresh(): void;

  // 元素
  export function createSelectorQuery(): any;

  export function setNavigationBarTitle(opt: { title: string }): void;

  // 调用系统
  export function makePhoneCall(arg: { phoneNumber: string }): void;
  export function scanCode(arg: any): void;

  // 窗口相关
  export function pageScrollTo(opts: { scrollTop: number }): void;

  // 图片


  // 录音
  export function startRecord(opts: { success?: any, fail?: any, complete?: any }): void;
  export function stopRecord(): void;

  // 播放音频
  export function playVoice(opts: { filePath: string, success?: any, fail?: any, complete?: any }): void;
  export function pauseVoice(): void;
  export function stopVoice(): void;

  // 上传下载
  export function uploadFile(opts: { url: string, filePath: string, name: string, header?: any, formData?: any, success?: any, fail?: any, complete?: any }): TransmissionTask;
  export function downloadFile(opts: { url: string, header?: any, formData?: any, success?: any, fail?: any, complete?: any }): TransmissionTask;

  // 图片
  export function chooseImage(opts: { count?: number, sizeType?: string[], sourceType?: string[], success?: any, fail?: any, complete?: any }): void;
  export function previewImage(opts: { current?: string, urls: string[], success?: any, fail?: any, complete?: any }): void;
}

// 传输类任务返回的接口
declare interface TransmissionTask {
  onProgressUpdate: (e: { progress: number, totalBytesSent: number, totalBytesExpectedToSend: number }) => {}
  abort: () => {}
}


declare interface Application {
  onLaunch(): void,
  globalData: any
}

declare interface Base {
  setData(data: Object, cb?: any): void
}

declare function App(app: Application): void;
declare function Page(page: Base): void;

declare function getApp(): Application;
declare function getCurrentPages(): any[];

declare function require(str: string): any;

declare var global: {
  global: any,
  Object: any,
  clearTimeout: any,
}
