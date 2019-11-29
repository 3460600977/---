<template>
  <header id="top-header" class="top-header clearfix">
    <!-- logo -->
    <div class="logo mid">
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
        @click="menu.activeIndex = index;"
        v-for="(mitem, index) in menu.content" :key="index">
        <div class="menu-text" :class="{'active': index === menu.activeIndex}">
          {{mitem.name}}
        </div>
      </li>

      <!-- {{menu.moveBlock}} -->
      <!-- 覆盖效果 -->
      <div class="hover-move-block" :style="{...menu.moveBlock}"></div>
    </ul>

    <!-- user msg -->
    <div class="user-msg color-white mid">
      <div class="item mid"><img width="20px" :src="images.money" alt=""></div>
      <div class="item mid">
        <el-badge :value="20">
          <img width="20px" :src="images.notification" alt="">
        </el-badge>
      </div>
      <div class="item">
        <div class="user-head mid clearfix">
          <img class="head" width="47px" :src="images.userHead" alt="头像">
          <div class="operation-box mid relative">
            <div class="user-name font-14">admin</div>
            <img class="up-icon" width="10px" :src="images.up" alt="" srcset="">

            <div class="drop-box absolute font-14">
              <ul>
                <li class="o-item center">账号管理</li>
                <li class="o-item center">修改密码</li>
                <li class="o-item center color-red">退出登录</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
        moveBlock: {
          width: '78px',
          transform: 'translateX(0px)',
          opacity: 0
        },
        content: [
          { name: '首页'},
          { name: '城市洞察'},
          { name: '投放管理'},
          { name: '报表中心'},
          { name: '工具箱'},
          { name: '审核管理'},
        ]
      },
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
      this.menu.moveBlock = {
        width: blockWidth + 'px',
        transform: `translateX(${left}px)`,
        opacity: 1
      }
    },

    /**
     * 鼠标离开菜单
     */
    leaveMenu() {
      this.menu.moveBlock.opacity = 0;
    }
  },

  computed: {
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
          padding-bottom: 72px;
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
        height: 100%;
        padding: 0 25px;
        cursor: pointer;
        transition: .3s;
        &:hover{
          background: #333A61;
        }
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
              .drop-box{
                display: block;
              }
              .up-icon{
                transform: rotate(180deg);
              }
            }
            .drop-box{
              display: none;
              top: $headerHeight;
              left: 0;
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
    }
  }
  @media screen and (max-width: 1280px) {
    .logo-split,.company-name{
      display: none;
    }
  }
</style>
