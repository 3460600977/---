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
    return new Promise( (resolve, reject) => {
      if (!file) {
        return reject({msg: '未选择任何文件'});
      }
      let url = URL.createObjectURL(file);
      let video = document.createElement('video');

      video.src = url;
      video.style="position: relative; z-index: -1; opacity: 0;"
      document.getElementById('app').appendChild(video)

      video.addEventListener('canplay', (e) => {
        let videoTime   = e.target.duration * 1000;
        let videoWidth  = e.target.videoWidth;
        let videoHeight = e.target.videoHeight;
        let durationToSecondes = (videoTime / 1000).toFixed(0);
        let durationType = durationToSecondes == 15 ? 2
          : durationToSecondes == 10 ? 1 : 0; // 0 => 5s 1 => 10s 2=> 15s
        video.remove()
        if (limitTime - timeRange > videoTime || limitTime + timeRange < videoTime) {
          return reject({msg: '视频时间长度不符合要求！'});
        }
        if (limitWidth - 5 > videoWidth || limitWidth + 5 < videoWidth) {
          return reject({msg: '视频宽度不符合要求！'});
        }
        if (limitHeight - 5 > videoHeight || limitHeight + 5 < videoHeight) {
          return reject({msg: '视频高度不符合要求！'});
        }
        return resolve({
          name: file.name,
          msg: '添加视频成功',
          base64: url,
          durationType: durationType
        });
      })
    } )
  },

  /**
   * @description: 验证图片宽高
   * @param file: input->file
   * @param limitWidth:
   * @param limitHeight:
   */
  checkImageSize: (file, limitWidth, limitHeight) => {
    return new Promise( (resolve, reject) => {
      if (!file) {
        return reject({msg: '未选择任何文件'});
      }
      let img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let imgWidth = img.width;
        let imgHeight = img.height;
        if (limitWidth - 5 > imgWidth || limitWidth + 5 < imgWidth) {
          return reject({msg: '图片宽度不符合要求'});
        }
        if (limitHeight - 5 > imgHeight || limitHeight + 5 < imgHeight) {
          return reject({msg: '图片高度不符合要求'});
        }
        return resolve({
          name: file.name,
          msg: '添加图片成功！',
          base64: img.src
        });
      }

    } )
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
  },
  /**
   * @description: 深度克隆
   * @param:
   */
  deepCopy: (data) => {
    var t = type(data)
    var o
    var i
    var ni
    if (t === 'array') {
      o = []
    } else if (t === 'object') {
      o = {}
    } else {
      return data
    }
    if (t === 'array') {
      for (i = 0, ni = data.length; i < ni; i++) {
        o.push(deepCopy(data[i]))
      }
      return o
    } else if (t === 'object') {
      for (i in data) {
        o[i] = deepCopy(data[i])
      }
      return o
    }
  },
}

export default tools;

