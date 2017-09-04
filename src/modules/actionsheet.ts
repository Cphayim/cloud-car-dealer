/*
 * 操作列表
 * @Author: Cphayim 
 * @Date: 2017-09-04 14:15:50 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-04 14:20:57
 */

export const actionSheet = {
    show({
        itemList = [],
        itemColor = '#333',
    }) {
        return new Promise((resolve, reject) => {
            wx.showActionSheet({
                itemList, itemColor,
                success(res) {
                    resolve(res.tapIndex);
                },
                fail(err){
                    console.log(err);
                }
            })
        })
    }
}