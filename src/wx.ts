import { getWxInfo } from './api/auth';

export async function initWxConfig() {
  const url = window.location.origin + window.location.pathname;

  const info = await getWxInfo(url);

  wx.config({
    ...info,
    debug: true,
    jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'],
  });

  wx.ready(() => {
    wx.updateAppMessageShareData({
      link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      title: info.title || '慧来学', // 分享标题
      desc: info.desc || '慧来学描述', // 分享描述
      imgUrl: info.imgUrl || '', // 分享图标
    });

    wx.updateTimelineShareData({
      link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      title: info.title || '慧来学', // 分享标题
      imgUrl: info.imgUrl || '', // 分享图标
    });
  });
}
