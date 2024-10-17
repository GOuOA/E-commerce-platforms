<!-- 用户列表组件 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <!--为搜索框双向数据绑定   v-model="queryInfo.query" -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表(表格)区域 -->
            <!-- 用data来指定数据源,就是我们数据里面userList -->
            <!-- border 添加边框线 -->
            <el-table :data="userList" border stripe>
                <!-- label来指定标题 姓名对应的值可以通过prop来指定 api文档显示是username -->
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <!-- slot是插槽，slot-scope="scope"语义更加明确，scope.row相当于一行的数据 -->
                        <!-- {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="190px" type="index">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 角色分配 -->
                        <!-- el-tooltip文字提示 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页导航区域 
            @size-change(切换显示多少条的下来菜单,只要你切换了菜单，就会触发 pagesize事件) 
            @current-change(页码发生改变时触发)
            :current-page(设置当前页码)
            :page-size(当前每页显示数据条数)
            :total(设置总页数) 
            layout 表示页面展示多少组件，列：total就是展示得我们的总页数
            -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <!--visible.sync属性绑定 控制对话框的显示隐藏 width 控制对话框的宽度 :before-close 是一个事件在对话框关闭之前触发的事件 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <!-- 内容主体区域 -->
            <el-form label-width="70px" :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
            <!-- 内容主体区域 -->
            <div>
                <p>当前的用户:{{ userInfo.username }}</p>
                <p>当前的角色:{{ userInfo.role_name }}</p>
                <p>分配新角色:
                    <el-select v-model="selectedRoleId" placeholder="请选择角色">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName"
                            :value="item.id"></el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style scoped></style>

<script>
export default {
    data() {
        //验证邮箱的规则 通过箭头函数 rule 校验规则  value 待校验的值
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^\w+@\w+(\.\w+)+$/;
            // 通过正则表达式来校验邮箱的格式是否正确
            if (regEmail.test(value)) {
                // 通过regEmail.test函数去校验我们value是否合法
                return cb()
            }
            // 返回一个错误提示
            cb(new Error('请输入合法的邮箱'))
        }
        //验证手机号码的规则
        var checkMobile = (rule, value, cb) => {
            const regMobile = /^1[34578]\d{9}$/;
            // 通过正则表达式来校验邮箱的格式是否正确
            if (regMobile.test(value)) {
                // 通过regEmail.test函数去校验我们value是否合法
                return cb()
            }
            // 返回一个错误提示
            cb(new Error('请输入合法的手机号码'))
        }
        return {
            //获取用户列表的参数对象
            queryInfo: {
                //字符串
                query: '',
                //当前页面值
                pagenum: 1,
                //当前每页显示多少条数据数据
                pagesize: 2
            },
            //保存请求回来的用户列表数据
            userList: [],
            total: 0,// 保存用户列表的总条数
            addDialogVisible: false, //控制添加用户对话框的显示与隐藏
            editDialogVisible: false,  //控制修改用户的对话框的显示与隐藏
            //添加用户对话框表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            //添加用户对话框表单校验规则
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入电话号', trigger: 'blur' },
                    { validator: checkMobile, message: '手机号码格式不正确，请重新输入', trigger: 'blur' }
                ]
            },
            //修改用户对话框表单数据
            editForm: {},
            //修改用户对话框表单校验规则
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入电话号', trigger: 'blur' },
                    { validator: checkMobile, message: '手机号码格式不正确，请重新输入', trigger: 'blur' }
                ]
            },
            //控制分配角色的对话框显示与隐藏
            setRoleDialogVisible: false,
            //需要被分配角色的用户信息
            userInfo: {},
            //所有角色的数据列表
            rolesList: [],
            //当前选中的角色的id
            selectedRoleId: ''
        }
    },
    //生命周期函数
    created() {
        //发起首屏数据请求  调用this.getUserList()函数
        this.getUserList()
    },
    //methods 定义当前组件的一些事件处理函数
    methods: {
        // 发送请求获取用户列表数据
        async getUserList() {
            //发送请求获取用户列表数据
            const { data: res } = await this.$http.get('users', {
                // 这次请求还需要请求一些相关的参数 get参数是用params指定，把这些参数定义到data私有数据里面
                params: this.queryInfo
            })
            //如果返回状态为异常状态则报错并返回
            if (res.meta.status !== 200)
                return this.$message.error('获取用户列表失败')
            //如果返回状态正常，将请求的数据保存在data中
            this.userList = res.data.users;
            this.total = res.data.total;
        },
        // 切换用户状态
        async userStateChanged(row) {
            //发送请求进行状态修改
            const { data: res } = await this.$http.put(
                `users/${row.id}/state/${row.mg_state}`
            )
            //如果返回状态为异常状态则报错并返回
            if (res.meta.status !== 200) {
                row.mg_state = !row.mg_state
                return this.$message.error('修改状态失败')
            }
            this.$message.success('更新状态成功')
        },
        // 展示编辑用户对话框
        async showEditDialog(id) {
            // console.log(id)
            // 发送请求获取用户信息
            const { data: res } = await this.$http.get('users/' + id)
            // 如果返回状态为异常状态则报错并返回
            if (res.meta.status !== 200)
                return this.$message.error('获取用户信息失败')
            // 如果返回状态正常，将请求的数据保存在data中
            this.editForm = res.data;
            // 展示编辑用户对话框
            this.editDialogVisible = true;
        },
        // 发送请求根据id删除用户
        async removeUserById(id) {
            //弹出确定取消框，是否删除用户
            const confirmResult =
                await this.$confirm('请问是否要永久删除该用户', '删除提示', {
                    confirmButtonText: '确认删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => { // 用catch捕获错误    
                    return err
                })
            //简写:.catch(err=>err)
            //如果用户点击确认，则confirmResult 为'confirm'
            //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
            if (confirmResult != "confirm") {
                return this.$message.info("已经取消删除")
            }
            //发送请求根据id完成删除操作
            const { data: res } = await this.$http.delete('users/' + id)
            //判断如果删除失败，就做提示
            if (res.meta.status !== 200) return this.$message.error('删除用户失败')
            //修改成功的提示
            this.$message.success('删除用户成功')
            //重新请求最新的数据
            this.getUserList()
        },
        // 每页显示条数发生改变时触发
        handleSizeChange(newSize) {
            //pagesize改变时触发，当pagesize发生改变的时候，我们应该
            //以最新的pagesize来请求数据并展示数据
            // console.log(newSize)
            this.queryInfo.pagesize = newSize;
            //重新按照pagesize发送请求，请求最新的数据
            this.getUserList();
        },
        // 页码发生改变时触发
        handleCurrentChange(current) {
            //页码发生改变时触发当current发生改变的时候，我们应该
            //以最新的current页码来请求数据并展示数据
            //   console.log(current)
            this.queryInfo.pagenum = current;
            //重新按照pagenum发送请求，请求最新的数据
            this.getUserList();
        },
        // 关闭添加用户对话框
        addDialogClosed() {
            //对话框关闭之后，重置表达
            this.$refs.addFormRef.resetFields();
        },
        // 展示编辑用户对话框
        // showEditDialog() {
        //     this.editDialogVisible = true;
        // },
        // 关闭编辑用户对话框
        editDialogClosed() {
            //对话框关闭之后，重置表达
            this.$refs.editFormRef.resetFields()
        },
        // 编辑用户信息
        addUser() {
            //点击确定按钮，添加新用户
            //调用validate进行表单验证
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error("请填写完整用户信息");
                //发送请求完成添加用户的操作
                const { data: res } = await this.$http.post("users", this.addForm)
                //判断如果添加失败，就做提示
                if (res.meta.status !== 201)
                    return this.$message.error('添加用户失败')
                //添加成功的提示
                this.$message.success("添加用户成功")
                //关闭对话框
                this.addDialogVisible = false
                //重新请求最新的数据
                this.getUserList()
            })
        },
        // 修改用户信息并且提交到服务器
        editUserInfo() {
            //调用validate进行表单验证
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return
                //发送请求完成添加用户的操作
                const { data: res } = await this.$http.put("users/" + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                //判断如果添加失败，就做提示
                if (res.meta.status !== 200) {
                    return this.$message.error('修改用户失败')
                }
                //关闭对话框
                this.editDialogVisible = false
                //重新请求最新的数据
                this.getUserList()
                //提示修改成功 
                this.$message.success("修改用户成功")
            })
        },
        // 展示分配角色对话框
        async setRole(userInfo) {
            this.setRoleDialogVisible = true;
            //在打开对话框之前，先获取所有角色的数据列表
            const { data: res } = await this.$http.get('roles')
            //如果返回状态为异常状态则报错并返回
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败')
            }
            //保存用户信息
            this.userInfo = userInfo;
            //保存角色列表
            this.rolesList = res.data;
        },
        // 关闭分配角色对话框
        setRoleDialogClosed() {
            //当关闭对话框的时候，重置下拉框中类容
            this.selectedRoleId = '';
            this.userInfo = {};
        },
        // 保存角色分配信息
        async saveRoleInfo() {
            //当用户点击确定按钮的时候，发送请求完成角色分配操作
            //判断用户是否选择了需要分配得到角色
            if (!this.selectedRoleId) {
                return this.$message.error('请选择需要分配的角色')
            }
            //发送请求完成角色分配操作
            const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`,
                { rid: this.selectedRoleId })
            console.log(res)
            //判断如果分配失败，就做提示
            if (res.meta.status !== 200)
                return this.$message.error('分配角色失败' + res.meta.msg)
            //分配成功的提示
            this.$message.success('分配角色成功')
            //重新请求最新的数据
            this.getUserList()
            //关闭对话框
            this.setRoleDialogVisible = false;

        }
    }
}
</script>