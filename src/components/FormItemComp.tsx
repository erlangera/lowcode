import { defineComponent } from "vue";
import { ElFormItem } from "element-plus";
import Block from "./Block";

export default defineComponent({
    name: 'FormItemComp',
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    setup(props, ctx) {
        const { config } = props;
        return () => <ElFormItem prop={config.key} {...config.attrs}>{{
            label: () => <Block config={config.slots.label} field={config}></Block>,
            default: () => <Block config={config.slots.default} field={config}></Block>
        }}</ElFormItem >
    }
});
