<template>
      <transition
        @enter="enter"
        @leave="leave"
      >
        <div v-show="isShow">
          <slot></slot>
        </div>
      </transition>
</template>

<script>
  export default {
    name: "slideContainer",
    data() {
      return {
        isShow: true
      }
    },
    methods: {
      enter(el, done) {
        let width = el.scrollWidth
        let step = width / 300 * 20
        let distance = 0
        let change = () => {
          distance += step
          if (distance < width) {
            el.style.transform = `translateX(${distance}px)`
            requestAnimationFrame(change)
          } else {
            el.style.transform = `translateX(${width}px)`
            done()
          }
        }
        requestAnimationFrame(change)
      },
      leave(el, done) {
        let width = el.scrollWidth
        let step = width / 300 * 20
        let change = () => {
          width -= step
          if (width > 0) {
            el.style.transform = `translateX(${width}px)`
            requestAnimationFrame(change)
          } else {
            el.style.transform = `translateX(0px)`
            done()
          }
        }
        requestAnimationFrame(change)
      },
    }
  }
</script>

<style scoped lang='scss'>

</style>
