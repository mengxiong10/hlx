import { getWxInfo } from './api/auth';

export async function initWxConfig() {
  const url = window.location.href.split('#')[0];

  const info = await getWxInfo(url);

  const { appId, timestamp, noncestr, signature, inviteCode } = info;

  const link = `${url}?inviteCode=${inviteCode}`;

  wx.config({
    appId,
    signature,
    nonceStr: noncestr,
    timestamp: +timestamp,
    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
  });

  wx.error((err: any) => {
    console.error('[wx] config error:', err);
  });

  wx.ready(() => {
    wx.checkJsApi({
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
      success(res: any) {
        console.log('[wx] checkJsApi:', res);
      },
      fail(err: any) {
        console.error('[wx] checkJsApi fail:', err);
      },
    });

    const imgUrl = (info.imgUrl || '').replace(/^http:/, 'https:');

    wx.updateAppMessageShareData({
      link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      title: info.title || '慧来学', // 分享标题
      desc: info.des || '慧来学描述', // 分享描述
      imgUrl, // 分享图标
      success(res: any) {
        console.log('[wx] updateAppMessageShareData success:', res);
      },

      fail(err: any) {
        console.error('[wx] updateAppMessageShareData fail:', err);
      },

      complete(res: any) {
        console.log('[wx] updateAppMessageShareData complete:', res);
      },
    });

    wx.updateTimelineShareData({
      link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      title: info.title || '慧来学', // 分享标题
      imgUrl, // 分享图标
    });
  });
}
