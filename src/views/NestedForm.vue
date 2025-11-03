<template>
  <div class="nested-form-container">
    <el-card title="多层级表单" class="form-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="main-form"
      >
        <!-- 基础信息区 -->
        <el-divider content-position="left">基础信息</el-divider>
        <el-row :gutter="20" class="basic-info-row">
          <el-col :xs="24" :sm="12" class="basic-info-col">
            <el-form-item prop="basic.name" label="姓名">
              <el-input
                v-model="formData.basic.name"
                placeholder="请输入姓名"
                @blur="handleNameBlur"
                :class="{ 'error-input': formErrors['basic.name'] }"
              />
              <el-form-item__error
                v-if="formErrors['basic.name']"
                :class="{ 'slide-in': true }"
              >
                {{ formErrors['basic.name'] }}
              </el-form-item__error>
            </el-form-item>

            <el-form-item prop="basic.gender" label="性别">
              <el-radio-group v-model="formData.basic.gender">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" class="basic-info-col">
            <el-form-item prop="basic.phone" label="手机号">
              <el-input
                v-model="formData.basic.phone"
                placeholder="请输入手机号"
                @blur="handlePhoneBlur"
                @input="handlePhoneInput"
                :class="{ 'error-input': formErrors['basic.phone'] }"
              />
              <el-form-item__error
                v-if="formErrors['basic.phone']"
                :class="{ 'slide-in': true }"
              >
                {{ formErrors['basic.phone'] }}
              </el-form-item__error>
            </el-form-item>

            <el-form-item prop="basic.email" label="邮箱">
              <el-input
                v-model="formData.basic.email"
                placeholder="请输入邮箱"
                @input="handleEmailInput"
                :class="{ 'error-input': formErrors['basic.email'] }"
              />
              <el-form-item__error
                v-if="formErrors['basic.email']"
                :class="{ 'slide-in': true }"
              >
                {{ formErrors['basic.email'] }}
              </el-form-item__error>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 地址信息区 -->
        <el-divider content-position="left">
          <el-button
            type="text"
            @click="toggleAddressExpanded"
            class="address-toggle-btn"
          >
            {{ isAddressExpanded ? '收起地址' : '展开地址' }}
            <i
              :class="[
                'el-icon-arrow-down',
                { 'rotate-180': isAddressExpanded }
              ]"
              style="margin-left: 5px"
            ></i>
          </el-button>
        </el-divider>

        <transition
          name="address-collapse"
          mode="out-in"
          v-on:enter="enterTransition"
          v-on:leave="leaveTransition"
        >
          <div v-if="isAddressExpanded" class="address-section">
            <el-form-item prop="address.area" label="省/市/区">
              <el-cascader
                v-model="formData.address.area"
                :options="addressOptions"
                placeholder="请选择省/市/区"
                @change="handleAreaChange"
                :class="{ 'error-input': formErrors['address.area'] }"
              />
              <el-form-item__error
                v-if="formErrors['address.area']"
                :class="{ 'slide-in': true }"
              >
                {{ formErrors['address.area'] }}
              </el-form-item__error>
            </el-form-item>

            <el-form-item prop="address.detail" label="详细地址">
              <el-input
                v-model="formData.address.detail"
                type="textarea"
                placeholder="请输入详细地址"
                :rows="3"
                :style="{ height: '80px' }"
                :class="{ 'error-input': formErrors['address.detail'] }"
              />
              <el-form-item__error
                v-if="formErrors['address.detail']"
                :class="{ 'slide-in': true }"
              >
                {{ formErrors['address.detail'] }}
              </el-form-item__error>
            </el-form-item>
          </div>
        </transition>

        <!-- 亲属信息区 -->
        <el-divider content-position="left">
          亲属信息
          <el-button
            type="primary"
            size="small"
            @click="addRelative"
            :disabled="formData.relatives.length >= 3"
            style="margin-left: 10px"
          >
            添加亲属
          </el-button>
        </el-divider>

        <div class="relatives-section">
          <transition-group name="relative-item" tag="div">
            <el-row
              :gutter="20"
              v-for="(relative, index) in formData.relatives"
              :key="index"
              class="relative-row"
            >
              <el-col :xs="24" :sm="6" class="relative-col">
                <el-form-item
                  :prop="`relatives.${index}.name`"
                  :rules="formRules.relatives.name"
                  label="姓名"
                  :label-width="index === 0 ? '120px' : '0px'"
                >
                  <el-input
                    v-model="relative.name"
                    placeholder="请输入姓名"
                    @input="handleRelativeNameInput(index)"
                    :class="{ 'error-input': formErrors[`relatives.${index}.name`] }"
                  />
                  <el-form-item__error
                    v-if="formErrors[`relatives.${index}.name`]"
                    :class="{ 'slide-in': true }"
                  >
                    {{ formErrors[`relatives.${index}.name`] }}
                  </el-form-item__error>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="6" class="relative-col">
                <el-form-item
                  :prop="`relatives.${index}.relation`"
                  :rules="formRules.relatives.relation"
                  label="关系"
                  :label-width="index === 0 ? '120px' : '0px'"
                >
                  <el-select
                    v-model="relative.relation"
                    placeholder="请选择关系"
                    @change="handleRelationChange(index)"
                    :class="{ 'error-input': formErrors[`relatives.${index}.relation`] }"
                  >
                    <el-option label="父母" value="父母" />
                    <el-option label="配偶" value="配偶" />
                    <el-option label="子女" value="子女" />
                  </el-select>
                  <el-form-item__error
                    v-if="formErrors[`relatives.${index}.relation`]"
                    :class="{ 'slide-in': true }"
                  >
                    {{ formErrors[`relatives.${index}.relation`] }}
                  </el-form-item__error>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="6" class="relative-col">
                <el-form-item
                  :prop="`relatives.${index}.phone`"
                  :rules="formRules.relatives.phone"
                  label="联系电话"
                  :label-width="index === 0 ? '120px' : '0px'"
                >
                  <el-input
                    v-model="relative.phone"
                    placeholder="请输入联系电话"
                    @input="handleRelativePhoneInput(index)"
                    :class="{ 'error-input': formErrors[`relatives.${index}.phone`] }"
                  />
                  <el-form-item__error
                    v-if="formErrors[`relatives.${index}.phone`]"
                    :class="{ 'slide-in': true }"
                  >
                    {{ formErrors[`relatives.${index}.phone`] }}
                  </el-form-item__error>
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="6" class="relative-col">
                <el-button
                  type="danger"
                  size="small"
                  @click="removeRelative(index)"
                  :disabled="formData.relatives.length <= 1"
                  style="margin-top: 24px; margin-left: 10px"
                >
                  删除
                </el-button>
              </el-col>
            </el-row>
          </transition-group>
        </div>
      </el-form>

      <!-- 底部操作区 -->
      <div class="form-actions">
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="!formData.address.area.length"
        >
          保存
        </el-button>
        <el-button
          @click="resetForm"
          :disabled="resetDisabled"
        >
          重置
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import addressData from '@/assets/json/addressData.json'

