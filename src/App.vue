<template>
  <div class="container">
    <FormComp v-if="flag" ref="formCompRef" :config="formConfig" class="left" />
    
    <div class="middle">
      <ElButton @click="render">&lt;&lt;渲染表单</ElButton>
      <ElButton @click="getRenderConfig">&gt;&gt;获取渲染配置</ElButton>
      <ElButton @click="getForm">&gt;&gt;获取表单值</ElButton>
    </div>
    
    <EditorComp v-if="editFlag" class="right" v-model="content"/>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { ElButton } from 'element-plus';
import FormComp from './components/FormComp';
import EditorComp from './components/EditorComp';

const flag = ref(true);
const formCompRef = ref(null);
const formConfig = ref({
  type: 'form',
  tag: 'el-form',
  fields: [
    {
      type: 'field',
      key: 'name',
      valueType: 'string',
      default: '',
      required: true,
      tag: 'el-form-item',
      slots: {
        label: {
          tag: 'span',
          value: 'Name'
        },
        default: {
          tag: 'el-input'
          // bindValue: true
        }
      },
      attrs: {
      }
    },
    {
      type: 'field',
      key: 'birthday',
      valueType: 'string',
      default: '',
      required: true,
      tag: 'el-form-item',
      slots: {
        label: {
          tag: 'span',
          value: 'Birthday'
        },
        default: {
          tag: 'el-date-picker'
        }
      },
      attrs: {
      }
    },
    {
      type: 'field',
      key: 'country',
      valueType: 'string',
      default: '',
      required: true,
      tag: 'el-form-item',
      slots: {
        label: {
          tag: 'span',
          value: 'Country'
        },
        default: {
          tag: 'el-select',
          slots: {
            default: [
              {
                tag: 'el-option',
                value: 'China',
                label: 'China'
              },
              {
                tag: 'el-option',
                value: 'Japan',
                label: 'Japan'
              },
              {
                tag: 'el-option',
                value: 'America',
                label: 'America'
              }
            ]
          }
        }
      },
      attrs: {
      }
    },
    {
      type: 'field',
      key: 'father',
      valueType: 'object',
      default: null,
      slots: {
        label: {
          tag: 'span',
          value: 'Father'
        },
        default: [
          {
            tag: 'plain-text-comp'
          },
          {
            tag: 'el-button',
            trigger: 'click',
            triggerCb: {
              type: 'dialog',
              tag: 'el-dialog',
              form: {
                type: 'form',
                tag: 'el-form',
                fields: [
                  {
                    type: 'field',
                    key: 'name',
                    valueType: 'string',
                    default: '',
                    required: true,
                    tag: 'el-form-item',
                    slots: {
                      label: {
                        tag: 'span',
                        value: 'Name'
                      },
                      default: {
                        tag: 'el-input'
                      }
                    },
                  },
                  {
                    type: 'field',
                    key: 'age',
                    valueType: 'number',
                    default: null,
                    required: true,
                    tag: 'el-form-item',
                    slots: {
                      label: {
                        tag: 'span',
                        value: 'Age'
                      },
                      default: {
                        tag: 'el-input'
                      }
                    },
                  },
                  {
                    type: 'field',
                    key: 'father',
                    valueType: 'object',
                    default: null,
                    slots: {
                      label: {
                        tag: 'span',
                        value: 'Father'
                      },
                      default: [
                        {
                          tag: 'plain-text-comp'
                        },
                        {
                          tag: 'el-button',
                          trigger: 'click',
                          triggerCb: {
                            type: 'dialog',
                            tag: 'el-dialog',
                            form: {
                              type: 'form',
                              tag: 'el-form',
                              fields: [
                                {
                                  type: 'field',
                                  key: 'name',
                                  valueType: 'string',
                                  default: '',
                                  required: true,
                                  tag: 'el-form-item',
                                  slots: {
                                    label: {
                                      tag: 'span',
                                      value: 'Name'
                                    },
                                    default: {
                                      tag: 'el-input'
                                    }
                                  },
                                }
                              ]
                            }
                          },
                          attrs: {

                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            attrs: {

            }
          }
        ]
      },
      attrs: {
      }
    }
  ],
  attrs: {
    labelWidth: '120px'
  }
})

const editFlag = ref(true);
const content = ref('');
const render = () => {
  flag.value = false;
  nextTick(() => {
    let json 
    try {
      json = JSON.parse(content.value);
    } catch (error) {
      json = null
    }
    if (json && json.type === 'form') {
      formConfig.value = json
    }
    flag.value = true;
  })
};
const getRenderConfig = () => {
  editFlag.value = false;
  nextTick(() => {
    editFlag.value = true;
    content.value = JSON.stringify(formConfig.value, null, 2);
  })
};
const getForm = () => {
  editFlag.value = false;
  nextTick(() => {
    editFlag.value = true;
    content.value = JSON.stringify(formCompRef.value.model, null, 2);
  })
}
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

