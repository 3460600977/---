const SIGN_REGEXP = /([yMdhsm])(\1*)/g
const DEFAULT_PATTERN = 'yyyy-MM-dd'

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
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject({msg: '未选择任何文件'});
      }
      let url = URL.createObjectURL(file);
      let video = document.createElement('video');

      if (file.type !== 'video/mp4') {
        console.log('avi格式不支持前端校验')
        return resolve({
          msg: '添加视频成功',
        });
      }

      video.src = url;

      video.style = "position: relative; z-index: -1; opacity: 0;"

      video.setAttribute('style', "position: absolute; z-index: -100; top: 0; opacity: 0; width: 200px");

      document.getElementById('app').appendChild(video)

      video.addEventListener('canplay', (e) => {
        let videoTime = e.target.duration * 1000;
        let videoWidth = e.target.videoWidth;
        let videoHeight = e.target.videoHeight;
        let durationToSecondes = (videoTime / 1000).toFixed(0);
        // 001-5s/次，002-10s/次，003-15s/次 依次类推

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
          msg: '添加视频成功',
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
    return new Promise((resolve, reject) => {
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
          msg: '添加图片成功！',
        });
      }

    })
  },


  /*
   数组去重
   */
  unique(arr1, key) {
    const res = new Map();
    let result = arr1.filter((a) => !res.has(a[key]) && res.set(a[key], 1))
    return result
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
    if (prefixInt) {
      result = prefixInt + result;
    }
    if (hasZero) {
      suffixDecimal = suffixDecimal.length === 1 ? suffixDecimal + '0' : suffixDecimal
      result = result + '.' + suffixDecimal;
    }

    return result
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
  * concat: 将一个数组对象按key结合成一个新的数组
  * sum： 将一个数组对象的key项相加返回加之后的结果
  * */
  operation(arr, key, type = 'concat') {
    if (type === 'concat') {
      let arrTotal = arr.reduce((total, item) => {
        return total.concat(item[key])
      }, [])
      return arrTotal
    } else if (type === 'sum') {
      let result = arr.reduce((total, item) => {
        return total += item[key]
      }, 0)
      return result
    }
  },



  /**
   * @description: 前端分页
   * @param originData: Array 页数
   * @param pageSize: Number 每页大小
   * @param curPage: Number 当前页数
   * @return: 需要的页数据
   */
  getFrontEndPage(originData, pageSize, curPage) {
    let res = {};
    res.results = originData.filter((item, index) => {
      return index >= ((curPage - 1) * pageSize) && index < curPage * pageSize;
    })
    res.pageSize = pageSize;
    res.pageNum = Math.ceil(originData.length / pageSize);
    res.curPage = curPage;
    res.totalCount = originData.length;
    return res;
  },



  // 数据补零
  padding(s, len) {
    const l = len - (s + '').length
    for (var i = 0; i < l; i++) {
      s = '0' + s
    }
    return s
  },



  /**
   * @description: 格式化时间
   * @param: pageSize
   */
  formatDate: function (date, pattern) {
    date = new Date(date)
    pattern = pattern || DEFAULT_PATTERN
    return pattern.replace(SIGN_REGEXP, function ($0) {
      switch ($0.charAt(0)) {
        case 'y':
          return tools.padding(date.getFullYear(), $0.length)
        case 'M':
          return tools.padding(date.getMonth() + 1, $0.length)
        case 'd':
          return tools.padding(date.getDate(), $0.length)
        case 'w':
          return date.getDay() + 1
        case 'h':
          return tools.padding(date.getHours(), $0.length)
        case 'm':
          return tools.padding(date.getMinutes(), $0.length)
        case 's':
          return tools.padding(date.getSeconds(), $0.length)
      }
    })
  },



  /**
   * @description: 校验后缀
   * @param: 字符串 str 校验的字符串
   * @param: 数组 suffix 后缀
   */
  checkSuffix: (str, suffix) => {
    if (!str) return '';
    let result = false;
    let strSuffix = str.substr(str.lastIndexOf(".") + 1);
    for (let i = 0; i < suffix.length; i++) {
      if (strSuffix === suffix[i]) {
        result = true;
        break;
      }
    }
    return result;
  },



  /**
   * @description: 获取后缀
   * @param: 字符串 str 校验的字符串
   * @param: 数组 suffix 后缀
   */
  getSuffix: (str) => {
    if (!str) return '';
    let strSuffix = str.substr(str.lastIndexOf(".") + 1);
    return strSuffix;
  },


  /**
   * @description: 根据index删除数组元素
   * @param: arrData
   * @param: index
   */
  removeArrayItemByIndex(arrData, index) {
    arrData.splice(index, 1);
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
   * @description: 时间格式化
   * @param: fmt 格式
   * @param: date 时间戳, 不传默认返回发当前
   */
  getFormatDate(fmt, dateStr) {
    let ret;
    let date = dateStr ? new Date(dateStr) : new Date();
    let opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString(),          // 秒
      "c+": date.getMilliseconds().toString()     // 毫秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      }
      ;
    }
    ;
    return fmt;
  },


  /**
   * @description: 获取当前月第一天
   * @param: fmt 格式
   *
   */
  getMonthFirstDay(fmt) {
    if (!fmt || fmt.match(/^[ ]*$/)) {
      fmt = 'YYYY-mm-dd'
    }
    let startTime = new Date()
    startTime.setDate(1)
    return this.getFormatDate(fmt, startTime)
  },



  /**
   * @description: 获取当前月第一天
   * @param: fmt 格式
   *
   */
  getMonthLastDay(fmt) {
    if (!fmt || fmt.match(/^[ ]*$/)) {
      fmt = 'YYYY-mm-dd'
    }
    let endTime = new Date()
    endTime = new Date(endTime.getFullYear(), endTime.getMonth() + 1, 0)
    return this.getFormatDate(fmt, endTime)
  },



  /**
   * @description: 获取当前星期一,星期天
   * @param: fmt 格式
   *
   */
  getWeekFirstLastDay(fmt) {
    if (!fmt || fmt.match(/^[ ]*$/)) {
      fmt = 'YYYY-mm-dd'
    }
    let curr = new Date() // get current date
    let first = curr.getDate() - curr.getDay() + 1 // First day is the day of the month - the day of the week
    let last = first + 6 // last day is the first day + 6
    let firstDay = new Date(curr.setDate(first))
    let lastDay = new Date(curr.setDate(last))
    firstDay = this.getFormatDate(fmt, firstDay)
    lastDay = this.getFormatDate(fmt, lastDay)
    return {firstWeekDay: firstDay, lastWeekDay: lastDay}
  },



  /**
   * @description: 把分变成元
   * @param: str
   *
   */
  formatCentToYuan(value) {
    value = value.toString()
    let cent = value.substr(-2)
    let leftValue = value.substr(0, value.length - 2)
    return leftValue + '.' + cent
  },



  /**
   * @description: 根据数组中对象属性返回第一个匹配数组项
   * @param: arr 源数据
   * @param: key
   * @param: val
   */
  getObjectItemFromArray(arr, key, val) {
    let res = {};
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] == val) {
        res = arr[i];
        break;
      }
    }
    return res
  },



  /**
   * @description: file转预览url
   * @param: file
   */
  fileToUrl(file) {
    if (!file) return '';
    if (typeof file === 'string') {
      return file;
    }
    return URL.createObjectURL(file);
  },



  // 返回date前days天的时间 到 date时间的数据
  calcShortCuts(days, date = null) {
    const now = date ? new Date(date) : new Date()
    const end = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 23:59:00');
    now.setTime(now.getTime() - 3600 * 1000 * 24 * days);
    const start = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 00:00:00');
    return [start, end];
  },



  // 去抖函数
  debounce(fn, delay) {

    // 定时器，用来 setTimeout
    var timer
    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function () {

      // 保存函数调用时的上下文和参数，传递给 fn
      var context = this
      var args = arguments
      // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
      clearTimeout(timer)

      // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
      // 再过 delay 毫秒就执行 fn
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  },



  // 二分算法
  binarySearch(index, data, key) {
    let l = 0, r = data.length - 1;
    while (l <= r) {
      let mid = Math.floor((l + r) / 2);
      let currentP = data[mid][key];
      if (currentP < index) {
        l = mid + 1;
      } else if (currentP > index) {
        r = mid - 1;
      } else {
        return mid;
      }
    }
    return l;
  },


}

export default tools;

