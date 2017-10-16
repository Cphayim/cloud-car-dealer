import toast from './toast';
/*
 * 图片操作相关 API 封装
 * @Author: Cphayim 
 * @Date: 2017-09-15 16:05:55 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-09-15 16:06:25
 */
export const cywxImage = {
    /**
     * 选择图片
     * @param {{
     *         count?: number,
     *         sizeType?: string[],
     *         sourceType?: string[]
     *     }} opt 
     * @returns 
     */
    choose({ count = 9, sizeType = ['original', 'compressed'], sourceType = ['album', 'camera'] }:
        { count?: number, sizeType?: string[], sourceType?: string[] }) {
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count, sizeType, sourceType,
                success(res) {
                    resolve(res);
                },
                fail(res) {
                    console.log(res);
                    toast.showError('调用相册失败');
                }
            });
        });
    },

    preview({ current = '', urls = [] }:
        { current?: string, urls: string[] }) {
        if (!(urls instanceof Array)) { return }
        return new Promise((resolve, reject) => {
            wx.previewImage({
                current, urls,
                success(res) {
                    resolve(res);
                },
                fail(res) {
                    console.log(res);
                }
            });
        })
    }
}