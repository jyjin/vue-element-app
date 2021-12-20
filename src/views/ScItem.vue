<script>
// @ is an alias to /src
import {
	ElMessage,
	ElSpace,
	ElDialog,
	ElTag,
	ElLink,
	ElIcon,
	ElUpload,
	ElTable,
	ElTableColumn,
} from 'element-plus';
import { ref, defineComponent } from 'vue';
import HelloWorld from '../components/HelloWorld.vue';
import TenantConfig from '../components/TenantConfig.vue';
import StreamDownload from '../utils/streamDownload';
import { Home } from '@icon-park/vue-next';
let loading = null;
export default {
	name: 'ScItem',
	components: {
		HelloWorld,
		TenantConfig,
		ElSpace,
		ElDialog,
		ElTag,
		ElLink,
		ElIcon,
		ElUpload,
		ElTable,
		ElTableColumn,
		Home,
	},
	data() {
		return {
			title: '服务项',
			mode: 'TMPL', // TMPL or TRANS
			openDnlCfm: false,
			openSetting: false,
			openTransCfm: false,
			openUpload: false,
			refresh: 1,
			upload: {
				auto: false,
				uploadUrl: 'http://localhost:30010/items/upload',
				uploadData: { file: 'file' },
				uploadHeader: { 'migration-token': 'jyjin' },
			},
			queryTable: [],
			queryTableColumns: [],
			insertTable: [],
			insertTableColumns: [],
		};
	},
	async mounted() {},
	methods: {
		onSuccess(res) {
			loading && loading.close();
			this.queryTable = [res.data.query];
			this.queryTableColumns = Object.keys(res.data.query);
			this.insertTable = [res.data.insert];
			this.insertTableColumns = Object.keys(res.data.insert);
		},
		clickTmpl() {
			this.mode = 'TMPL';
			if (
				!this.$app.from.tenant ||
				!this.$app.from.env ||
				!this.$app.to.tenant ||
				!this.$app.to.env
			) {
				this.openSetting = true;
			} else {
				this.openDnlCfm = true;
			}
		},

		async fetchDownload() {
			if (
				!this.$app.from.tenant ||
				!this.$app.from.env ||
				!this.$app.to.tenant ||
				!this.$app.to.env
			) {
				ElMessage({
					message: '请先配置环境',
					type: 'warning',
				});
				return;
			}

			const params = {
				from: this.$app.from.env,
				to: this.$app.to.env,
				tenantFrom: this.$app.from.tenant,
				tenantTo: this.$app.to.tenant,
				fromName: this.$app.from.envName,
				toName: this.$app.to.envName,
				tenantFromName: this.$app.from.tenantName,
				tenantToName: this.$app.to.tenantName,
			};
			const loading = this.$loading.service({
				lock: true,
				text: 'Downloading...',
				background: 'rgba(0, 0, 0, 0.7)',
			});
			const { data } = await this.$axios.get('/items/export?fields=id,name', {
				params,
				responseType: 'arraybuffer',
			});
			loading.close();
			StreamDownload(data);
			this.openDnlCfm = false;
		},

		onSaveConfig() {
			this.openSetting = false;
			if (this.openDnlCfm === false) {
				if (this.mode === 'TMPL') {
					this.openDnlCfm = true;
				} else {
					this.openTransCfm = true;
				}
			}
		},

		clickTransfer() {
			this.mode = 'TRANS';
			this.openUpload = true;
		},

		startUpload() {
			if (
				!this.$app.from.tenant ||
				!this.$app.from.env ||
				!this.$app.to.tenant ||
				!this.$app.to.env
			) {
				this.openSetting = true;
				return;
			}

			if (this.$app.to.env === 'preprod' || this.$app.to.env === 'prod') {
				return;
			}
			this.openTransCfm = true;
		},

		continueTransport() {
			this.openTransCfm = false;
			this.openUpload = false;
			loading = this.$loading.service({
				text: `${this.title}迁移中...`,
			});
			this.$refs.upload.submit();
		},
	},
};
</script>

