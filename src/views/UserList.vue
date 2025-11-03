<template>
  <div class="user-list-container">
    <h2>用户列表</h2>
    <user-card-list :user-list="userList" />
  </div>
</template>

<script>
import UserCardList from '@/components/UserCardList'

export default {
  name: 'UserList',
  components: {
    UserCardList
  },
  data() {
    return {
      userList: [
        {
          id: 1,
          username: '张三',
          avatar: 'https://example.com/avatar1.jpg',
          email: 'zhangsan@example.com',
          registerTime: '2023-01-15',
          status: 1
        },
        {
          id: 2,
          username: '李四',
          avatar: '',
          email: 'lisi@example.com',
          registerTime: '2023-02-20',
          status: 0
        },
        {
          id: 3,
          username: '王五',
          avatar: 'https://example.com/avatar3.jpg',
          email: 'wangwu@example.com',
          registerTime: '2023-03-10',
          status: 2
        },
        {
          id: 4,
          username: '赵六',
          avatar: 'https://example.com/avatar4.jpg',
          email: 'zhaoliu@example.com',
          registerTime: '2023-04-05',
          status: 1
        },
        {
          id: 5,
          username: '孙七',
          avatar: '',
          email: 'sunqi@example.com',
          registerTime: '2023-05-15',
          status: 2
        },
        {
          id: 6,
          username: '周八',
          avatar: 'https://example.com/avatar6.jpg',
          email: 'zhouba@example.com',
          registerTime: '2023-06-20',
          status: 0
        }
      ]
    }
  }
}
</script>

<style scoped>
.user-list-container {
  padding: 20px;
}

h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>