<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>

    </div>
</template>

<script>
// 1. 导入 echarts
// import echarts from 'echarts' 项目会报错
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
    data() {
        return {
            // 需要合并的数据
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    created() { },
    // 此时，页面上的元素，已经被渲染完毕了！所以要将初始化放到这里 而不是created里
    async mounted() {
        // 3. 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'))

        // 服务器请求的数据不完整（没有鼠标跟随的效果） 还要和option对象合并（使用lodash） 将合并的对象传给echarts展示
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status !== 200) {
            console.log(res.data)
            return this.$message.error('获取折线图数据失败！')
        }
        console.log(res.data)

        // 4. 准备数据和配置项
        const result = _.merge(res.data, this.options)

        // 5. 展示数据
        myChart.setOption(result)
    },
    methods: {}
}
</script>

<style lang="less" scoped></style>