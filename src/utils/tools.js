let tools = {
  /**
   * @description: 验证MP4视频时长, 宽高
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

      if (file.type !== 'video/mp4') {
        console.log('avi格式不支持前端校验')
        return resolve({
          name: file.name,
          type: file.type,
          msg: '添加视频成功',
          base64: url,
          durationType: '003'
        });
      }

      video.src = url;
      video.setAttribute('style', "position: absolute; z-index: -100; top: 0; opacity: 0; width: 200px");
      document.getElementById('app').appendChild(video)

      video.addEventListener('canplay', (e) => {
        let videoTime   = e.target.duration * 1000;
        let videoWidth  = e.target.videoWidth;
        let videoHeight = e.target.videoHeight;
        let durationToSecondes = (videoTime / 1000).toFixed(0);
        // 001-5s/次，002-10s/次，003-15s/次 依次类推
        let durationType = durationToSecondes == 15 ? '003'
          : durationToSecondes == 10 ? '002' : '001'; 

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
          type: file.type,
          msg: '添加视频成功',
          base64: url,
          durationType: durationType
        });
      })
    })
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
  toThousands: (num, hasZero = true) => {
    num = (num || 0).toString();
    let prefixInt = num.split('.')[0];
    let suffixDecimal = num.split('.')[1] || '00';
    let result = '';
    while (prefixInt.length > 3) {
      result = ',' + prefixInt.slice(-3) + result;
      prefixInt = num.slice(0, prefixInt.length - 3);
    }
    if (prefixInt) { result = prefixInt + result; }
    if (hasZero) return result + '.' + suffixDecimal;
    else return result
  },
  
  type: (obj) => {
    var toString = Object.prototype.toString
    var map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    }
    return map[toString.call(obj)]
  },

  /**
   * @description: 深度克隆
   * @param:
   */
  deepCopy: (data) => {
    var t = tools.type(data)
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
        o.push(tools.deepCopy(data[i]))
      }
      return o
    } else if (t === 'object') {
      for (i in data) {
        o[i] = tools.deepCopy(data[i])
      }
      return o
    }
  },

  /*
  * 过略出对象数组里面的key属性形成一个新的数组
  * */
  FilterByKey(arr, key) {
    let arrTotal = arr.reduce((total, item) => {
      return total.concat(item[key])
    }, [])
    return arrTotal
  },

  /**
   * TODO
   * @description: 前端分页
   * @param: pageSize
   */
  localPagegation: () => {

  },

  /**
   * @description: 校验后缀
   * @param: 字符串 str 校验的字符串
   * @param: 数组 suffix 后缀
   */
  checkSuffix: (str, suffix) => {
    let result = false;
    let strSuffix = str.substr(str.lastIndexOf(".") + 1);
    for (let i=0; i<suffix.length; i++) {
      if (strSuffix === suffix[i]) {
        result = true;
        break;
      }
    }
    return result;
  },

  /**
   * @description: 根据index删除数组元素
   * @param: arrData
   * @param: index
   */
  removeArrayItemByIndex(arrData, index) {
    return arrData.splice(index, 1);
  },

  /**
   * @description: 下载文件流
   * @param: file
   * @param: name   名字包括后缀
   */
  downLoadFileFlow(file, name) {
    const blob = new Blob([file]);
    const fileName = name;
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  },

  /**
   * @description: 获取当前年月日
   * @param: fmt 格式
   * @param: date 时间戳, 不传默认返回发当前
   */
  getFormatDate(fmt, dateStr) {
    let ret;
    let date = dateStr || new Date();
    let opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
  },


  /**
   * @description: 根据数组中对象属性返回第一个匹配数组项
   * @param: arr 源数据
   * @param: key
   * @param: value
   */
  getObjectItemFromArray(arr, key, val) {
    let res = {};
    for(let i=0; i<arr.length; i++) {
      if (arr[i][key] == val) {
        res = arr[i];
        break;
      }
    }
    return res
  }
  

  
  
}

export default tools;

