<template>
	<div v-bind:class="isCollapse ? 'menu menu-collapse' : 'menu'">
		<!-- 菜单搜索 -->
		<el-radio-group v-model="isCollapse">
			<div class="menu-search">
				<el-input
					v-if="!isCollapse"
					v-model="search"
					placeholder="搜索"
					debounce="300"
					@keyup="onSearch"
					class="search-menu"
				>
					<template #prefix>
						<search theme="outline" size="14" fill="#e8e8e8" />
					</template>
				</el-input>
				<div
					style="padding: 2px 0 2px 4px; cursor: pointer"
					@click="handleCollpase"
				>
					<menu-unfold
						v-if="isCollapse"
						theme="outline"
						size="18"
						fill="#303133"
					/>
					<menu-fold v-else theme="outline" size="18" fill="#303133" />
				</div>
			</div>
		</el-radio-group>
		<!-- 菜单 -->
		<!-- 这里必须传字符串数组，组件的bug。不用bind就会解析成'[x,x]'字符串，然后报错  -->

		<el-menu
			:default-openeds="opened"
			class="el-menu-vertical-demo"
			:collapse="isCollapse"
			router
			v-for="menu in menus"
			:key="menu.id"
		>
			<el-sub-menu :index="menu.id">
				<template #title>
					<home size="16"></home>
					<span>{{ menu.name }}</span>
				</template>

				<el-menu-item-group v-for="ctgy in menu.category" :key="ctgy.id">
					<template #title
						><span>{{ ctgy.name }}</span></template
					>
					<el-menu-item
						v-for="route in ctgy.items"
						:key="route.path"
						:index="route.path"
						>{{ route.name }}</el-menu-item
					>
				</el-menu-item-group>
			</el-sub-menu>
		</el-menu>
	</div>
</template>
<script>
import { reactive, ref } from 'vue';
import { Home, MenuFold, MenuUnfold, Search } from '@icon-park/vue-next';
import { routes, menus } from '../router';
function calc(menus, routes) {
	menus.map((menu) => {
		menu.category.map((item) => {
			let items = [];
			routes.map((route) => {
				if (route.parentId === item.id) {
					items.push(route);
				}
			});
			item.items = [...items];
		});
	});

	return menus;
}

export default {
	name: 'Menu',
	components: {
		Home,
		MenuFold,
		MenuUnfold,
		Search,
	},
	data() {
		return {
			isCollapse: ref(false),
			menu: ref(''),
			menuData: [],
		};
	},
	methods: {
		handleCollpase() {
			this.isCollapse = !this.isCollapse;
		},
		// onSearch(e) {
		// 	console.log('search == ', menu, menus);

		// 	// let _routes = routes.filter(
		// 	// 	(item) => item.name.indexOf(this.menus) > -1 && !item.parentId
		// 	// );

		// 	// let _menus = calc(menus, _routes);
		// 	// menus = [..._menus];
		// },
	},
	setup() {
		let search = ref('');
		let allMenus = calc(menus, routes);
		console.log('mens ==', allMenus);

		function onSearch(e) {
			console.log('search == ', search, menus);

			let _routes = routes.filter(
				(item) => item.name.indexOf(search) > -1 && !item.parentId
			);

			let _menus = calc(menus, _routes);

			_menus = _menus.filter((menu) => {
				return (
					menu.category.filter((ctgy) => {
						return ctgy.items.length > 0;
					}).length > 0
				);
			});

			console.log('taget == ', _menus);

			allMenus = [..._menus];
			return {
				menus: reactive(allMenus),
			};
		}

		return {
			opened: allMenus.map((item) => item.id),
			menus: reactive(allMenus),
			search,
			onSearch,
		};
	},
};
</script>
<style lang="less">
.menu {
	width: 228px;
	border-right: 1px solid #e8e8e8;
	background-color: #f7f7f7;
	height: 100%;
	text-align: left;
	transition: all linear 0.3s;

	&-collapse {
		width: 48px;
	}
	.el-menu {
		border-right: none;
		background-color: #f7f7f7;
	}

	.el-menu--collapse {
		width: 48px;
	}

	.override-menu-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		visibility: visible;
		overflow: visible;
		width: 30px;
		height: 100%;
		margin: 0 -4px;
	}

	span.i-icon {
		.override-menu-icon;

		svg {
			display: inline-block;
			margin-top: -2px;
		}
	}

	.el-menu--collapse > .el-menu-item span.i-icon,
	.el-menu--collapse > .el-sub-menu > .el-sub-menu__title span.i-icon {
		.override-menu-icon;
	}

	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 228px;
	}

	.menu-search {
		padding: 10px 10px;
		min-height: 32px;
		border-bottom: 1px solid #e8e8e8;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.search-menu {
		height: 32px;
		background: #fff;

		.el-input__inner {
			height: 32px;
		}
	}
}
</style>
