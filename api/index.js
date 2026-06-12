// B站 API Proxy for DD Music - Vercel Serverless Function
// Uses Vercel/AWS IPs which are not blocked by B站

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const BI_APPKEY = '1d8b6e7d45233936';
const BI_APPSEC = 'b5eb9084928aa2c0ac4e3bb4b0e8a926';

// MD5 for app signing
function md5(str) {
  function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
  function cmn(q, a, b, x, s, t) { return add32(add32(add32(a, q), add32(x, t)), s); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function cycle(x, k) {
    var a=x[0],b=x[1],c=x[2],d=x[3];
    a=ff(a,b,c,d,k[0],7,-680876936);d=ff(d,a,b,c,k[1],12,-389564586);c=ff(c,d,a,b,k[2],17,606105819);b=ff(b,c,d,a,k[3],22,-1044525330);
    a=ff(a,b,c,d,k[4],7,-176418897);d=ff(d,a,b,c,k[5],12,1200080426);c=ff(c,d,a,b,k[6],17,-1473231341);b=ff(b,c,d,a,k[7],22,-45705983);
    a=ff(a,b,c,d,k[8],7,1732584194);d=ff(d,a,b,c,k[9],12,-1926607734);c=ff(c,d,a,b,k[10],17,-378558);b=ff(b,c,d,a,k[11],22,-2022584463);
    a=ff(a,b,c,d,k[12],7,1839030562);d=ff(d,a,b,c,k[13],12,-35309556);c=ff(c,d,a,b,k[14],17,-1530992060);b=ff(b,c,d,a,k[15],22,1272893353);
    a=gg(a,b,c,d,k[1],5,-165796510);d=gg(d,a,b,c,k[6],9,-1069501632);c=gg(c,d,a,b,k[11],14,643717713);b=gg(b,c,d,a,k[0],20,-373897302);
    a=gg(a,b,c,d,k[5],5,-701558691);d=gg(d,a,b,c,k[10],9,38016083);c=gg(c,d,a,b,k[15],14,-660478335);b=gg(b,c,d,a,k[4],20,-405537848);
    a=gg(a,b,c,d,k[9],5,568446438);d=gg(d,a,b,c,k[14],9,-1019803690);c=gg(c,d,a,b,k[3],14,-187363961);b=gg(b,c,d,a,k[8],20,1163531501);
    a=gg(a,b,c,d,k[13],5,-1444681467);d=gg(d,a,b,c,k[2],9,-51403784);c=gg(c,d,a,b,k[7],14,1735328473);b=gg(b,c,d,a,k[12],20,-1926607734);
    a=hh(a,b,c,d,k[5],4,-378558);d=hh(d,a,b,c,k[8],11,-2022584463);c=hh(c,d,a,b,k[11],16,1839030562);b=hh(b,c,d,a,k[14],23,-35309556);
    a=hh(a,b,c,d,k[1],4,-1530992060);d=hh(d,a,b,c,k[4],11,1272893353);c=hh(c,d,a,b,k[7],16,-155497632);b=hh(b,c,d,a,k[10],23,-1094730640);
    a=hh(a,b,c,d,k[13],4,681279174);d=hh(d,a,b,c,k[0],11,-358537222);c=hh(c,d,a,b,k[3],16,-722521979);b=hh(b,c,d,a,k[6],23,76029189);
    a=hh(a,b,c,d,k[9],4,-640364487);d=hh(d,a,b,c,k[12],11,-421815835);c=hh(c,d,a,b,k[15],16,530742520);b=hh(b,c,d,a,k[2],23,-995338651);
    a=ii(a,b,c,d,k[0],6,-198630844);d=ii(d,a,b,c,k[7],10,1126891415);c=ii(c,d,a,b,k[14],15,-1416354905);b=ii(b,c,d,a,k[5],21,-57434055);
    a=ii(a,b,c,d,k[12],6,1700485571);d=ii(d,a,b,c,k[3],10,-1894986606);c=ii(c,d,a,b,k[10],15,-1051523);b=ii(b,c,d,a,k[1],21,-2054922799);
    a=ii(a,b,c,d,k[8],6,1873313359);d=ii(d,a,b,c,k[15],10,-30611744);c=ii(c,d,a,b,k[6],15,-1560194385);b=ii(b,c,d,a,k[13],21,1309151649);
    a=ii(a,b,c,d,k[4],6,-145523070);d=ii(d,a,b,c,k[11],10,-1120210379);c=ii(c,d,a,b,k[2],15,718787259);b=ii(b,c,d,a,k[9],21,-343485551);
    x[0]=add32(a,x[0]);x[1]=add32(b,x[1]);x[2]=add32(c,x[2]);x[3]=add32(d,x[3]);
  }
  function blk(s){var b=[],i;for(i=0;i<64;i+=4)b[i>>2]=s.charCodeAt(i)+(s.charCodeAt(i+1)<<8)+(s.charCodeAt(i+2)<<16)+(s.charCodeAt(i+3)<<24);return b;}
  var n=str.length,st=[1732584193,-271733879,-1732584194,271733878],i;
  for(i=64;i<=n;i+=64)cycle(st,blk(str.substring(i-64,i)));
  str=str.substring(i-64);var tl=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for(i=0;i<str.length;i++)tl[i>>2]|=str.charCodeAt(i)<<(i%4<<3);
  tl[i>>2]|=0x80<<(i%4<<3);if(i>55){cycle(st,tl);for(i=0;i<16;i++)tl[i]=0;}
  tl[14]=n*8;cycle(st,tl);
  return('0000000'+(st[0]>>>0).toString(16)).slice(-8)+('0000000'+(st[1]>>>0).toString(16)).slice(-8)+('0000000'+(st[2]>>>0).toString(16)).slice(-8)+('0000000'+(st[3]>>>0).toString(16)).slice(-8);
}

function biAppSign(params) {
  const ts = String(Math.floor(Date.now() / 1000));
  const all = { ...params, appkey: BI_APPKEY, build: '6400000', mobi_app: 'android', platform: 'android', ts };
  const sorted = Object.keys(all).sort().map(k => k + '=' + all[k]).join('');
  all.sign = md5(sorted + BI_APPSEC);
  return all;
}

async function proxyGet(url, referer, extraHeaders) {
  const h = { 'User-Agent': UA, 'Accept': 'application/json, */*', 'Accept-Encoding': 'gzip, deflate' };
  if (referer) h['Referer'] = referer;
  if (extraHeaders) Object.assign(h, extraHeaders);
  const r = await fetch(url, { headers: h, redirect: 'follow' });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { _proxy_error: true, status: r.status, body: t.slice(0, 500) }; }
}

