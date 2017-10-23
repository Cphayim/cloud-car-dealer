/*
 * 网络请求模块
 * @Author: Cphayim 
 * @Date: 2017-10-18 15:56:24 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-10-18 17:43:19
 */
import axios from 'axios'

export default ({ url, method = 'post', data = {} }) => {
  console.log(data)
  return axios({
    url: url,
    method: method,
    data: data,
    transformRequest: [data => {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      // 'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}