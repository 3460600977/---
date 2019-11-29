let tools = {
  /**
   * @description: 验证视频时长, 宽高
   * @param file: input->file
   * @param limitTime: 时间 毫秒
   * @param timeRange: 时间误差
   * @param limitWidth:
   * @param limitHeight:
   */
  checkVideoTimeAndSize: (file, limitTime, timeRange = 0, limitWidth, limitHeight) => {
    let url = URL.createObjectURL(file);
    let video = document.createElement('video');
  
    video.src = url;
    video.style="position: relative; z-index: -1; opacity: 0;"
    document.getElementById('app').appendChild(video)
  
    video.addEventListener('canplay', (e) => {
      let videoTime = e.target.duration;
      let videoWidth = e.target.videoWidth;
      let videoHeight = e.target.videoHeight;
      if (limitTime - timeRange > videoTime || limitTime + timeRange < videoTime) {
        return alert('时间不符合要求')
      }
      if (videoWidth != limitWidth) {
        return alert('宽度不符合')
      }
      if (videoHeight != limitHeight) {
        return alert('高度不符合')
      }
    })
  },

  /**
   * @description: 数字转千位计数
   * @param: num: 数字
   */
  toThousands: num => {
    num = (num || 0).toString();
    let prefixInt = num.split('.')[0];
    let suffixDecimal = num.split('.')[1] || '00';
    let result = '';
    while (prefixInt.length > 3) {
      result = ',' + prefixInt.slice(-3) + result;
      prefixInt = num.slice(0, prefixInt.length - 3);
    }
    if (prefixInt) { result = prefixInt + result; }
    return result + '.' + suffixDecimal;
  }
}

export default tools;