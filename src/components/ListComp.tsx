import { defineComponent, defineAsyncComponent, ref, reactive, provide } from "vue";
import { formCompContextKey, formItemCompContextKey } from "./constant";

export default defineComponent({
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
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        // 合成model，并设置到父组件，
        const model = reactive([...props.modelValue]);
        ctx.emit('update:modelValue', model);

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
            throw new Error('ListComp undefine openDialog');
            // ctx.emit('open-dialog', config)
            // dialog.key = key;
            // dialog.visible = true;
            // dialog.config = cbConfig.config;
            // dialog.attrs = cbConfig.attrs;
            // dialog.index = index;
            // if (dialog.index === undefined) {
            //     dialog.model = model[key];
            // } else {
            //     dialog.model = model[key][dialog.index];
            // }
        };
        const closeDialog = () => {
            // dialog.key = '';
            // dialog.visible = false;
            // dialog.config = null;
            // dialog.attrs = null;
            // dialog.model = {};
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
        const insert = (value) => {
            model.push(value);
        }
        const remove = (index) => {
            model.splice(index, 1);
        }
        // 后代组件暴露属性和方法
        provide(formItemCompContextKey, {
            insert,
            remove,
        })
        provide(formCompContextKey, {
            model,
            openDialog
        });
        const {config} = props.config;
        return () => [
            config.header ? <Block config={config.header} {...config.header.attrs}></Block> : null,
            // 此处key为特殊设置保证删除项时不渲染错误
            config.item ? model.map((item, i) => <Block config={config.item} index={i} key={`${model.length}-${i}`} {...config.item.attrs}></Block>) : null,
            config.footer ? <Block config={config.footer} {...config.footer.attrs}></Block> : null
        ]
    },
});