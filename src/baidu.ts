import axios from 'axios'
import type { BaiduOptions } from './types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const md5 = require('md5')

const errCodeMap: any = {
  52000: '成功',
  52001: ' 请求超时 -> 请重试',
  52002: '系统错误 -> 请重试',
  52003: '未授权用户 -> 请检查appid是否正确或者服务是否开通',
  54000: '必填参数为空 -> 请检查是否少传参数',
  54001: '签名错误 -> 请检查您的签名生成方法',
  54003: '访问频率受限 -> 请降低您的调用频率，或进行身份认证后切换为高级版/尊享版',
  54004: '账户余额不足 -> 请前往管理控制台为账户充值',
  54005: '长query请求频繁 -> 请降低长query的发送频率，3s后再试',
  58000: '客户端IP非法 -> 检查个人资料里填写的IP地址是否正确，可前往开发者信息-基本信息修改',
  58001: '译文语言方向不支持 -> 检查译文语言是否在语言列表里',
  58002: '服务当前已关闭 -> 请前往管理控制台开启服务',
  90107: '认证未通过或未生效 -> 请前往我的认证查看认证进度 ',
}
function getTranslate(text: string, options: BaiduOptions = {}) {
  const q = text
  const { from = 'en', to = 'zh', salt = Math.random() * 10000, secret, appid } = options
  if (!secret || !appid)
    throw new Error('secret和appid不能为空，请申请百度翻译apk，http://api.fanyi.baidu.com/manage/developer')

  const sign = md5(appid + q + salt + secret)
  return new Promise((resolve, reject) => {
    axios.get(`http://api.fanyi.baidu.com/api/trans/vip/translate?q=${text}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`)
      .then(({ data: { error_code, error_msg, trans_result } }) => {
        if (+error_code !== 52000)
          return reject(new Error(errCodeMap[error_code] || error_msg))
        resolve(trans_result[0].dst)
      }).catch(reject)
  })
}
export default getTranslate
