import { defineComponent, reactive, ref, provide, computed } from "vue";
import { ElForm, ElDialog, ElButton } from "element-plus";
import FormItemComp from "./FormItemComp";
import CustomTransferComp from "./custom/CustomTransferComp";
import ListComp from "./ListComp";
import { formCompContextKey } from "./constant";
import { config2Form } from "../utils/converter";
import { formatFromList } from "../utils/format";

const FormComp = defineComponent({
    name: 'FormComp',
    props: {
        modelValue: {
            type: Object,
            required: false,
        },
        config: {
            type: Object,
            required: true
        }
    },
    emits: ['update:model-value'],
    setup(props, ctx) {
        // 合成model，并设置到父组件，这里只进行了一个层级的合并，如果字段为对象可能导致引用异常 TODO这使用JSON暴力解决，后期可参考其他框架定义merge方法
        const model = reactive({ ...config2Form(props.config), ...JSON.parse(JSON.stringify(props.modelValue)) });
        ctx.emit('update:model-value', model);

        // 实现弹窗的功能可放到FormComp组件此时可实现多层弹窗
        const dialogFormRef = ref(null);
        const dialog = reactive({
            key: '',
            visible: false,
            config: null,
            attrs: null,
            model: {},
            index: undefined,
        });
        const openDialog = (key: string, cbConfig, index: undefined | number) => {
            // ctx.emit('open-dialog', config)
            dialog.key = key;
            dialog.visible = true;
            dialog.config = cbConfig.config;
            dialog.attrs = cbConfig.attrs;
            dialog.index = index;
            if (dialog.index === undefined) {
                dialog.model = model[key];
            } else {
                dialog.model = model[key][dialog.index];
            }
        };
        const closeDialog = () => {
            dialog.key = '';
            dialog.visible = false;
            dialog.config = null;
            dialog.attrs = null;
            dialog.model = {};
        }
        const handleOk = () => {
            // 提交校验
            if (dialogFormRef.value) {
                dialogFormRef.value.validate((valid) => {
                    if (valid) {
                        if (dialog.index === undefined) {
                            model[dialog.key] = dialog.model;
                        } else {
                            model[dialog.key][dialog.index] = dialog.model;
                        }
                        closeDialog();
                    }
                })
            } else {
                if (dialog.index === undefined) {
                    model[dialog.key] = dialog.model;
                } else {
                    model[dialog.key][dialog.index] = dialog.model;
                }
                closeDialog();
            }
        }

        // 后代组件暴露属性和方法
        provide(formCompContextKey, {
            model,
            openDialog
        });

        // 向父组件暴露属性
        const formRef = ref(null);
        ctx.expose({
            get validate() {
                return formRef.value.validate
            },
            get validateField() {
                return formRef.value.validateField
            },
            get clearValidate() {
                return formRef.value.clearValidate
            },
            get resetFields() {
                return formRef.value.resetFields
            },
            get scrollToField() {
                return formRef.value.scrollToField
            },
        });

        // 渲染模板，此处使用了递归组件的方式渲染对话框中的表单
        const { fields, attrs } = props.config;
        return () => <ElForm ref={formRef} model={model} {...attrs}>{[
            ...fields.map(field => <FormItemComp config={field}></FormItemComp>),
            dialog.visible ? <ElDialog v-model={dialog.visible} title={formatFromList(dialog.key, fields)} center close-on-click-modal={false} appendToBody {...dialog.attrs}>{{
                default: () => {
                    switch (dialog.config.type) {
                        case 'form':
                            return <FormComp ref={dialogFormRef} v-model={dialog.model} config={dialog.config}></FormComp>;
                        case 'transfer':
                            return <CustomTransferComp v-model={dialog.model} config={dialog.config}></CustomTransferComp>;
                        case 'list':
                            return <ListComp v-model={dialog.model} config={dialog.config}></ListComp>;
                        default:
                            return;
                    }
                },
                footer: () => <div>
                    <ElButton onClick={closeDialog}>Cancel</ElButton>
                    <ElButton type="primary" onClick={handleOk}>Confirm</ElButton>
                </div>
            }}</ElDialog> : null
        ]}</ElForm>;
    }
});

export default FormComp;