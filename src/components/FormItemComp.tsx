import { defineComponent, defineAsyncComponent } from "vue";
import { ElFormItem } from "element-plus";

export default defineComponent({
    name: 'FormItemComp',
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    components: {
        // 通过异步组件解决循环依赖问题
        Block: defineAsyncComponent(() => import("./Block"))
    },
    setup(props, ctx) {
        const { config } = props;
        return () => <ElFormItem prop={config.key} {...config.attrs}>{{
            label: () => <Block config={config.slots.label} field={config}></Block>,
            default: () => <Block config={config.slots.default} field={config}></Block>
        }}</ElFormItem >
    }
});
