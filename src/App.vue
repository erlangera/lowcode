<template>
  <div class="container">
    <FormComp ref="formCompRef" v-if="flag" v-model="model" :config="formConfig" class="left" />

    <div class="middle">
      <ElSelect v-model="currentConfig" @change="loadConfig">
        <ElOption v-for="(item, index) in configList" :key="index" :value="item.value" :label="item.label"></ElOption>
      </ElSelect>
      <ElButton @click="getRenderConfig">&gt;&gt;获取渲染配置</ElButton>
      <ElButton @click="render">&lt;&lt;渲染表单</ElButton>
      <ElButton @click="getForm">&gt;&gt;获取表单值</ElButton>
      <ElButton @click="validateForm">验证表单</ElButton>
      <ElButton @click="resetForm">重置表单</ElButton>
      <ElButton @click="clearValidate">清除表单验证</ElButton>
    </div>

    <EditorComp v-if="editFlag" class="right" v-model="content" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from "vue";
import { ElButton, ElSelect, ElOption } from "element-plus";
import FormComp from "./components/FormComp";
import EditorComp from "./components/EditorComp";
import { config2Form } from "./utils/converter";

const flag = ref(false);
const formConfig = ref(null);
// 因为会使用v-model更新model所以不能使用const，此处也可以使用ref或者对象的字段代替
// 后期将仿照el-form使用model属性，届时将无此限制，不过使用model时字段值双向绑定时时将会比较困难 TODO
let model = {};
const configList = [
  {
    value: '/movie.json',
    label: 'Movie'
  },
  {
    value: '/demo.json',
    label: 'Demo'
  },
  {
    value: '/tv.json',
    label: 'TV'
  }
]
const currentConfig = ref(null)
const loadConfig = (val) => {
  flag.value = false;
  fetch(val).then(data => data.json()).then(data => {
    formConfig.value = data;
    model = reactive(config2Form(formConfig.value));
    flag.value = true;
  })
}

const editFlag = ref(true);
const content = ref("");
const render = () => {
  flag.value = false;
  nextTick(() => {
    let json;
    try {
      json = JSON.parse(content.value);
    } catch (error) {
      json = null;
    }
    if (json && json.type === "form") {
      formConfig.value = json;
      model = reactive(config2Form(formConfig.value));
    }
    flag.value = true;
  });
};
const getRenderConfig = () => {
  editFlag.value = false;
  nextTick(() => {
    editFlag.value = true;
    content.value = JSON.stringify(formConfig.value, null, 2);
  });
};
const getForm = () => {
  editFlag.value = false;
  nextTick(() => {
    editFlag.value = true;
    content.value = JSON.stringify(model, null, 2);
  });
};
const formCompRef = ref(null);
const validateForm = () => {
  formCompRef.value.validate((valid) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const resetForm = () => {
  formCompRef.value.resetFields();
};
const clearValidate = () => {
  formCompRef.value.clearValidate();
};

onMounted(() => {
  currentConfig.value = configList[0].value;
  loadConfig(currentConfig.value);
})
</script>

<style scoped>
.container {
  height: 100%;
  padding: 10px;
  display: flex;
}

.container .left,
.container .right {
  width: 50px;
  margin: 10px;
  flex: 1;
  overflow: hidden;
}

.container .right :deep(.cm-editor) {
  max-height: calc(100vh - 60px);
}

.container .middle {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.container .middle .el-button {
  margin: 10px 0;
}
</style>