<style lang="less">
.cfm-text {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>

<template>
	<div class="home">
		<div style="height: 20px"></div>
		<ElButton type="success" @click="clickTmpl"
			>下载{{ title }}迁移模板</ElButton
		>
		<ElButton type="warning" @click="clickTransfer">迁移{{ title }}</ElButton>
		<ElButton type="warning" @click="test">test{{ title }}</ElButton>
		<div style="width:100%">
			<div v-if="queryTableColumns.length">
				<b>Query:</b>
				<el-table
					:data="queryTable"
					stripe
					style="width: calc(100vw - 268px)"
					v-bind:key="col"
				>
					<el-table-column
						v-for="col in queryTableColumns"
						width="200"
						:fixed="$index === 0"
						:key="col"
						:prop="col"
						:label="col"
					/>
				</el-table>
			</div>
			<div v-if="insertTableColumns.length">
				<b>Insert:</b>
				<el-table
					:data="queryTable"
					stripe
					style="width: calc(100vw - 268px)"
					v-bind:key="col"
				>
					<el-table-column
						v-for="col in insertTableColumns"
						:key="col"
						:prop="col"
						:label="col"
					/>
				</el-table>
			</div>
		</div>
	</div>

	<!-- 下载检查 -->
	<el-dialog
		:key="refresh"
		v-model="openDnlCfm"
		:close-on-click-modal="false"
		title="环境信息检查"
		width="30%"
	>
		<div class="cfm-text">
			您正在下载
			<el-link type="primary" @click="openSetting = true"
				>【{{ this.$app.from.envName }}】</el-link
			>-
			<el-link type="success" @click="openSetting = true"
				>【{{ this.$app.from.tenantName }}】</el-link
			>
			租户的{{ title }}模板
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="openDnlCfm = false">取消</el-button>
				<el-button type="warning" @click="openSetting = true"
					>配置环境</el-button
				>
				<el-button type="primary" @click="fetchDownload">下载</el-button>
			</span>
		</template>
	</el-dialog>

	<!-- 配置页面 -->
	<el-dialog
		v-model="openSetting"
		:close-on-click-modal="false"
		title="环境配置"
		width="50%"
		@close="refresh += 1"
	>
		<TenantConfig />
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="onSaveConfig">保存</el-button>
			</span>
		</template>
	</el-dialog>

	<!-- 迁移参数 -->
	<el-dialog
		v-model="openUpload"
		:close-on-click-modal="false"
		title="迁移模板"
		width="30%"
		@close="refresh += 1"
	>
		<el-upload
			ref="upload"
			class="upload-demo"
			drag
			accept="*.xls"
			:auto-upload="upload.auto"
			:headers="upload.uploadHeader"
			:action="upload.uploadUrl"
			:data="upload.uploadData"
			:onSuccess="onSuccess"
			multiple
		>
			<el-icon class="el-icon--upload"><upload-filled /></el-icon>
			<div class="el-upload__text">拖动文件到此处 <em>或者点击上传</em></div>
			<template #tip>
				<div class="el-upload__tip">excel文件不超过500kb</div>
			</template>
		</el-upload>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="openUpload = false">取消</el-button>
				<el-button type="primary" @click="startUpload">开始迁移</el-button>
			</span>
		</template>
	</el-dialog>

	<!-- 迁移检查 -->
	<el-dialog
		:key="refresh1"
		v-model="openTransCfm"
		:close-on-click-modal="false"
		title="环境信息检查"
		width="30%"
	>
		<div class="cfm-text">
			您正在迁移
			<el-link type="primary" @click="openSetting = true"
				>【{{ this.$app.from.envName }}】</el-link
			>-
			<el-link type="success" @click="openSetting = true"
				>【{{ this.$app.from.tenantName }}】</el-link
			>
		</div>
		<div class="cfm-text">
			的{{ title }}到
			<el-link type="primary" @click="openSetting = true"
				>【{{ this.$app.to.envName }}】</el-link
			>-
			<el-link type="success" @click="openSetting = true"
				>【{{ this.$app.to.tenantName }}】</el-link
			>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="openTransCfm = false">取消</el-button>
				<el-button type="danger" @click="continueTransport">确定导入</el-button>
			</span>
		</template>
	</el-dialog>
</template>
