import Taro from "@tarojs/taro";

const storageUrl = "http://192.168.107.232:8232/qasoda/";
// const storageUrl = 'http://124.193.98.179:8232/qasoda/';
// const serverUrl = "http://ai.cnki.net/dn.qa.api";
const serverUrl = "http://192.168.100.75/dn.qa.api";
const sgServerUrl = "http://ai.cnki.net/wx.qa.api";
const weatherUrl = "https://free-api.heweather.com/s6/weather";
const httpRequest = function (
  url,
  method,
  data = "",
  sg = false,
  storage = false,
  weather = false,
  collect = false
) {
  const newUrl = sg
    ? sgServerUrl
    : storage
      ? storageUrl
      : weather
        ? weatherUrl
        : serverUrl;
  if (data === "") {
    return new Promise(function (resolve, reject) {
      Taro.request({
        url: newUrl + url,
        method: method,
        header: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      })
        .then(responseData => {
          // console.log('res:',url,responseData);  //网络请求成功返回的数据
          resolve(responseData.data);
        })
        .catch(err => {
          console.log("err:", url, err); //网络请求失败返回的数据
          reject(err);
        });
    });
  } else {
    return new Promise(function (resolve, reject) {
      Taro.request({
        url: newUrl + url,
        method: method,
        data: data,
        header: {
          "content-type": "application/json"
        }
      })
        .then(responseData => {
          // console.log('res:',url,responseData);  //网络请求成功返回的数据
          resolve(responseData.data);
        })
        .catch(err => {
          console.log("err:", url, err); //网络请求失败返回的数据
          reject(err);
        });
    });
  }
};

const httpRequest_a = function (common_url, url, method, params = '') {
  let newUrl = common_url + url
  let opt = {
    url: newUrl,
    method: method,
    header: {
      'content-type': 'application/json',
      token: Taro.getStorageSync('token')
    }
  }
  if (params && method !== 'POST') {
    //如果网络请求参数
    let paramsArray = [];
    //拼接参数
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
    if (newUrl.search(/\?/) === -1) {
      newUrl += '?' + paramsArray.join('&');
    } else {
      newUrl += '&' + paramsArray.join('&');
    }
    opt = Object.assign(opt, { url: newUrl })
  } else {
    opt = Object.assign(opt, { data: JSON.stringify(params) });
  }
  return new Promise(function (resolve, reject) {
    Taro.request(opt)
      .then(responseData => {
        resolve(responseData.data)//网络请求成功返回的数据
      })
      .catch(err => {
        reject(err)//网络请求失败返回的数据
      })
  })
}

const getInputTips = (value) => {
  return new Promise(function (reslove, reject) {
    fetch(
      `http://192.168.100.75/dn.qa.sug/su.ashx?action=getsmarttips&p=0.9044369541594852&kw=${
      value
      }&td=1560427140234&tdsourcetag=s_pcqq_aiomsg`,
    )
      .then(function (response) {
        return response.text();
      })
      .then(function (myJson) {
        const tipsData = JSON.parse(myJson.replace(/var oJson = /g, '')).results;
        reslove(tipsData);
      })
      .catch(err => {
        console.log('err:', err); //网络请求失败返回的数据
        reject(err);
      });
  })
}

const lineFeed = str => {
  return "<p>" + str.replace(/\n/g, "</p><p>") + "</p>";
};

const translteToRed = str => {
  return str
    .replace(/###/g, '<span style="color:red">')
    .replace(/\$\$\$/g, "</span>");
};

const removeRed = str => {
  return str.replace(/###/g, "").replace(/\$\$\$/g, "");
};

const fixImgSrc = str => {
  return str
    .replace(/src="/g, 'src="http://refbook.img.cnki.net')
    .replace(/src='/g, "src='http://refbook.img.cnki.net");
};

const unifyFontColor = str => {
  return str
    .replace(/color="#(\w*)"/g, 'color="#a3a3a3"')
    .replace(/color='#(\w*)'/g, "color='#a3a3a3'");
};

const getSignatureFromServer = url => {
  Taro.request({
    url: "http://qa2.cnki.net/QA-wx/getSignature",
    // url: "http://192.168.27.79:8081/getSignature",
    data: {
      url: url
    },
    method: "GET"
  })
    .then(res => {
      window.wxObject = res.data;
      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.data.APP_ID, // 必填，公众号的唯一标识
        timestamp: res.data.TIMESTAMP, // 必填，生成签名的时间戳
        nonceStr: res.data.NONCE, // 必填，生成签名的随机串
        signature: res.data.SIGNATURE, // 必填，签名
        jsApiList: [
          "startRecord",
          "stopRecord",
          "onVoiceRecordEnd",
          "translateVoice"
        ] // 必填，需要使用的JS接口列表
      });
    })
    .catch(err => {
      console.log(err);
    });
};

const completeUrl = str => {
  return str
    .replace(/\n/g, "<br/>")
    .replace(/<img src="/g, '<img src="http://qa2.cnki.net/seu/')
    .replace(/<img src='/g, "<img src='http://qa2.cnki.net/seu/")
    // .replace(
    //   /<a href="AnswerImage/g,
    //   '<a href="http://qa2.cnki.net/seu/AnswerImage'
    // )
    .replace(
      /<a href="AnswerImage/g,
      '<a href="http://192.168.100.75/seu/AnswerImage'
    )
    ;
};

const defaultUrl =
  "https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=c4d23f3dc08065387beaa315afe6c679/d01373f082025aaff3cec4b8f1edab64024f1ac0.jpg";

const sourceDb = {
  博士: "CDFD",
  硕士: "CMFD",
  期刊: "CJFD"
};

const webViewUrl = {
  journal: "http://wap.cnki.net/touch/web/Journal/Article/",
  dissertation: "http://wap.cnki.net/touch/web/Dissertation/Article/",
  defaultUrl: "http://kns.cnki.net/KCMS/detail/detail.aspx"
};

const addAtag = (url, str) => {
  return `<a href=${url} target="_blank">${str}</a>`;
};

const signaltureUrl = "http://qa2.cnki.net/QA-wx/getSignature";

const GetNewGuid = () => {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16).toString(16);
    guid += n;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      guid += "-";
    }
  }
  return guid;
};

const GetGUID = () => {
  var key = getCookie("guid");
  if (key === "") {
    key = GetNewGuid();
    setCookie("guid", key, 3650);
  }
  return getCookie("guid");
};

const setCookie = function (cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  window.document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

const getCookie = function (cname) {
  var name = cname + "=";
  var ca = window.document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
export default {
  serverUrl,
  completeUrl,
  httpRequest,
  httpRequest_a,
  translteToRed,
  removeRed,
  defaultUrl,
  sourceDb,
  webViewUrl,
  addAtag,
  signaltureUrl,
  fixImgSrc,
  unifyFontColor,
  lineFeed,
  getSignatureFromServer,
  GetGUID,
  getInputTips
};
