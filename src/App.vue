<template>
  <div class="container">
    <FormComp
      ref="formCompRef"
      v-if="flag"
      v-model="model"
      :config="formConfig"
      class="left"
    />

    <div class="middle">
      <ElButton @click="render">&lt;&lt;渲染表单</ElButton>
      <ElButton @click="getRenderConfig">&gt;&gt;获取渲染配置</ElButton>
      <ElButton @click="getForm">&gt;&gt;获取表单值</ElButton>
      <ElButton @click="validateForm">验证表单</ElButton>
      <ElButton @click="resetForm">重置表单</ElButton>
      <ElButton @click="clearValidate">清除表单验证</ElButton>
    </div>

    <EditorComp v-if="editFlag" class="right" v-model="content" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import { ElButton } from "element-plus";
import FormComp from "./components/FormComp";
import EditorComp from "./components/EditorComp";
import { config2Form } from "./utils/converter";

const flag = ref(true);
const formConfig = ref({
  type: "form",
  tag: "el-form",
  fields: [
    {
      type: "field",
      key: "name",
      valueType: "string",
      default: "",
      required: true,
      rules: [
        {
          max: 10,
          min: 2,
          message: "长度2-10",
        },
        {
          pattern: /^[a-zA-Z ]+$/,
          message: "只允许输入字母和空格",
        },
      ],
      tag: "el-form-item",
      slots: {
        label: {
          tag: "span",
          value: "Name",
        },
        default: {
          tag: "el-input",
          // bindValue: true
        },
      },
      attrs: {},
    },
    {
      type: "field",
      key: "birthday",
      valueType: "string",
      default: "",
      required: true,
      tag: "el-form-item",
      slots: {
        label: {
          tag: "span",
          value: "Birthday",
        },
        default: {
          tag: "el-date-picker",
        },
      },
      attrs: {},
    },
    {
      type: "field",
      key: "country",
      valueType: "string",
      default: "",
      required: true,
      tag: "el-form-item",
      slots: {
        label: {
          tag: "span",
          value: "Country",
        },
        default: {
          tag: "el-select",
          slots: {
            default: [
              {
                tag: "el-option",
                value: "China",
                label: "China",
              },
              {
                tag: "el-option",
                value: "Japan",
                label: "Japan",
              },
              {
                tag: "el-option",
                value: "America",
                label: "America",
              },
            ],
          },
          attrs: {
            clearable: true,
          },
        },
      },
      attrs: {},
    },
    {
      type: "field",
      key: "father",
      valueType: "object",
      default: null,
      slots: {
        label: {
          tag: "span",
          value: "Father",
        },
        default: [
          {
            tag: "plain-text-comp",
          },
          {
            tag: "el-button",
            trigger: "click",
            triggerCb: {
              type: "dialog",
              tag: "el-dialog",
              form: {
                type: "form",
                tag: "el-form",
                fields: [
                  {
                    type: "field",
                    key: "name",
                    valueType: "string",
                    default: "",
                    required: true,
                    tag: "el-form-item",
                    slots: {
                      label: {
                        tag: "span",
                        value: "Name",
                      },
                      default: {
                        tag: "el-input",
                      },
                    },
                  },
                  {
                    type: "field",
                    key: "age",
                    valueType: "number",
                    default: null,
                    required: true,
                    tag: "el-form-item",
                    slots: {
                      label: {
                        tag: "span",
                        value: "Age",
                      },
                      default: {
                        tag: "el-input",
                      },
                    },
                  },
                  {
                    type: "field",
                    key: "father",
                    valueType: "object",
                    default: null,
                    slots: {
                      label: {
                        tag: "span",
                        value: "Father",
                      },
                      default: [
                        {
                          tag: "plain-text-comp",
                        },
                        {
                          tag: "el-button",
                          trigger: "click",
                          triggerCb: {
                            type: "dialog",
                            tag: "el-dialog",
                            form: {
                              type: "form",
                              tag: "el-form",
                              fields: [
                                {
                                  type: "field",
                                  key: "name",
                                  valueType: "string",
                                  default: "",
                                  required: true,
                                  tag: "el-form-item",
                                  slots: {
                                    label: {
                                      tag: "span",
                                      value: "Name",
                                    },
                                    default: {
                                      tag: "el-input",
                                    },
                                  },
                                },
                              ],
                              attrs: {
                                labelWidth: "120px",
                              },
                            },
                          },
                          slots: {
                            icon: {
                              tag: "Edit",
                            },
                          },
                          attrs: {
                            link: true,
                          },
                        },
                      ],
                    },
                  },
                ],
                attrs: {
                  labelWidth: "120px",
                },
              },
            },
            slots: {
              icon: {
                tag: "Edit",
              },
            },
            attrs: {
              link: true,
              // icon: 'Edit'
            },
          },
        ],
      },
      attrs: {},
    },
    {
      type: "field",
      key: "nickname",
      valueType: "array",
      default: [],
      slots: {
        label: {
          tag: "span",
          value: "Nickname",
        },
        default: [
          {
            tag: "el-button",
            trigger: "click",
            triggerCb: {
              type: "insert",
              item: {
                slots: [
                  {
                    tag: "el-input",
                  },
                  {
                    tag: "el-button",
                    trigger: "click",
                    triggerCb: {
                      type: "remove",
                    },
                    slots: {
                      icon: {
                        tag: "Minus",
                      },
                    },
                  },
                ],
                default: "",
              },
            },
            slots: {
              icon: {
                tag: "Plus",
              },
            },
            attrs: {
              link: true,
              key: "insert",
            },
          },
        ],
      },
    },
    {
      type: "field",
      key: "children",
      valueType: "array",
      default: [],
      slots: {
        label: {
          tag: "span",
          value: "Children",
        },
        default: [
          {
            tag: "el-button",
            trigger: "click",
            triggerCb: {
              type: "insert",
              item: {
                slots: [
                  {
                    type: "form",
                    tag: "el-form",
                    fields: [
                      {
                        type: "field",
                        key: "name",
                        valueType: "string",
                        default: "dd",
                        required: true,
                        tag: "el-form-item",
                        slots: {
                          label: {
                            tag: "span",
                            value: "Name",
                          },
                          default: {
                            tag: "el-input",
                          },
                        },
                      },
                      {
                        type: "field",
                        key: "age",
                        valueType: "number",
                        default: null,
                        required: true,
                        tag: "el-form-item",
                        slots: {
                          label: {
                            tag: "span",
                            value: "Age",
                          },
                          default: {
                            tag: "el-input",
                          },
                        },
                      },
                    ],
                    attrs: {
                      labelWidth: "80px",
                    },
                  },
                  {
                    tag: "el-button",
                    trigger: "click",
                    triggerCb: {
                      type: "remove",
                    },
                    slots: {
                      icon: {
                        tag: "Minus",
                      },
                    },
                  },
                ],
                default: {
                  name: "",
                  age: null,
                },
              },
            },
            slots: {
              icon: {
                tag: "Plus",
              },
            },
            attrs: {
              link: true,
              key: "insert",
            },
          },
        ],
      },
    },
    {
      type: "field",
      key: "brother",
      valueType: "array",
      default: [],
      slots: {
        label: {
          tag: "span",
          value: "Brother",
        },
        default: [
          {
            tag: "el-button",
            trigger: "click",
            triggerCb: {
              type: "insert",
              item: {
                slots: [
                  {
                    tag: "plain-text-comp",
                  },
                  {
                    tag: "el-button",
                    trigger: "click",
                    triggerCb: {
                      type: "dialog",
                      tag: "el-dialog",
                      form: {
                        type: "form",
                        tag: "el-form",
                        fields: [
                          {
                            type: "field",
                            key: "name",
                            valueType: "string",
                            default: "",
                            required: true,
                            tag: "el-form-item",
                            slots: {
                              label: {
                                tag: "span",
                                value: "Name",
                              },
                              default: {
                                tag: "el-input",
                              },
                            },
                          },
                          {
                            type: "field",
                            key: "age",
                            valueType: "number",
                            default: null,
                            required: true,
                            tag: "el-form-item",
                            slots: {
                              label: {
                                tag: "span",
                                value: "Age",
                              },
                              default: {
                                tag: "el-input",
                              },
                            },
                          },
                        ],
                        attrs: {
                          labelWidth: "120px",
                        },
                      },
                    },
                  },
                  {
                    tag: "el-button",
                    trigger: "click",
                    triggerCb: {
                      type: "remove",
                    },
                    slots: {
                      icon: {
                        tag: "Minus",
                      },
                    },
                  },
                ],
                default: null,
              },
            },
            slots: {
              icon: {
                tag: "Plus",
              },
            },
            attrs: {
              link: true,
              key: "insert",
            },
          },
        ],
      },
    },
  ],
  attrs: {
    labelWidth: "120px",
  },
});
// 因为会使用v-model更新model所以不能使用const，此处也可以使用ref或者对象的字段代替
// 后期将仿照el-form使用model属性，届时将无此限制，不过使用model时字段值双向绑定时时将会比较困难 TODO
let model = reactive(config2Form(formConfig.value));

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
