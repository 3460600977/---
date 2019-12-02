export default class Map {
  constructor(dom, center, zoom) {
    this.dom = dom
    this.center = center
    this.zoom = zoom
    this.map = null
    this.cityName = null
  }
  init() {
    this.map = new BMap.Map(this.dom);
    this.map.centerAndZoom(this.center, this.zoom);
    this.map.enableScrollWheelZoom();
    this.setControl()
    this.location()
    this.setZoom(this.zoom)
  }
  setControl() {
    let control = new BMap.ScaleControl()
    console.log(control.getUnit())
    this.map.addControl(control)
  }
  setCenter(city) {
    this.map.setCenter(city)
  }
  setZoom(zoom) {
    this.map.setZoom(zoom)
  }
  location() {
    let myCity = new BMap.LocalCity()
    myCity.get((result) => {
      this.cityName = result.name
      this.setCenter(result.name)
    })
  }

}
