<script>
// import global from './global'
import { routes } from './router';
import { ElLink, ElIcon } from 'element-plus';
import TenantConfig from './components/TenantConfig.vue';
import Menu from './components/Menu.vue';

export default {
	name: 'App',
	provide: {
		// ...global
	},
	components: {
		TenantConfig,
	},
	data() {
		return {
			routes,
			mode: import.meta.env.MODE,
			dev: import.meta.env.DEV,
			prod: import.meta.env.PROD,
			baseUrl: import.meta.env.BASE_URL,
			pdev: process.env.NODE_ENV,
			env: import.meta.env.VITE_NAME,
			openSetting: false,
		};
	},
	setup(props) {
		const normalMenu = routes.filter((route) => !route.parentId);
		return { normalMenu };
	},
	methods: {
		setting() {
			this.openSetting = !this.openSetting;
		},
	},
};
</script>

<template>
	<div class="web">
		<div class="header">
			<div class="left">YQCOULD MIGRATION</div>
			<div class="nav">
				<router-link
					class="nav-item"
					v-for="item in normalMenu"
					v-bind:key="item.path"
					v-bind:to="item.path"
				>
					{{ item.name }}
				</router-link>
			</div>
			<div class="right">
				<ElButton type="ghost">
					<router-link to="/config">环境配置</router-link>
				</ElButton>
			</div>
		</div>
		<TenantConfig v-if="openSetting" />
		<div v-else class="page">
			<Menu />
			<div class="main">
				<router-view />
			</div>
		</div>
		<!-- <div v-if="dev">dev mode</div>
		<el-button>el-button</el-button>
		<div>env: {{ env }}</div>
		<div>mode: {{ mode }}</div>
		<div>dev: {{ dev }}</div>
		<div>prod: {{ prod }}</div> -->
	</div>
</template>

<style lang="less">
body {
	margin: 0;
	padding: 0;
	font-family: 'Monospaced Number', 'Chinese Quote', -apple-system,
		BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB',
		'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

@white: #fff;

.web {
	display: flex;
	flex-direction: column;
	height: 100vh;
}
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #2196f3;
	height: 60px;
	color: @white;

	.left,
	.right {
		width: 200px;
	}

	.left {
		font-size: 20px;
		line-height: 20px;
	}
	.nav {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		font-size: 24px;
		&-item {
			margin: 0 30px;
			color: @white;
			text-decoration: none;
			&:hover {
				color: #67c23a;
			}
		}
	}
}

.page {
	display: flex;
	flex-grow: 1;

	.main {
		flex-grow: 1;
		padding: 20px;
		max-width: calc(100vw - 228px);
		overflow: auto;
	}
}
</style>
