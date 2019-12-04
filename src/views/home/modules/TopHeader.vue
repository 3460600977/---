<template>
  <header id="top-header" class="top-header clearfix">
    <!-- logo -->
    <div class="logo mid" @click="menu.activeIndex=0; handleTo('/')">
      <img class="logo-xinchao" :src="images.logo" alt="新潮传媒">
      <div class="logo-split"></div>
      <label class="company-name font-14 color-white">数字化刊播平台</label>
    </div>

    <!-- menu -->
    <ul class="my-menu font-14 relative">
      <li class="item"
        :class="{'active': index === menu.activeIndex}"
        @mouseenter="hoverMenu(menu.content, index)"
        @mouseleave="leaveMenu"
        @click="menu.activeIndex = index; handleTo(mitem.path)"
        v-for="(mitem, index) in menu.content" :key="index">
        <div class="menu-text" :class="{'active': index === menu.activeIndex}">
          {{mitem.name}}
        </div>
      </li>

      <!-- 覆盖效果 -->
      <div class="hover-move-block" :style="{...menu.moveBlockStyle}"></div>
    </ul>

    <!-- user msg -->
    <div class="user-msg color-white mid">
      <!-- 钱 -->
      <div 
        @mouseenter="hoverRightMsg(0)" 
        @mouseleave="leaveMenu" 
        class="item mid"><img width="20px" :src="images.money" alt="">
      </div>

      <!-- 消息 -->
      <div 
        @mouseenter="hoverRightMsg(1)" 
        @mouseleave="leaveMenu" 
        class="item mid">
        <el-badge :value="20">
          <img width="20px" :src="images.notification" alt="">
        </el-badge>
      </div>

      <!-- 用户信息，下拉菜单 -->
      <div 
        @mouseenter="hoverRightMsg(2)" 
        @mouseleave="leaveMenu" 
        class="item">
        <div class="user-head mid clearfix">
          <img class="head" width="47px" :src="images.userHead" alt="头像">
          <div  class="operation-box mid relative">
            <div class="user-name font-14">admin</div>
            <img class="up-icon" width="10px" :src="images.up" alt="" srcset="">
            <transition name="to-top">
              <div v-show="rightMsg.dropMenuShow" class="drop-box absolute font-14">
                <ul>
                  <li class="o-item center">账号管理</li>
                  <li class="o-item center">修改密码</li>
                  <li class="o-item center color-red">退出登录</li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <!-- 覆盖效果 -->
      <div class="hover-move-block" :style="{...rightMsg.hoverBlock.style}"></div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TopHeader',
  data () {
    return {
      images: {
        logo: require('../../../assets/images/icon_logo.png'),
        money: require('../../../assets/images/icons/icon_money.png'),
        notification: require('../../../assets/images/icons/icon_notification.png'),
        userHead: require('../../../assets/images/icons/icon_tx.png'),
        up: require('../../../assets/images/icons/icon_up.png'),
      },
      menu: {
        activeIndex: 0,
        moveBlockStyle: {
          width: '78px',
          transform: 'translateX(0px)',
          opacity: 0
        },
        content: [
          { name: '首页', path: '/'},
          { name: '城市洞察', path: '/'},
          { name: '投放管理', path: '/putManage'},
          { name: '报表中心', path: '/'},
          { name: '工具箱', path: '/'},
          { name: '审核管理', path: '/'},
        ]
      },
      rightMsg: {
        hoverBlock: {
          width: ['70px', '70px', '170px'],
          style: {
            width: '70px',
            transform: 'translateX(0px)',
            opacity: 0
          }
        },
        dropMenuShow: false,
      }
    }
  },

  methods: {
    /**
     * 顶部菜单覆盖样式 宽度,位移
     * @param: menuArr 菜单数组
     * @param: index 覆盖的index
     */
    hoverMenu(menuArr, index) {
      let blockWidth = menuArr[index].name.length * 14 + 50;
      let left = 0;
      for (let i = 0; i<index; i++) {
        left += menuArr[i].name.length * 14 + 50;
      }
      this.menu.moveBlockStyle = {
        width: blockWidth + 'px',
        transform: `translateX(${left}px)`,
        opacity: 1
      }
    },

    /**
     * 右侧信息覆盖位移
     */
    hoverRightMsg(index) {
      if (index === 2) {
        this.rightMsg.dropMenuShow = true;
      }
      this.rightMsg.hoverBlock.style = {
        width: this.rightMsg.hoverBlock.width[index],
        transform: `translateX(${index * 70}px)`,
        opacity: 1
      }
    },

    /**
     * 鼠标离开菜单
     */
    leaveMenu() {
      this.menu.moveBlockStyle.opacity = 0;
      this.rightMsg.hoverBlock.style.opacity = 0;
      this.rightMsg.dropMenuShow = false;
    },

    /**
     * 手动跳转
     */
    handleTo(path) {
      this.$router.push(path)
    },

    /**
     * 初始化时设置激活的菜单
     */
    setActiveTopMenu() {
      let currentBasePath = this.$route.path.split('/')[1];
      this.menu.content.forEach((item, index) => {
        if (item.path.indexOf(currentBasePath) !== -1) {
          this.menu.activeIndex = index;
        }
      })
    }
  },

  beforeMount() {
    this.setActiveTopMenu()
  }
}
</script>

