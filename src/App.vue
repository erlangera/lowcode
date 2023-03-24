<script setup lang="ts">
import FormComp from './components/FormComp';
import { ref } from 'vue';

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
        }
      },
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
            tag: 'el-input'
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
                      default: {
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
                    }
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
  ],
  attrs: {

  }
})
</script>

<template>
  <FormComp ref="formCompRef" :config="formConfig" />
</template>
