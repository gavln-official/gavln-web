<template>
  <main-frame>
    <div class="page-home">
      <file-list
          :data="data"></file-list>
    </div>
  </main-frame>
</template>

<script>
import MainFrame from '../../components/main-frame/index.vue';
import FileList from '../../components/file-list/index.vue';

export default {
  name: 'Home',
  components: {
    MainFrame,
    FileList,
  },
  data() {
    return {
      data: [
        {
          id: 1,
          name: '图片',
          type: 'folder',
          size: 12345,
          utime: '2019-10-03T10:03:00',
        },
        {
          id: 2,
          name: '视频',
          type: 'folder',
          size: 54345,
          utime: '2019-10-07T10:03:00',
        },
        {
          id: 3,
          name: '音乐',
          type: 'folder',
          size: 6345,
          utime: '2019-10-15T10:03:00',
        },
        {
          id: 4,
          name: '使用文档.pdf',
          type: 'pdf',
          size: 241,
          utime: '2019-10-05T10:03:00',
        },
        {
          id: 5,
          name: '使用文档.pdf',
          type: 'pdf',
          size: 621,
          utime: '2019-10-11T10:03:00',
        },
        {
          id: 6,
          name: '使用文档.pdf',
          type: 'pdf',
          size: 478,
          utime: '2019-10-23T10:03:00',
        },
        {
          id: 7,
          name: '使用文档.pdf',
          type: 'pdf',
          size: 478,
          utime: '2019-10-20T10:03:00',
        },
        {
          id: 8,
          name: '使用文档.pdf',
          type: 'pdf',
          size: 478,
          utime: '2019-10-25T10:03:00',
        },
        {
          id: 9,
          name: '使用文档.pdf',
          type: 'pdf',
          size: 478,
          utime: '2019-10-14T10:03:00',
        },
      ],
    };
  },
};
</script>

<style
    src="./index.scss"
    lang="scss"
    scoped></style>
