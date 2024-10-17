<!-- 主页界面 -->
<template>
    <!-- 布局容器 -->
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/shop.png" alt="">
                <!-- 顶部标题 -->
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout"> 退出 </el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <!-- 侧边栏折叠按钮 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏主体区域 -->
                <!-- 为了保持左侧菜单每次只能打开一个，显示其中的子菜单，我们可以在el-menu中添加一个属性unique-opened -->
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF" :unique-opened="true"
                    :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单的模板区 -->
                        <template slot="title">
                            <!-- 图标 可修改-->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id" @click="saveNavState(item2.path)">
                            <template slot="title">
                                <!-- 图标 可修改-->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{ item2.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容区域 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.home-container {
    height: 100%;
}

.el-container {
    height: 100%;
}

.el-header {
    background-color: #373D41;
    padding-left: 5px;
    color: #fff;
    display: flex;
    /* 两端对齐，项目之间的间隔都相等 */
    justify-content: space-between;
    align-items: center;
}

.el-aside {
    background-color: #333744;
}

.el-main {
    background-color: #eaedf1;
}

.el-header>div {
    display: flex;
    align-items: center;
}

.el-header img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
}

/* 设置图标和菜单文本之间的间距 */
.iconfont {
    margin-right: 10px;
}

/*  解决菜单栏多出的1px边框 */
.el-menu {
    border: 0;
}

/* 左侧菜单的折叠与展开 */
.toggle-button {
    color: #fff;
    text-align: center;
    font-size: 14px;
    letter-spacing: .2em;
    padding: 5px 0px;
    background-color: #4A5064;
    cursor: pointer;
}
</style>>

<script>
export default {
    name: "Home.vue",
    data() {
        return {
            // 左侧菜单数据
            menuList: [],
            // 左侧菜单是否折叠
            isCollapse: false,
            //被激活的二级菜单链接地址
            activePath: '',
            // 图标对象
            iconsObj: {
                // id  :'字体图标前缀 对应的字体图标'
                '125': 'iconfont el-icon-user',
                '103': 'iconfont el-icon-s-cooperation',
                '101': 'iconfont el-icon-s-shop',
                '102': 'iconfont el-icon-s-claim',
                '145': 'iconfont el-icon-s-data'
            }
        }
    },
    methods: {
        logout() {
            // 退出登录，清除token
            window.sessionStorage.clear();
            // 跳转到登录页面
            this.$router.push('/login');
        },
        // 获取所的菜单列表数据
        async getMenuList() {
            const { data: res } = await this.$http.get('menus');

            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
            }
            this.menuList = res.data;
            // console.log(this.menuList);
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        //保存链接的激活状态
        saveNavState(path) {
            //点击二级菜单的时候保存被点击的二级菜单信息
            window.sessionStorage.setItem('activePath', path)
            this.activePath = path
        }
    },
    //什么时候赋值？在home一创建的时候就从sessionStorage中把值取出来，创建的时候肯定会执行生命周期函数
    //所以在created中将sessionStorage中的数据赋值给activePath
    created() { //Vue的生命周期函数--当Vue的实例被创建后会自动调用此钩子函数
        this.getMenuList(); //当页面一创建，立马获取菜单数据
        this.activePath = window.sessionStorage.getItem('activePath')
    }
}
</script>
