<script setup lang="ts">
import FormComp from './components/FormComp';
import { ref } from 'vue';

const formConfig = ref({
  type: 'form',
  fields: [
    {
      key: 'name',
      type: 'string',
      default: '',
      required: true,
      label: {
        type: 'string',
        value: 'Name'
      },
      display: {
        type: 'el-input'
      }
    },
    {
      key: 'birthday',
      type: 'string',
      default: null,
      required: true,
      label: {
        type: 'string',
        value: 'Name'
      },
      display: {
        type: 'el-date-picker'
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
