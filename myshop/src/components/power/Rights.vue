<!-- 权限列表组件 -->
<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 表格区域 -->
            <el-table :data="rightsList" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="autName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级" width="180">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag v-if="scope.row.level === '1'" type="success">二级权限</el-tag>
                        <el-tag v-if="scope.row.level === '2'" type="warning">三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>


<style></style>

<script>
export default {
    // 定义数据
    data() {
        return {
            rightsList: []
        }
    },
    // 定义方法
    created() {
        this.getRightsList()
    },
    methods: {
        // 获取权限列表
        async getRightsList() {
            const { data: res } = await this.$http.get('rights/list')
            // 如果返回状态为异常状态则报错返回
            if (res.meta.status !== 200)
                return this.$message.error('获取权限列表失败')
            // 如果返回状态为正常状态，将请求数据保存在data中
            this.rightsList = res.data
        }
    }
}
</script>
