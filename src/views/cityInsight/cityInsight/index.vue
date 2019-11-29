<template>
    <div class="container">

    </div>
</template>

<script>
  export default {
    name: "index",
    mounted() {
      var map = new BMap.Map(this.$refs.container);
      var point = new BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(true)

      // var marker = new BMap.Marker(point);        // 创建标注
      // map.addOverlay(marker);
      // function addMarker(point, index){  // 创建图标对象
      //   var myIcon = new BMap.Icon("../../assets/images/icon-location.png", new BMap.Size(23, 25), {
      //     // 指定定位位置。
      //     // 当标注显示在地图上时，其所指向的地理位置距离图标左上
      //     // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
      //     // 图标中央下端的尖角位置。
      //     anchor: new BMap.Size(10, 25),
      //     // 设置图片偏移。
      //     // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
      //     // 需要指定大图的偏移位置，此做法与css sprites技术类似。
      //     imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
      //   });
      //   // 创建标注对象并添加到地图
      //   var marker = new BMap.Marker(point, {icon: myIcon});
      //   map.addOverlay(marker);
      // }
      // // 随机向地图添加10个标注
      // var bounds = map.getBounds();
      // console.log(bounds)
      // var lngSpan = bounds.maxX - bounds.minX;
      // var latSpan = bounds.maxY - bounds.minY;
      // console.log(latSpan, latSpan)
      // for (var i = 0; i < 10; i ++) {
      //   var point = new BMap.Point(bounds.minX + lngSpan * (Math.random() * 0.7 + 0.15),
      //     bounds.minY + latSpan * (Math.random() * 0.7 + 0.15));
      //   addMarker(point, i);
      // }
      // marker.addEventListener("click", function(){
      //   alert("您点击了标注");
      // });
      // var polyline = new BMap.Polyline([
      //     new BMap.Point(116.399, 39.910),
      //     new BMap.Point(116.405, 39.920)
      //   ],
      //   {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5}
      // );
      // map.addOverlay(polyline);

      // 定义自定义覆盖物的构造函数
      function SquareOverlay(center, length, color){
        this._center = center;
        this._length = length;
        this._color = color;
      }
      // 继承API的BMap.Overlay
      SquareOverlay.prototype = new BMap.Overlay();
      // 实现初始化方法
      SquareOverlay.prototype.initialize = function(map){
        // 保存map对象实例
        his._map = map;
        // 创建div元素，作为自定义覆盖物的容器
        var div = document.createElement("div");
        div.style.position = "absolute";
        // 可以根据参数设置元素外观
        div.style.width = this._length + "px";
        div.style.height = this._length + "px";
        div.style.background = this._color;
        // 将div添加到覆盖物容器中
        console.log(map.getPanes())
        map.getPanes().markerPane.appendChild(div);
        // 保存div实例
        this._div = div;
        // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
        // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return div;
      }


      // map.addControl(new BMap.NavigationControl());
      // map.addControl(new BMap.ScaleControl());
      // map.addControl(new BMap.OverviewMapControl());
      // map.addControl(new BMap.MapTypeControl());
      // map.setCurrentCity("北京"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
      // map.addControl(new BMap.CopyrightControl());
    }
  }
</script>

<style scoped lang='scss'>

</style>
