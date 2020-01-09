<template>
  <main-frame>
    <div class="page-search">
      <el-form
          class="toolbar">
        <search-input
            :text="q" />
        <el-form-item
            label="位置">
          <el-select
              v-model="filter.source"
              multiple
              @change="search">
            <el-option
                v-for="item in sourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
            label="类型">
          <el-select
              v-model="filter.suffixs"
              multiple
              clearable
              placeholder="不限"
              @change="search">
            <el-option
                v-for="item in suffixOptions"
                :key="item"
                :label="item"
                :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
            label="时间">
          <el-select
              v-model="filter.time"
              clearable
              placeholder="不限"
              @change="search">
            <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
          class="file-table"
          :data="data">
        <el-table-column
            prop="type"
            width="70">
          <template>
            <i class="iconfont icon-folder-add"></i>
          </template>
        </el-table-column>
        <el-table-column
            label="文件名称">
          <template
              slot-scope="scope">
            <i
                v-if="scope.row.mark"
                class="iconfont icon-star-o"></i>
            <a
                v-if="scope.row.file.dir"
                :href="`/?path=${scope.row.file.path}`">{{ scope.row.file.name }}</a>
            <span
                v-else>{{ scope.row.file.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="文件大小"
            width="100">
          <template
              slot-scope="scope">
            <span>{{ scope.row.file.size | filesize }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="修改时间"
            width="160">
          <template
              slot-scope="scope">
            <span>{{ (scope.row.file.time * 1000) | time('yyyy/MM/dd HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="来源"
            width="140">
          <template
              slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column
            width="140">
          <template
              slot-scope="scope">
            <div class="actions">
              <i
                  class="iconfont icon-share"
                  @click="rowCommand('share', scope.row)"></i>
              <i
                  v-if="!scope.row.dir"
                  class="iconfont icon-download"
                  @click="rowCommand('download', scope.row)"></i>
              <el-dropdown
                  placement="bottom"
                  @command="rowCommand($event, scope.row)">
                <i class="iconfont icon-menu-circle el-dropdown-link"></i>
                <el-dropdown-menu
                    slot="dropdown">
                  <el-dropdown-item
                      command="move">移动到</el-dropdown-item>
                  <el-dropdown-item
                      command="copy">复制到</el-dropdown-item>
                  <el-dropdown-item
                      command="rename">重命名</el-dropdown-item>
                  <el-dropdown-item
                      command="favorite">{{ scope.row.mark ? '取消收藏' : '收藏' }}</el-dropdown-item>
                  <el-dropdown-item
                      command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          layout="prev, pager, next"
          background
          :page-size="size"
          :current-page="page"
          :total="total"
          :pager-count="5"
          :disabled="loading"
          @current-change="search" />
    </div>
  </main-frame>
</template>

<script>
import FileAPI from '../../api/file';

import MainFrame from '../../components/main-frame/index.vue';
import SearchInput from '../../components/search-input/index.vue';

export default {
  name: 'Home',
  components: {
    MainFrame,
    SearchInput,
  },
  data() {
    return {
      loading: false,
      page: 1,
      size: 10,
      total: 0,
      data: [],

      filter: {
        source: [
          'all',
        ],
        suffixs: [],
        time: '',
      },
      sourceOptions: [
        {
          label: '全部',
          value: 'all',
        }, {
          label: '个人',
          value: 'inbox',
        }, {
          label: '书签',
          value: 'mark',
        }, {
          label: '他人分享',
          value: 'other',
        }, {
          label: '回收站',
          value: 'trash',
        },
      ],
      suffixOptions: [
        'jpg',
        'png',
        'gif',
        'mp3',
        'flac',
        'mp4',
        'mkv',
        'rar',
        'zip',
        'psd',
        'doc',
        'xls',
        'ppt',
        'pdf',
      ],
      timeOptions: [
        {
          label: '今天',
          value: 'today',
        }, {
          label: '昨天',
          value: 'yesterday',
        }, {
          label: '过去 7 天',
          value: 'recent-7-days',
        }, {
          label: '最近 30 天',
          value: 'recent-30-days',
        }, {
          label: '最近 90 天',
          value: 'recent-90-days',
        },
      ],
    };
  },
  computed: {
    q() {
      return this.$route.query.q
        || '';
    },
  },
  watch: {
    q(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.search();
      }
    },
  },
  mounted() {
    this.search();
  },
  methods: {
    daysBefore(days) {
      let time = new Date();
      time.setHours(0, 0, 0, 0);
      time = time.getTime();

      time -= 1000 * 60 * 60 * 24 * days;

      return Math.round(time / 1000);
    },
    sourceChecked(type) {
      return this.filter.source
        .indexOf(type) >= 0;
    },
    getStartTime() {
      let time = null;

      switch (this.filter.time) {
        case 'today':
          time = this.daysBefore(0);
          break;
        case 'yesterday':
          time = this.daysBefore(1);
          break;
        case 'recent-7-days':
          time = this.daysBefore(7);
          break;
        case 'recent-30-days':
          time = this.daysBefore(30);
          break;
        case 'recent-90-days':
          time = this.daysBefore(90);
          break;
        default:
      }

      return time;
    },
    getEndTime() {
      let time = null;

      switch (this.filter.time) {
        case 'yesterday':
          time = this.daysBefore(0);
          break;
        case 'today':
        case 'recent-7-days':
        case 'recent-30-days':
        case 'recent-90-days':
          time = Math.round(Date.now() / 1000);
          break;
        default:
      }

      return time;
    },
    getConfig() {
      const startTime = this.getStartTime();

      const config = {
        suffixs: this.filter.suffixs,
        startTime,
        endTime: this.getEndTime(),
        all: this.sourceChecked('all'),
        inbox: this.sourceChecked('inbox'),
        mark: this.sourceChecked('mark'),
        other: this.sourceChecked('other'),
        trash: this.sourceChecked('trash'),
      };

      console.log(config);

      return config;
    },
    search() {
      if (this.loading) {
        return;
      }

      this.loading = true;

      const data = {
        text: this.q,
        ...this.getConfig(),
        limit: this.size,
        offset: this.size * (this.page - 1),
      };

      FileAPI.search(data)
        .then((res) => {
          this.data = res.data.list;
          this.total = res.data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
