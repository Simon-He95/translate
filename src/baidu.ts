import axios from 'axios'
import type { BaiduOptions } from './types'
const md5 = require('md5')

function getTranslate(text: string, options: BaiduOptions = {}) {
  const q = text
  const { from = 'en', to = 'zh', salt = Math.random() * 10000, secret, appid } = options
  if (!secret || !appid)
    throw new Error('secret和appid不能为空，请申请百度翻译apk，http://api.fanyi.baidu.com/manage/developer')

  const sign = md5(appid + q + salt + secret)
  return new Promise((resolve, reject) => {
    axios.get(`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${text}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`)
      .then(({ data: { error_code, error_msg, trans_result } }) => {
        if (error_code)
          return reject({ code: error_code, msg: error_msg })
        resolve(trans_result[0].dst)
      }).catch(reject)
  })
}
export default getTranslate
