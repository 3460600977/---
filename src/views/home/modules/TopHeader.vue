<template>
  <header class="top-header clearfix">
    <!-- logo -->
    <div class="logo mid">
      <img class="logo-xinchao" :src="images.logo" alt="新潮传媒">
      <div class="logo-split"></div>
      <label class="company-name font-14 color-white">数字化刊播平台</label>
    </div>

    <!-- menu -->
    <ul class="my-menu font-14 relative">
      <li class="item" 
        @click="menu.activeIndex = index;"
        v-for="(mitem, index) in menu.content" :key="index">
        <div class="menu-text" :class="{'active': index === menu.activeIndex}">
          {{mitem.name}}
        </div>
      </li>
    </ul>

    <!-- user msg -->
    <div class="user-msg color-white mid">
      <div class="item mid"><img width="20px" :src="images.money" alt=""></div>
      <div class="item mid">
        <el-badge :value="200">
          <img width="20px" :src="images.notification" alt="">
        </el-badge>
      </div>
      <div class="item">
        <div class="user-head mid clearfix">
          <img class="head" width="47px" :src="images.userHead" alt="头像">
          <div class="operation-box mid relative">
            <div class="user-name font-14">admin</div>
            <i>▲</i>

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
      },
      menu: {
        activeIndex: 0,
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
        float: left;
        line-height: $headerHeight;
        padding: 0 25px;
        height: $headerHeight;
        letter-spacing: 0;
        cursor: pointer;
        transition: .3s;
        &:hover{
          background: #000;
        }
        .menu-text{
          height: $headerHeight - 4px;
          padding-bottom: 72px;
          &.active{
            border-bottom: 4px solid rgba(45,90,255,1);
          }
        }
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
          background: #000;
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
            &:hover{
              .drop-box{
                display: block;
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