async function biAppGet(path, params) {
  const signed = biAppSign(params);
  const qs = Object.keys(signed).map(k => k + '=' + encodeURIComponent(signed[k])).join('&');
  return proxyGet('https://app.bilibili.com' + path + '?' + qs, 'https://www.bilibili.com/');
}

// Wbi signing
const WBI_MIXIN_TAB = [46,47,18,2,53,8,23,32,15,50,10,31,58,3,45,35,27,43,5,49,33,9,42,19,29,28,14,39,12,38,41,13,37,48,7,16,24,55,40,61,26,17,0,1,60,51,30,4,22,25,54,21,56,59,6,63,57,62,11,36,20,34,44,52];
let _wbiKeys = null, _wbiTs = 0;
async function biWbiKeys() {
  if (_wbiKeys && Date.now() - _wbiTs < 600000) return _wbiKeys;
  const d = await proxyGet('https://api.bilibili.com/x/web-interface/nav', 'https://www.bilibili.com/');
  if (d._proxy_error || !d.data?.wbi_img) return null;
  const { img_url, sub_url } = d.data.wbi_img;
  const imgKey = img_url.split('/').pop().split('.')[0];
  const subKey = sub_url.split('/').pop().split('.')[0];
  const mixin = WBI_MIXIN_TAB.reduce((s, i) => s + (imgKey + subKey).charAt(i), '').slice(0, 32);
  _wbiKeys = mixin; _wbiTs = Date.now();
  return mixin;
}

