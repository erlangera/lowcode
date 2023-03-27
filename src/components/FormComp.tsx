import { defineComponent, reactive, ref, provide } from "vue";
import { ElForm, ElDialog, ElButton } from "element-plus"
import FormItemComp from "./FormItemComp";
import { formCompContextKey } from "./constant";
import { config2Form } from "../utils/converter"

const FormComp = defineComponent({
    name: 'FormComp',
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    // emits: ['open-dialog'],
    setup(props, ctx) {
        // 后代组件暴露属性和方法
        const model = reactive(config2Form(props.config));
        const dialog = reactive({
            key: '',
            visible: false,
            formConfig: null
        });
        // 实现弹窗的功能可放到FormComp组件此时可实现多层弹窗
        const formCompRef = ref(null)
        const openDialog = (key: string, formConfig) => {
            // ctx.emit('open-dialog', formConfig)
            dialog.key = key;
            dialog.visible = true;
            dialog.formConfig = formConfig;
        };
        const closeDialog = () => {
            dialog.key = '';
            dialog.visible = false;
            dialog.formConfig = null;
        }
        const handleOk = () => {
            const { model: subModel } = formCompRef.value;
            console.log(dialog.key, subModel);
            model[dialog.key] = subModel;
            closeDialog();
        }
        provide(formCompContextKey, {
            model,
            openDialog
        });
        // 向父组件暴露属性
        ctx.expose({ model });
        // 渲染模板，此处使用了递归组件的方式渲染对话框中的表单
        const { fields, attrs } = props.config;
        return () => <ElForm model={model} {...attrs}>{[
            ...fields.map(field => <FormItemComp config={field}></FormItemComp>),
            dialog.visible ? <ElDialog v-model={dialog.visible} appendToBody>{{
                default: () => dialog.formConfig ? <FormComp ref={formCompRef} config={dialog.formConfig}></FormComp> : null,
                footer: () => <div>
                    <ElButton onClick={closeDialog}>Cancel</ElButton>
                    <ElButton type="primary" onClick={handleOk}>Confirm</ElButton>
                </div>
            }}</ElDialog> : null
        ]}</ElForm>;
    }
});

export default FormComp;