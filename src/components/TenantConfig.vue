<template>
	<div class="home">
		<div>
			<el-row :gutter="0" justify="start" class="row">
				<el-col :span="2" class="label">从:</el-col>
				<el-col :span="20" :push="1">
					<el-select
						class="env-from"
						v-model="envFromId"
						filterable
						clearable
						placeholder="开始环境"
						@change="envFromChange"
					>
						<el-option
							v-for="item in env"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
						</el-option>
					</el-select>
					<el-select
						class="tenant-from"
						v-model="tenantFromId"
						filterable
						clearable
						placeholder="开始租户"
						@change="tenantFromChange"
					>
						<el-option
							v-for="item in tenantFrom"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-col>
			</el-row>
			<el-row :gutter="0" justify="start" class="row">
				<el-col :span="2" class="label">迁移至:</el-col>
				<el-col :span="20" :push="1">
					<el-select
						key="envTo"
						class="env-to"
						v-model="envToId"
						filterable
						clearable
						placeholder="结束环境"
						@change="envToChange"
					>
						<el-option
							v-for="item in env"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
						</el-option>
					</el-select>
					<el-select
						key="to"
						class="tenant-to"
						v-model="tenantToId"
						filterable
						clearable
						placeholder="结束租户"
						@change="tenantToChange"
					>
						<el-option
							v-for="item in tenantTo"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import { ref, defineComponent } from 'vue';
import { ElSelect, ElRow, ElCol, ElLoading } from 'element-plus';
import HelloWorld from '../components/HelloWorld.vue';
import { ENVIRONMENTS } from '../constants';
export default {
	name: 'ScItem',
	inject: ['from', 'to'],
	components: {
		HelloWorld,
		ElSelect,
		ElRow,
		ElCol,
	},
	data() {
		return {
			env: ENVIRONMENTS,
			tenantFrom: [],
			tenantTo: [],
			envFromId: ref(this.$app.from.env),
			envToId: ref(this.$app.to.env),
			tenantFromId: ref(this.$app.from?.tenant || ''),
			tenantToId: ref(this.$app.to?.tenant || ''),
		};
	},
	async beforeMount() {
		this.fetchTenantFrom();
		this.fetchTenantTo();
	},
	methods: {
		async fetchTenantFrom() {
			const params = {
				from: this.envFromId,
			};
			const loading = this.$loading.service({
				lock: true,
				text: 'Loading...',
				background: 'rgba(0, 0, 0, 0.7)',
			});
			const { data: fromData } = await this.$axios.get('/common/tenant/from', {
				params,
			});
			if (fromData.res > 0) {
				this.tenantFrom = fromData.data;
			}
			loading.close();
		},
		async fetchTenantTo() {
			const params = {
				to: this.envToId,
			};
			const { data: toData } = await this.$axios.get('/common/tenant/to', {
				params,
			});
			if (toData.res > 0) {
				this.tenantTo = toData.data;
			}
		},

		envFromChange(val) {
			this.tenantFromId = '';
			this.$app.from.env = val;
			this.$app.from.envName = ENVIRONMENTS.find((v) => v.id === val).name;
			this.fetchTenantFrom();
			this.saveToStorage();
		},
		envToChange(val) {
			this.tenantToId = '';
			this.$app.to.env = val;
			this.$app.to.envName = ENVIRONMENTS.find((v) => v.id === val).name;
			this.fetchTenantTo();
			this.saveToStorage();
		},
		tenantFromChange(val) {
			this.$app.from.tenant = val;
			this.$app.from.tenantName = this.tenantFrom.find(
				(v) => v.id === val
			).name;
			this.saveToStorage();
		},
		tenantToChange(val) {
			this.$app.to.tenant = val;
			this.$app.to.tenantName = this.tenantTo.find((v) => v.id === val).name;
			this.saveToStorage();
		},
		saveToStorage() {
			localStorage.setItem('tenantConfig', JSON.stringify(this.$app));
		},
	},
};
</script>

<style lang="less">
.row {
	margin-bottom: 20px;
	align-items: center;
}
.label {
	text-align: right;
}
.tenant {
	&-from,
	&-to {
		width: 50%;
	}
}
.env {
	&-from,
	&-to {
		width: 49%;
		margin-right: 1%;
	}
}
</style>
