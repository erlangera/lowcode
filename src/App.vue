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
          value: 'Name'
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
          tag: 'el-select'
        }
      }
    }
  ],
  attrs: {

  }
})
</script>

<template>
  <FormComp :config="formConfig" />
</template>