<style scoped lang="scss">
  $headerHeight: 76px;
  .top-header{
    width: 100%;
    flex-shrink: 0;
    min-height: $headerHeight;
    background-color: #2A2F4D;
    .logo{
      float: left;
      height: $headerHeight;
      margin-left: 30px;
      cursor: pointer;
      user-select: none;
      .logo-xinchao{
        width: 124px;
      }
      .logo-split{
        width:1px;
        height:20px;
        margin: 0 12px;
        background:rgba(87,94,135,1);
      }
      .company-name{
        margin-right: 50px;
      }
    }
    .my-menu{
      height: $headerHeight;
      float: left;
      color: #fff;
      .item{
        position: relative;
        z-index: 2;
        float: left;
        line-height: $headerHeight;
        padding: 0 25px;
        height: $headerHeight;
        letter-spacing: 0;
        cursor: pointer;
        transition: .3s;
        // &:hover{
        //   background: #333A61;
        // }
        &.active{
          background: #242945;
        }
        .menu-text{
          height: $headerHeight - 4px;
          user-select: none;
          padding-bottom: $headerHeight - 4px;
          &.active{
            border-bottom: 4px solid rgba(45,90,255,1);
          }
        }
      }
      .hover-move-block{
        position: absolute;
        z-index: 1;
        top: 0;
        transition: 0.3s;
        height: $headerHeight;
        background: #333A61;
      }
    }
    .user-msg{
      float: right;
      height: $headerHeight;
      margin-right: 28px;
      .item{
        position: relative;
        z-index: 2;
        height: 100%;
        padding: 0 25px;
        cursor: pointer;
        transition: .3s;
        // &:hover{
        //   background: #333A61;
        // }
        .user-head{
          height: 100%;
          .head{
            float: left;
          }
          .operation-box{
            float: left;
            height: $headerHeight;
            .user-name{
              margin: 0 10px;
              color: #979EBA;
            }
            .up-icon,.drop-box{
              transition: 0.3s;
            }
            &:hover{
              // .drop-box{
              //   display: block;
              // }
              .up-icon{
                transform: rotate(180deg);
              }
            }
            .drop-box{
              // display: none;
              top: $headerHeight;
              right: 0;
              z-index: 10000;
              width:100px;
              background:rgba(255,255,255,1);
              border:1px solid rgba(233,233,233,1);
              border-radius:4px;
              .o-item{
                padding: 18px 0;
                color: #999999;
                border-bottom: 1px solid rgba(233,233,233,1);
              }
            }
          }
        }
      }
      .hover-move-block{
        position: absolute;
        z-index: 1;
        top: 0;
        transition: 0.3s;
        height: $headerHeight;
        background: #333A61;
      }
    }
  }
  @media screen and (max-width: 1280px) {
    .logo-split,.company-name{
      display: none;
    }
  }
</style>
