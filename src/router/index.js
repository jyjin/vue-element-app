import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import ScItem from '../views/ScItem.vue'
import Me from '../views/Me.vue'
import TenantConfig from '../components/TenantConfig.vue'

// these are passed to `createRouter`
export const routes = [{
  path: '/sc/item',
  name: '服务项',
  parentId: 11,
  component: ScItem
}, {
  path: '/business/object',
  name: '业务对象',
  parentId: 41,
  component: ScItem
}, {
  path: '/lookup',
  name: '选项集',
  parentId: 31,
  component: ScItem
}, {
  path: '/state',
  name: '状态',
  parentId: 42,
  component: ScItem
},
{
  path: '/view',
  name: '视图',
  parentId: 42,
  component: ScItem
},
{
  path: '/qalib',
  name: '问答库',
  parentId: 52,
  component: ScItem
}, {
  path: '/me',
  name: '关于我',
  parentId: '',
  component: Me
}, {
  path: '/config',
  name: '配置',
  parentId: '',
  component: TenantConfig
}]

export const menus = [{
  id: 1,
  name: '服务目录',
  icon: 'home',
  category: [{
    id: 11,
    name: '服务管理'
  }, {
    id: 12,
    name: '动作管理'
  }]
}, {
  id: 2,
  name: '组织架构',
  icon: 'home',
  category: [{
    id: 21,
    name: '人员'
  }]
}, {
  id: 3,
  name: '系统管理',
  icon: 'home',
  category: [{
    id: 31,
    name: '通用'
  }]
}, {
  id: 4,
  name: '应用设计',
  icon: 'home',
  category: [{
    id: 41,
    name: '基础'
  }, {
    id: 42,
    name: '设计'
  }]
}, {
  id: 5,
  name: '知识',
  icon: 'home',
  category: [{
    id: 51,
    name: '知识库'
  }, {
    id: 52,
    name: '智能问答'
  }]
}]


const router = createRouter({
  // history: createWebHashHistory(''),
  history: createWebHistory(''),
  routes
})

export default router