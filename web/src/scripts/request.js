/*
 * 网络请求模块
 * @Author: Cphayim 
 * @Date: 2017-10-18 15:56:24 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-26 00:07:06
 */
import axios from 'axios'
import { Toast } from 'mint-ui'
import { Indicator } from 'mint-ui'

export default ({ url, method = 'post', data = {} }) => {
  // console.log(data)
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: method,
      data: data,
      transformRequest: [data => {
        let ret = ''
        let keys = Object.keys(data)
        keys.forEach(key => ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&')
        return ret
      }],
      headers: {
        // 'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => resolve(res.data))
      .catch(err => {
        console.log(err)
        Indicator.close()
        Toast({
          message: '请求失败，请检查网络!'
          // iconClass: 'icon icon-success'
        })
        reject(err)
      })
  })
}