export default {
  name: 'NestedForm',
  data() {
    return {
      addressOptions: addressData,
      formErrors: {},
      resetDisabled: false,
      emailDebounce: null,
      phoneDebounce: {}
    }
  },
  computed: {
    ...mapState('form', ['formData', 'isAddressExpanded']),
    formRules() {
      return {
        'basic.name': [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '请输入2-6个汉字', trigger: 'blur' }
        ],
        'basic.gender': [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        'basic.phone': [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入11位有效手机号', trigger: 'blur' }
        ],
        'basic.email': [
          { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确', trigger: 'input' }
        ],
        'address.area': [
          { required: true, message: '请选择省/市/区', trigger: 'change' }
        ],
        'address.detail': [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 10, message: '详细地址不能少于10个字符', trigger: 'blur' }
        ],
        relatives: {
          name: [
            { required: true, message: '请输入亲属姓名', trigger: 'blur' }
          ],
          relation: [
            { required: true, message: '请选择关系', trigger: 'change' }
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { pattern: /^1\d{10}$/, message: '请输入11位有效手机号', trigger: 'blur' }
          ]
        }
      }
    }
  },
  mounted() {
    this.loadFormData()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.emailDebounce) clearTimeout(this.emailDebounce)
    Object.values(this.phoneDebounce).forEach(timer => clearTimeout(timer))
  },
  methods: {
    ...mapActions('form', [
      'updateFormData',
      'updateRelative',
      'addRelative',
      'removeRelative',
      'toggleAddressExpanded',
      'resetForm'
    ]),
    handleNameBlur() {
      this.$refs.formRef.validateField('basic.name', error => {
        this.formErrors['basic.name'] = error
      })
    },
    handlePhoneBlur() {
      this.$refs.formRef.validateField('basic.phone', error => {
        this.formErrors['basic.phone'] = error
      })
    },
    handlePhoneInput() {
      // 过滤非数字字符
      this.formData.basic.phone = this.formData.basic.phone.replace(/[^0-9]/g, '')
      this.updateFormData({ path: 'basic.phone', value: this.formData.basic.phone })
    },
    handleEmailInput() {
      // 实时校验，每输入1个字符触发一次
      if (this.emailDebounce) clearTimeout(this.emailDebounce)
      this.emailDebounce = setTimeout(() => {
        this.$refs.formRef.validateField('basic.email', error => {
          this.formErrors['basic.email'] = error
        })
      }, 0)
    },
    handleAreaChange() {
      this.$refs.formRef.validateField('address.area', error => {
        this.formErrors['address.area'] = error
      })
      
      // 联动逻辑：选择北京市-北京市-东城区时自动填充详细地址前缀
      if (this.formData.address.area.join('-') === '北京市-北京市-东城区') {
        if (!this.formData.address.detail.startsWith('东城区')) {
          this.updateFormData({
            path: 'address.detail',
            value: `东城区${this.formData.address.detail}`
          })
        }
      }
    },
    handleRelativeNameInput(index) {
      const name = this.formData.relatives[index].name
      // 亲属姓名包含“父”“母”字符时自动匹配关系
      if (name.includes('父') && !this.formData.relatives[index].relation) {
        this.updateRelative({ index, field: 'relation', value: '父母' })
      } else if (name.includes('母') && !this.formData.relatives[index].relation) {
        this.updateRelative({ index, field: 'relation', value: '父母' })
      }
    },
    handleRelationChange(index) {
      this.$refs.formRef.validateField(`relatives.${index}.relation`, error => {
        this.formErrors[`relatives.${index}.relation`] = error
      })
      
      // 选择“配偶”关系时自动追加后缀
      if (this.formData.relatives[index].relation === '配偶') {
        const name = this.formData.relatives[index].name
        if (!name.endsWith('（配偶）')) {
          this.updateRelative({
            index,
            field: 'name',
            value: `${name}（配偶）`
          })
        }
      }
    },
    handleRelativePhoneInput(index) {
      // 过滤非数字字符
      let phone = this.formData.relatives[index].phone.replace(/[^0-9]/g, '')
      this.updateRelative({ index, field: 'phone', value: phone })
      
      // 200ms防抖校验
      if (this.phoneDebounce[index]) clearTimeout(this.phoneDebounce[index])
      this.phoneDebounce[index] = setTimeout(() => {
        this.$refs.formRef.validateField(`relatives.${index}.phone`, error => {
          this.formErrors[`relatives.${index}.phone`] = error
        })
      }, 200)
    },
    removeRelative(index) {
      // 删除最后一行时检查内容
      if (this.formData.relatives.length <= 1) {
        this.$message.warning('至少保留1位亲属信息')
        return
      }
      
      const relative = this.formData.relatives[index]
      if (relative.name || relative.relation || relative.phone) {
        this.$confirm('确定要删除这条亲属信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('form/REMOVE_RELATIVE', index)
        }).catch(() => {})
      } else {
        this.$store.commit('form/REMOVE_RELATIVE', index)
      }
    },
    enterTransition(el) {
      el.style.height = '0px'
      el.style.overflow = 'hidden'
      setTimeout(() => {
        el.style.transition = 'height 300ms cubic-bezier(0.25, 0.8, 0.25, 1)'
        el.style.height = el.scrollHeight + 'px'
      }, 0)
    },
    leaveTransition(el) {
      el.style.height = el.scrollHeight + 'px'
      el.style.overflow = 'hidden'
      setTimeout(() => {
        el.style.transition = 'height 300ms cubic-bezier(0.25, 0.8, 0.25, 1)'
        el.style.height = '0px'
      }, 0)
    },
    async submitForm() {
      try {
        // 全量校验
        await this.$refs.formRef.validate()
        
        // 跨字段校验：手机号与亲属电话不能相同
        const mainPhone = this.formData.basic.phone
        const hasDuplicate = this.formData.relatives.some(relative => {
          return relative.phone === mainPhone && relative.phone
        })
        
        if (hasDuplicate) {
          this.$message.error('本人手机号与亲属电话不可重复')
          return
        }
        
        // 保存到localStorage
        localStorage.setItem('formData', JSON.stringify(this.formData))
        localStorage.setItem('isAddressExpanded', JSON.stringify(this.isAddressExpanded))
        
        // 打印表单数据
        console.log('表单数据:', this.formData)
        
        // 成功提示
        this.$message.success('表单提交成功！')
        
        // 重置表单
        this.resetForm()
        this.formErrors = {}
      } catch (error) {
        // 聚焦第一个错误字段
        const firstError = Object.keys(this.formErrors)[0]
        if (firstError) {
          const inputEl = this.$el.querySelector(`[name="${firstError}"]`)
          if (inputEl) inputEl.focus()
        }
        this.$message.error('表单校验失败，请检查填写内容')
      }
    },
    async resetForm() {
      try {
        await this.$confirm('确定要重置表单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // 禁用重置按钮500ms
        this.resetDisabled = true
        setTimeout(() => {
          this.resetDisabled = false
        }, 500)
        
        // 调用Vuex重置
        this.$store.dispatch('form/resetForm')
        this.formErrors = {}
        
        // 清空localStorage
        localStorage.removeItem('formData')
        localStorage.removeItem('isAddressExpanded')
        
        this.$message.success('表单已重置')
      } catch (error) {
        // 用户取消重置
      }
    },
    loadFormData() {
      // 检查localStorage是否有未保存数据
      const savedFormData = localStorage.getItem('formData')
      const savedIsExpanded = localStorage.getItem('isAddressExpanded')
      
      if (savedFormData) {
        this.$confirm('检测到未保存表单，是否恢复？', '提示', {
          confirmButtonText: '恢复',
          cancelButtonText: '放弃',
          type: 'info'
        }).then(() => {
          // 恢复数据
          const formData = JSON.parse(savedFormData)
          Object.keys(formData).forEach(key => {
            this.updateFormData({ path: key, value: formData[key] })
          })
          
          if (savedIsExpanded) {
            this.$store.commit('form/TOGGLE_ADDRESS_EXPANDED', JSON.parse(savedIsExpanded))
          }
          
          this.$message.success('表单数据已恢复')
        }).catch(() => {
          // 用户放弃恢复
          localStorage.removeItem('formData')
          localStorage.removeItem('isAddressExpanded')
        })
      }
    },
    handleResize() {
      // 窗口尺寸变化时调整校验提示位置
      if (window.innerWidth <= 768) {
        // 移动端样式调整
        document.querySelectorAll('.el-form-item__error').forEach(el => {
          el.style.left = '0'
          el.style.right = '0'
        })
      } else {
        // 桌面端样式调整
        document.querySelectorAll('.el-form-item__error').forEach(el => {
          el.style.left = '120px'
          el.style.right = 'auto'
        })
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        // 实时更新localStorage
        localStorage.setItem('formData', JSON.stringify(this.formData))
      }
    },
    isAddressExpanded(newVal) {
      localStorage.setItem('isAddressExpanded', JSON.stringify(newVal))
    }
  }
}
</script>

