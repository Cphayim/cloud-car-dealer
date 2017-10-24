/*
 * 网络请求模块
 * @Author: Cphayim 
 * @Date: 2017-10-18 15:56:24 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-24 15:04:04
 */
import axios from 'axios'

export default ({ url, method = 'post', data = {} }) => {
  // console.log(data)
  return axios({
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
}