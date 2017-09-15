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
        itemColor = '#666',// #54b4ef
    }: {
            itemList: string[],
            itemColor?: string
        }) {
        return new Promise((resolve, reject) => {
            wx.showActionSheet({
                itemList, itemColor,
                success(res) {
                    if (typeof res.tapIndex === 'number') {
                        resolve(res.tapIndex);
                    }
                },
                fail(err) {
                    // console.log(err);
                }
            })
        })
    }
}