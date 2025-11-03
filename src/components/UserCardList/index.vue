<template>
  <el-row :gutter="20">
    <el-col
      v-for="user in userList"
      :key="user.id"
      :xs="24"
      :sm="12"
      :md="8"
      class="user-card-col"
    >
      <el-card
        class="user-card"
        @click="handleCardClick(user.id)"
      >
        <div class="user-avatar-wrapper">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.username"
            class="user-avatar"
            @error="handleAvatarError($event, user.username)"
          />
          <el-avatar
            v-else
            :size="60"
            class="user-avatar-placeholder"
          >
            {{ user.username.charAt(0) }}
          </el-avatar>
        </div>
        <div class="user-info">
          <div class="user-name">{{ user.username }}</div>
          <div class="user-email">{{ user.email }}</div>
          <div class="user-register-time">{{ user.registerTime }}</div>
        </div>
        <div class="user-status">
          <el-tag
            :type="getStatusType(user.status)"
          >
            {{ getStatusText(user.status) }}
          </el-tag>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'UserCardList',
  props: {
    userList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    handleCardClick(userId) {
      console.log('User ID:', userId)
    },
    handleAvatarError(event, username) {
      event.target.style.display = 'none'
      const placeholder = event.target.nextElementSibling
      if (placeholder) {
        placeholder.style.display = 'flex'
      }
    },
    getStatusType(status) {
      switch (status) {
        case 1:
          return 'success'
        case 0:
          return 'danger'
        case 2:
          return 'primary'
        default:
          return ''
      }
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '正常'
        case 0:
          return '禁用'
        case 2:
          return '待审核'
        default:
          return ''
      }
    }
  }
}
</script>

<style scoped>
.user-card-col {
  margin-bottom: 20px;
}

.user-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar-wrapper {
  position: relative;
  margin-top: 15px;
  margin-bottom: 15px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
}

.user-info {
  width: 100%;
  text-align: center;
  margin-bottom: auto;
}

.user-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.user-email {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.user-register-time {
  font-size: 12px;
  color: #909399;
}

.user-status {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>