<style scoped>
.nested-form-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.form-card {
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.main-form {
  padding: 0 20px 20px;
}

.basic-info-row {
  margin-bottom: 20px;
}

.basic-info-col {
  margin-bottom: 20px;
}

.address-toggle-btn {
  font-weight: 500;
}

.address-collapse-enter-active,
.address-collapse-leave-active {
  transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
}

.address-collapse-enter,
.address-collapse-leave-to {
  height: 0;
  overflow: hidden;
}

.address-section {
  margin-bottom: 20px;
}

.relatives-section {
  margin-bottom: 20px;
}

.relative-row {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 4px;
}

.relative-col {
  margin-bottom: 10px;
}

.relative-item-enter-active,
.relative-item-leave-active {
  transition: opacity 200ms;
}

.relative-item-enter,
.relative-item-leave-to {
  opacity: 0;
}

.form-actions {
  text-align: right;
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  background-color: #fafafa;
}

.form-actions .el-button {
  margin-left: 15px;
}

.error-input {
  border-color: #f56c6c !important;
}

.slide-in {
  animation: slideIn 150ms ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 300ms;
}

@media (max-width: 768px) {
  .nested-form-container {
    padding: 10px;
  }
  
  .main-form {
    padding: 0 10px 10px;
  }
  
  .el-form-item__label {
    text-align: left;
  }
  
  .form-actions {
    padding: 10px;
    text-align: center;
  }
  
  .form-actions .el-button {
    width: 45%;
    margin: 0 2.5%;
  }
}
</style>