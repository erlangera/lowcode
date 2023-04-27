import { defineComponent, defineAsyncComponent, ref, reactive, provide } from "vue";
import { ElDialog, ElButton } from "element-plus";
import { formCompContextKey } from "./constant";
import FormComp from "./FormComp";
import CustomTransferComp from "./custom/CustomTransferComp";

const ListComp: any = defineComponent({
    name: 'ListComp',
    components: {
        // 通过异步组件解决循环依赖问题
        Block: defineAsyncComponent(() => import("./Block"))
    },
    props: {
        modelValue: {
            type: Array,
            required: false,
        },
        config: {
            type: Object,
            required: false
        },
        field: {
            type: Object,
            required: false
        },
        disabled: {
            type: Boolean,
            required: false,
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        // 合成model，并设置到父组件，
        const model = reactive([...props.modelValue]);
        ctx.emit('update:modelValue', model);

        const dialogFormRef = ref();
        const dialog = reactive({
            visible: false,
            config: null,
            attrs: null,
            model: {},
            index: undefined,
        });
        const closeDialog = () => {
            dialog.visible = false;
            dialog.config = null;
            dialog.attrs = null;
            dialog.model = {};
            dialog.index = undefined
        }
        const handleOk = () => {
            // 提交校验
            if (dialogFormRef.value) {
                dialogFormRef.value.validate((valid: boolean) => {
                    if (valid) {
                        model[dialog.index] = dialog.model;
                        closeDialog();
                    }
                })
            } else {
                model[dialog.index] = dialog.model;
                closeDialog();
            }
        }

        // 事件处理
        const listeners: Record<string, Function> = {
            insert: (value: any, index: number) => {
                model.push(value);
            },
            remove: (index: number) => {
                model.splice(index, 1);
            },
            dialog: (cbConfig, index: undefined | number) => {
                dialog.visible = true;
                dialog.config = cbConfig.config;
                dialog.attrs = cbConfig.attrs;
                dialog.index = index;
                dialog.model = model[dialog.index];
            }
        }
        const emit = (event: string, ...params) => {
            listeners[event]?.call(null, ...params)
        }

        // 后代组件暴露属性和方法
        provide(formCompContextKey, {
            model,
            emit,
            get disabled(){
                return props.disabled
            }
        });
        const {config} = props.config;
        return () => <div class="list-comp">{[
            // @ts-ignore
            config.header ? <Block config={config.header} {...config.header.attrs}></Block> : null,
            // 此处key为特殊设置保证删除项时不渲染错误
            // @ts-ignore
            config.item ? model.map((item, i) => <Block config={config.item} index={i} key={`${model.length}-${i}`} {...config.item.attrs} disabled={props.disabled}></Block>) : null,
            // @ts-ignore
            config.footer ? <Block config={config.footer} {...config.footer.attrs}></Block> : null,
            dialog.visible ? <ElDialog v-model={dialog.visible} title={`${props.field?.slots?.label?.value} ${dialog.index + 1}`} center close-on-click-modal={false} appendToBody {...dialog.attrs}>{{
                default: () => {
                    switch (dialog.config.type) {
                        case 'form':
                            return <FormComp ref={dialogFormRef} v-model={dialog.model} config={dialog.config!}></FormComp>;
                        case 'transfer':
                            return <CustomTransferComp v-model={dialog.model} config={dialog.config!}></CustomTransferComp>;
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
        ]}</div>
    },
});

export default ListComp;