async function biWbiGet(baseUrl, params) {
  const mixinKey = await biWbiKeys();
  if (!mixinKey) return { _proxy_error: true, _wbi_failed: true };
  const wts = Math.floor(Date.now() / 1000);
  const all = { ...params, wts };
  const chrFilter = /[!'()*]/g;
  const qs = Object.keys(all).sort().map(k => encodeURIComponent(k) + '=' + encodeURIComponent(String(all[k]).replace(chrFilter, ''))).join('&');
  const wRid = md5(qs + mixinKey);
  return proxyGet(baseUrl + '?' + qs + '&w_rid=' + wRid, 'https://www.bilibili.com/');
}

function parseDur(s) { const p = (s || '').split(':'); return p.length === 2 ? parseInt(p[0]) * 60 + parseInt(p[1]) : (p.length === 3 ? parseInt(p[0]) * 3600 + parseInt(p[1]) * 60 + parseInt(p[2]) : 0); }

// ── API Handler ──
async function handleAPI(url) {
  const a = url.searchParams.get('action');
  const kw = url.searchParams.get('keyword');
  const pg = parseInt(url.searchParams.get('page') || '1');
  const bvid = url.searchParams.get('bvid');
  const cid = url.searchParams.get('cid');
  const sid = url.searchParams.get('sid');
  const ck = url.searchParams.get('cookie') || '';

  switch (a) {
    case 'search': {
      const appResult = await biAppGet('/x/v2/search', { keyword: kw || '', pn: pg, ps: 20, search_type: 'video' });
      if (!appResult._proxy_error && appResult.code === 0) {
        const items = appResult.data?.item || [];
        const videos = items.filter(x => x.goto === 'av' && x.param);
        if (videos.length > 0) {
          return {
            result: videos.map(x => ({
              id: 'bitrack_v_' + x.param, title: (x.title || '').replace(/<[^>]+>/g, ''),
              artist: x.author || '', source: 'bilibili',
              source_url: 'https://www.bilibili.com/' + x.param,
              img_url: (x.cover || '').startsWith('//') ? 'https:' + x.cover : (x.cover || ''),
              duration: parseDur(x.duration),
            })),
            total: appResult.data?.page?.numResults || videos.length,
          };
        }
      }
      const wbiResult = await biWbiGet('https://api.bilibili.com/x/web-interface/wbi/search/type', { keyword: kw, page: pg, page_size: 20, search_type: 'video' });
      if (!wbiResult._proxy_error && wbiResult.code === 0 && wbiResult.data?.result) {
        return {
          result: wbiResult.data.result.map(x => ({
            id: 'bitrack_v_' + x.bvid, title: (x.title || '').replace(/<em class="keyword">|<\/em>/g, ''),
            artist: x.author || '', source: 'bilibili',
            source_url: 'https://www.bilibili.com/' + x.bvid,
            img_url: (x.pic || '').startsWith('//') ? 'https:' + x.pic : (x.pic || ''),
            duration: parseDur(x.duration),
          })),
          total: wbiResult.data.numResults || 0,
        };
      }
      const headers = ck ? { 'Cookie': ck } : {};
      const d = await proxyGet('https://api.bilibili.com/x/web-interface/search/type?__refresh__=true&page=' + pg + '&page_size=20&platform=pc&highlight=1&keyword=' + encodeURIComponent(kw) + '&search_type=video', 'https://www.bilibili.com/', { ...headers, 'Origin': 'https://www.bilibili.com' });
      if (!d._proxy_error && d.data?.result) {
        return {
          result: d.data.result.map(x => ({
            id: 'bitrack_v_' + x.bvid, title: (x.title || '').replace(/<em class="keyword">|<\/em>/g, ''),
            artist: x.author || '', source: 'bilibili',
            source_url: 'https://www.bilibili.com/' + x.bvid,
            img_url: (x.pic || '').startsWith('//') ? 'https:' + x.pic : (x.pic || ''),
            duration: parseDur(x.duration),
          })),
          total: d.data?.numResults || 0,
        };
      }
      return { result: [], total: 0 };
    }

    case 'view': {
      const appInfo = await biAppGet('/x/v2/view', { bvid: bvid || '' });
      if (!appInfo._proxy_error && appInfo.code === 0 && appInfo.data) {
        const pages = appInfo.data.pages || [];
        return {
          title: appInfo.data.title || '', pic: appInfo.data.pic || '',
          owner: appInfo.data.owner?.name || '',
          pages: pages.map(p => ({ cid: p.cid, page: p.page, part: p.part || '', duration: p.duration || 0 })),
        };
      }
      const info = await proxyGet('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid, 'https://www.bilibili.com/');
      if (!info._proxy_error && info.data) {
        const pages = info.data.pages || [];
        return {
          title: info.data.title || '', pic: info.data.pic || '',
          owner: info.data.owner?.name || '',
          pages: pages.map(p => ({ cid: p.cid, page: p.page, part: p.part || '', duration: p.duration || 0 })),
        };
      }
      return { error: 'failed to get video info' };
    }

    case 'playurl': {
      const avid = url.searchParams.get('avid') || '';
      const appPlay = await biAppGet('/x/v2/playurl', { avid: avid, bvid: bvid || '', cid: cid || '', qn: '64', fnval: '16', fourk: '1' });
      if (!appPlay._proxy_error && appPlay.code === 0) {
        if (appPlay.data?.dash?.audio?.[0]?.baseUrl) return { url: appPlay.data.dash.audio[0].baseUrl, type: 'dash' };
        if (appPlay.data?.durl?.[0]?.url) return { url: appPlay.data.durl[0].url, type: 'durl' };
      }
      const ck2 = url.searchParams.get('cookie') || '';
      const hdr = ck2 ? { 'Cookie': ck2 } : {};
      const d = await proxyGet('https://api.bilibili.com/x/player/playurl?fnval=16&bvid=' + bvid + '&cid=' + cid, 'https://www.bilibili.com/', hdr);
      if (!d._proxy_error && d.data?.dash?.audio?.[0]?.baseUrl) return { url: d.data.dash.audio[0].baseUrl, type: 'dash' };
      const d2 = await proxyGet('https://api.bilibili.com/x/player/playurl?fnval=0&bvid=' + bvid + '&cid=' + cid, 'https://www.bilibili.com/', hdr);
      if (!d2._proxy_error && d2.data?.durl?.[0]?.url) return { url: d2.data.durl[0].url, type: 'durl' };
      return { error: 'failed to get playback url' };
    }

    case 'audio_url': {
      const d = await proxyGet('https://www.bilibili.com/audio/music-service-c/web/url?sid=' + sid, 'https://www.bilibili.com/');
      if (!d._proxy_error && d.data?.cdns?.[0]) {
        let u = d.data.cdns[0]; if (u.startsWith('//')) u = 'https:' + u; return { url: u };
      }
      const d2 = await proxyGet('https://api.bilibili.com/audio/music-service-c/web/url?sid=' + sid, 'https://www.bilibili.com/');
      if (!d2._proxy_error && d2.data?.cdns?.[0]) {
        let u = d2.data.cdns[0]; if (u.startsWith('//')) u = 'https:' + u; return { url: u };
      }
      return { error: 'failed to get audio url' };
    }

    case 'chart': {
      const audioChart = await proxyGet('https://www.bilibili.com/audio/music-service-c/web/menu/hit?ps=20&pn=1', 'https://www.bilibili.com/');
      if (!audioChart._proxy_error && audioChart.code === 0 && audioChart.data?.data?.length) {
        return audioChart.data.data.map(item => ({
          id: 'biplaylist_' + item.menuId, title: item.title,
          cover_img_url: item.cover || '', source: 'bilibili',
          source_url: 'https://www.bilibili.com/audio/am' + item.menuId,
        }));
      }
      return [];
    }

    case 'playlist_tracks': {
      const listId = url.searchParams.get('listId') || '';
      if (listId.startsWith('biplaylist_')) {
        const sid2 = listId.replace('biplaylist_', '');
        const d = await proxyGet('https://www.bilibili.com/audio/music-service-c/web/song/of-menu?pn=1&ps=100&sid=' + sid2, 'https://www.bilibili.com/');
        if (!d._proxy_error && d.data?.data?.length) {
          const tracks = d.data.data.map(s => ({
            id: 'bitrack_' + s.id, title: s.title || '',
            artist: s.upName || s.author || '', source: 'bilibili',
            source_url: 'https://www.bilibili.com/audio/au' + s.id,
            img_url: s.cover || '', duration: parseInt(s.duration || 0),
          }));
          return { tracks, total: d.data?.totalSize || tracks.length };
        }
      }
      if (listId.startsWith('bipop_')) {
        const bvid2 = listId.replace('bipop_', '');
        const appInfo = await biAppGet('/x/v2/view', { bvid: bvid2 });
        if (!appInfo._proxy_error && appInfo.code === 0 && appInfo.data?.pages) {
          const pages = appInfo.data.pages;
          return {
            tracks: pages.map(p => ({
              id: 'bitrack_v_' + bvid2 + '-' + p.cid, title: p.part || appInfo.data.title || '',
              artist: appInfo.data.owner?.name || '', source: 'bilibili',
              source_url: 'https://www.bilibili.com/' + bvid2 + '?p=' + p.page,
              img_url: (appInfo.data.pic || '').startsWith('//') ? 'https:' + appInfo.data.pic : (appInfo.data.pic || ''),
              duration: parseInt(p.duration || 0),
            })),
            total: pages.length,
          };
        }
        const info = await proxyGet('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid2, 'https://www.bilibili.com/');
        if (!info._proxy_error && info.data?.pages) {
          return {
            tracks: info.data.pages.map(p => ({
              id: 'bitrack_v_' + bvid2 + '-' + p.cid, title: p.part || info.data.title || '',
              artist: info.data.owner?.name || '', source: 'bilibili',
              source_url: 'https://www.bilibili.com/' + bvid2 + '?p=' + p.page,
              img_url: (info.data.pic || '').startsWith('//') ? 'https:' + info.data.pic : (info.data.pic || ''),
              duration: parseInt(p.duration || 0),
            })),
            total: info.data.pages.length,
          };
        }
      }
      return { tracks: [], total: 0 };
    }

    case 'ping':
      return { ok: true, time: Date.now(), from: 'vercel-proxy' };

    default:
      return { error: 'unknown action: ' + a };
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, 'https://' + (req.headers.host || 'localhost'));
  const result = await handleAPI(url);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.status(200).json(result);
}
