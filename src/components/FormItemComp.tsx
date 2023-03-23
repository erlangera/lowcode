import { defineComponent } from "vue";
import { ElFormItem, ElInput } from "element-plus";
import Block from "./Block";

export default defineComponent({
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    setup(props, ctx) {
        const { config } = props;
        return () => <ElFormItem>{{
            label: () => <Block config={config.slots.label}></Block>,
            default: () => <Block config={config.slots.default} field={config}></Block>
        }}</ElFormItem >
    }
});
