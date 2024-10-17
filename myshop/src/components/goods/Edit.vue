<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert title="编辑商品信息" type="info" center show-icon :closable="false">

            </el-alert>

            <!-- 步骤条区域 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 表单区域 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px"
                label-position="top">
                <!-- 商品名称 -->
                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave"
                    @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="editForm.goods_name"></el-input>
                        </el-form-item>
                        <!-- 商品价格 -->
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="editForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <!-- 商品重量 -->
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="editForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <!-- 商品数量 -->
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="editForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <!-- 商品分类 -->
                        <el-form-item label="商品分类" prop="good_cat">
                            <el-cascader expand-trigger="hover" v-model="editForm.good_cat" :options="cateList"
                                :props="cateProps" @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>


                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"
                                    border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品图片" name="3">
                        <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="uploadHeaders"
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="editForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnEdit" @click="editGoods">编辑商品</el-button>
                    </el-tab-pane>

                </el-tabs>
            </el-form>

        </el-card>

    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: 0,
            editForm: {
                // 商品名称
                goods_name: '',
                // 商品价格
                goods_price: 0,
                // 商品数量
                goods_number: 0,
                // 商品重量
                goods_weight: 0,
                // 商品分类
                good_cat: [],
                // 商品图片
                pics: [],
                // 商品介绍
                goods_introduce: '',
                // 商品属性
                attrs: []
            },
            editFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                good_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' },
                ]
            },
            cateList: [],
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            manyTableData: [],
            onlyTableData: [],
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            uploadHeaders: {
                Authorization: window.sessionStorage.getItem('token')
            },
            previewPath: '',
            previewVisible: false
        }
    },
    created() {
        this.getCate()
        this.getCateList()
    },
    methods: {
        async getCate() {
            const { data: res } = await this.$http.get(`goods/${sessionStorage.getItem('editId')}`)
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品信息失败')
            }
            this.editForm = res.data
            this.editForm.good_cat = [res.data.cat_one_id, res.data.cat_two_id, res.data.cat_three_id]
            this.manyTableData = res.data.attrs.filter(item => item.attr_sel === 'many')
            this.onlyTableData = res.data.attrs.filter(item => item.attr_sel === 'only')
        },
        async getCateList() {
            // 发起请求获取商品分类列表
            const { data: res } = await this.$http.get('categories')
            // 如果请求失败，则返回错误信息
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败')
            }
            // 将获取到的商品分类列表赋值给cateList
            this.cateList = res.data
        },
        handleChange() {
            // 打印当前选择的商品分类
            console.log(this.editForm.good_cat)
            // 如果选择的商品分类不是3级，则清空选择的商品分类
            if (this.editForm.good_cat.length !== 3) {
                this.editForm.good_cat = []
            }
        },
        beforeTabLeave(activeName, oldActiveName) {
            // 如果离开的标签页是第一个，并且选择的商品分类不是3级，则返回错误信息
            if (oldActiveName === '0' && this.editForm.good_cat.length !== 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
        },
        async tabClicked() {
            // 打印当前激活的标签页的索引
            console.log(this.activeIndex);

            // 如果激活的标签页是第二个，则发起请求获取动态参数列表
            if (this.activeIndex === '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
                // 如果请求失败，则返回错误信息
                if (res.meta.status !== 200) {
                    return this.$message.error('获取动态参数列表失败')
                }
                // 将获取到的动态参数列表中的attr_vals字段转换为数组
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                // 将转换后的动态参数列表赋值给manyTableData
                this.manyTableData = res.data
                // 打印转换后的动态参数列表
                console.log(this.manyTableData);

                // 如果激活的标签页是第三个，则发起请求获取静态属性列表
            } else if (this.activeIndex === '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
                // 如果请求失败，则返回错误信息
                if (res.meta.status !== 200) {
                    return this.$message.error('获取静态属性列表失败')
                }
                // 将获取到的静态属性列表赋值给onlyTableData
                this.onlyTableData = res.data
            }
        },
        beforeLeave(activeName, oldActiveName) {
            // 如果离开的标签页是第一个，并且选择的商品分类不是3级，则返回错误信息
            if (oldActiveName === '0' && this.editForm.good_cat.length !== 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
        },
        handlePreview(file) {
            // 将预览的图片赋值给headerObj
            this.headerObj = file
            // 显示预览图片
            this.previewVisible = true
        },
        handleRemove(file) {
            // 打印删除的文件
            console.log(file);
            // 获取删除的文件的路径
            const filePath = file.response.data.tmp_path
            // 获取删除的文件的索引
            const i = this.editForm.pics.findIndex(x => x.pic === filePath)
            // 删除该文件
            this.editForm.pics.splice(i, 1)
        },
        handleSuccess(response) {
            // 打印上传成功的文件
            console.log(response);
            // 将上传成功的文件路径赋值给picInfo
            const picInfo = { pic: response.data.tmp_path }
            // 将picInfo添加到pics数组中
            this.editForm.pics.push(picInfo)
        },
        editGoods() {
            this.$refs.editFormRef.validate(async valid => {
                // 如果验证不通过，则返回错误信息
                if (!valid) {
                    return this.$message.error('请填写必要的表单项')
                }
                // 将editForm中的good_cat字段转换为字符串
                this.editForm.good_cat = this.editForm.good_cat.join(',')
                // 发起请求，修改商品信息
                const { data: res } = await this.$http.put(`goods/${this.editForm.goods_id}`, this.editForm)
                // 如果请求失败，则返回错误信息
                if (res.meta.status !== 200) {
                    return this.$message.error('修改商品信息失败')
                }
                // 修改成功，跳转到商品列表页面
                this.$message.success('修改商品信息成功')
                this.$router.push('/goods')
            })
        }


    }, computed: {
        // 计算商品分类的id
        cateId() {
            // 如果选择的商品分类是3级，则返回第三级的id
            if (this.editForm.good_cat.length === 3) {
                return this.editForm.good_cat[2]
            }
            // 否则返回null
            return null
        }
    }
}
</script>

<style scoped>
.btnEdit {
    margin-top: 15px;
}

.el-checkbox {
    margin: 0 10px 0 0 !important;
}

.previewImg {
    width: 100%;
}
</style>