<!--  登录页面代码 -->
<template>
    <!-- 组件标签代码必须写在这里 -->
    <div class="login-container">
        <div class="bg-box">
            <!-- 背景图片 -->
            <img src="../assets/bg.png" />
        </div>
        <!-- login登录组件 -->
        <div class="login-box">
            <div class="avatar-box">
                <!-- 登录图标 -->
                <img src="../assets/user.png" alt="">
            </div>
            <div class="title">电商后台管理系统</div>
            <el-form class="login-form" :model="LoginForm" :rules="loginRules" ref="LoginFormRef">
                <el-form-item prop="username">
                    <el-input v-model="LoginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="LoginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
/* 组件的样式代码必须写在这里 */
.login-container {
    background: #93defe;
    height: 100%;
}

.bg-box {
    position: fixed;
    left: 150px;
    top: 50%;
    /* // 垂直居中 */
    transform: translateY(-50%);
}

.login-box {
    width: 400px;
    height: 350px;
    background-color: #fff;
    border-radius: 6px;
    position: relative;
    left: 60%;
    top: 50%;
    transform: translateY(-50%);
}

.login-box .avatar-box {
    width: 120px;
    height: 120px;
    border: 5px solid #93defe;
    background-color: #fff;
    border-radius: 100%;
    text-align: center;
    line-height: 110px;
    position: absolute;
    top: -60px;
    right: 140px;
}

.title {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%);
    font-size: 18px;
    color: #444;
}

.avatar-box img {
    margin-top: 20px;
}

.login-box .login-form {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%);
    width: 80%;
}

.btns {
    display: flex;
    justify-content: flex-end;
}
</style>


<script>
// 组件的逻辑代码必须写在这里vue代码
export default {
    name:"Login.vue",
    data() {
        return {
            // 这是登录的数据对象
            LoginForm: {
                username: 'admin',
                password: '123456'
            },
            // 这是表单的验证规则对象
            loginRules: {
                // 验证用户名是否合法：
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法：
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        reset() {
            // console.log(this);
            // 引用组件的实例之后，就可以调用组件上的methods方法
            this.$refs.LoginFormRef.resetFields();
        },
        login() {
            this.$refs.LoginFormRef.validate(async (valid) => {
                // console.log(valid);
                if (!valid) return // 验证不通过，不执行下面的代码  
                // var result=this.$http.post('login', this.LoginForm);
                // console.log(result);
                const { data: res } = await this.$http.post('login', this.LoginForm);
                if (res.meta.status !== 200){
                    return this.$message.error('登录失败')
                } 
                this.$message.success('登录成功')
                console.log(res);

                // 后期可以修改
                window.sessionStorage.setItem('token', res.data.token)
                // 登录成功，跳转到首页
                this.$router.push('/home')
            });
        }
    }
}
</script>
