<!-- 角色列表组件 -->
<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col><el-button type="primary" @click="addDialogVisible = true">添加角色</el-button></el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 循环渲染权限列表 -->
                        <el-row :class="['bdbotton', index === 0 ? 'bdtop' : '', 'vcenter', 'rows']"
                            v-for="(item1, index) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 循环渲染二.三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                                    v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{
                                            item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id"
                                            closable @close="removeRightByid(scope.row, item3.id)">
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-deit" size="mini"
                            @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeRolesByid(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting"
                            @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限弹窗 -->
        <el-dialog :visible.sync="setRightDialogVisible" title="分配权限" width="50%" @close="setRightDialogClosed">
            <!-- 类容主题区域 -->
            <!-- 树形控件 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true"
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <!-- <pre>{{ rightsList }}</pre> -->
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加角色对话框 -->
        <el-dialog :visible.sync="addDialogVisible" title="添加角色" width="50%" @close="addDialogClosed">
            <!-- 内容主题区域 -->
            <el-form ref="addFormRef" :model="addRoleForm" label-width="80px" :rules="addFormRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog :visible.sync="editDialogVisible" title="编辑角色" width="50%" @close="editDialogClosed">
            <!-- 内容主题区域 -->
            <el-form ref="editFormRef" :model="editRoleForm" label-width="80px" :rules="editFormRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.rows {
    width: 90%;
    margin: 0 auto;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>

<script>
export default {
    // 定义数据
    data() {
        return {
            rolelist: [],// 角色列表
            setRightDialogVisible: false,// 分配权限弹窗
            rightsList: [],// 权限列表
            treeProps: {
                children: 'children',// 子节点的属性名
                label: 'authName'// 标签的属性名
            },
            // 默认选中的节点id数组
            defKeys: [],
            //当前即将分配权限的角色id
            roleId: '',
            //添加角色对话框是否可见
            addDialogVisible: false,
            //添加角色对象的表单数据
            addRoleForm: {
                roleName: '',
                roleDesc: ''
            },
            //添加角色表单验证
            addFormRules: {
                roleName: [
                    {
                        required: true, message: '请输入角色名', trigger: 'blur'
                    }
                ],
                roleDesc: [
                    {
                        required: true, message: '请输入描述信息', trigger: 'blur'
                    }
                ],
            },
            //编辑角色对话框是否可见
            editDialogVisible: false,
            //添加角色对象的表单数据
            editRoleForm: {
                roleId: 0,
                roleName: '',
                roleDesc: ''
            },
            //添加角色表单验证
            editFormRules: {
                roleName: [
                    {
                        required: true, message: '请输入角色名', trigger: 'blur'
                    }
                ],
                roleDesc: [
                    {
                        required: true, message: '请输入描述信息', trigger: 'blur'
                    }
                ],
            }
        }
    },
    // 定义方法
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取角色列表
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            // 如果返回状态为异常状态则报错返回
            if (res.meta.status !== 200)
                return this.$message.error('获取角色列表失败')
            // 如果返回状态为正常状态，将请求数据保存在data中
            this.rolelist = res.data
            console.log(res);
        },
        // 删除权限
        async removeRightByid(role, rightId) {
            //弹窗提示用户是否要删除
            const confirmResult = await this.$confirm('请问是否要删除该权限', '删除提示', {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            //如果用户点击确认删除按钮 则confirmResult的值为'confirm'
            //如果用户点击取消按钮 则confirmResult的值为'cancel'
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            // 用户点击了确定表示真的要删除
            // 当发送delete请求之后，返回的数据就是最新的角色权限信息
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            // 如果返回状态为异常状态则报错返回
            if (res.meta.status !== 200)
                return this.$message.error('删除角色权限失败')
            //为了防止页面刷新，无需再重新加载所有权限
            //只需要对现有的角色权限进行更新即可
            role.children = res.data
            // this.getRolesList();
        },
        // 展示分配权限弹窗
        async showSetRightDialog(role) {
            // 保存当前即将分配权限的角色id
            this.roleId = role.id
            // 点击分配按钮展示弹窗
            this.setRightDialogVisible = true
            // 获取权限列表
            const { data: res } = await this.$http.get('rights/tree')
            // 如果返回状态为异常状态则报错返回
            if (res.meta.status !== 200)
                return this.$message.error('获取权限列表失败')
            // 如果返回状态为正常状态，将请求数据保存在data中
            this.rightsList = res.data
            //递归获取三级节点的id
            this.getLeafKeys(role, this.defKeys)
        },
        // 递归获取三级节点的id
        // 并且保存到defKeys中
        getLeafKeys(node, arr) {
            //如果当前node节点不包含children属性，则说明当前节点为三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        // 监听分配权限弹窗的关闭事件
        setRightDialogClosed() {
            this.defKeys = [] //清空当前用户的权限
        },
        // 点击按钮，发送请求到服务器，为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            // console.log(key);
            // 把id用英文逗号进行拼接
            const idStr = keys.join(',')
            // 发送请求
            const {data: res} = await this.$http.post('roles/'+this.roleId+'/rights',{rids:idStr});
            // 如果返回状态为异常状态则报错返回
            if (res.meta.status !== 200) {
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            // 关闭弹窗
            this.setRightDialogVisible = false
            // 刷新页面
            this.getRolesList()
        },
        // 关闭添加角色的对话框
        addDialogClosed() {
            // 关闭对话框之后，重置表单
            this.$refs.addFormRef.resetFields()
        },
        // 添加角色
        addRole() {
            //点击确定按钮，添加新角色
            //调用validate方法，进行表单验证
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请填写完整角色信息')
                //发送请求
                const { data: res } = await this.$http.post('roles', this.addRoleForm)
                //如果返回状态为异常状态则报错返回
                if (res.meta.status !== 201)
                    return this.$message.error('添加角色失败')
                //如果返回状态为正常状态，添加角色成功
                this.$message.success('添加角色成功')
                //关闭对话框
                this.addDialogVisible = false
                //刷新页面
                this.getRolesList()
            })
        },
        // 添加编辑角色的对话框
        editDialogClosed() {
            // 关闭对话框之后，重置表单
            this.$refs.editFormRef.resetFields()
        },
        // 编辑角色
        editRole() {
            //点击确定按钮，添加新角色
            //调用validate方法，进行表单验证
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请填写完整角色信息')
                //发送请求
                const { data: res } = await this.$http.put("roles/" + this.editRoleForm.roleId,
                    {
                        roleName: this.editRoleForm.roleName,
                        roleDesc: this.editRoleForm.roleDesc,
                    })
                //如果返回状态为异常状态则报错返回
                if (res.meta.status !== 200)
                    return this.$message.error('编辑角色失败')
                //如果返回状态为正常状态，添加角色成功
                this.$message.success('编辑角色成功')
                //关闭对话框
                this.editDialogVisible = false
                //刷新页面
                this.getRolesList()
            })
        },
        // 打开编辑角色的对话框
        async showEditDialog(id) {
            //发送请求根据id获取角色信息
            const { data: res } = await this.$http.get("roles/" + id)
            //如果返回状态为异常状态则报错返回
            if (res.meta.status !== 200)
                return this.$message.error('获取角色信息失败')
            //如果返回状态为正常状态，获取角色信息成功
            this.editRoleForm = res.data
            //显示弹出框
            this.editDialogVisible = true
        },
        // 根据id删除角色
        async removeRolesByid(id) {
            const confirmResult =
                await this.$confirm('请问是否永久删除该角色', '提示删除', {
                    confirmButtonText: '确认删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => { //用catch捕获错误信息
                    return err
                })
            //简写:.catch(err => err)
            //如果用户点击确认删除按钮 则confirmResult的值为'confirm'
            //如果用户点击取消按钮 则confirmResult的值为'cancel'
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            //发送请求根据id完成操作
            const { data: res } = await this.$http.delete("roles/" + id)
            //如果返回状态为异常状态则报错返回
            if (res.meta.status !== 200)
                return this.$message.error('删除角色失败')
            //如果返回状态为正常状态，删除角色成功
            this.$message.success('删除角色成功')
            //刷新页面
            this.getRolesList()
        }
    }
}
</script>