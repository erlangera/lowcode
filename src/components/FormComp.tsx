import { defineComponent } from "vue";
import { ElForm, ElFormItem, ElInput } from "element-plus"

export default defineComponent({
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    setup(props, ctx) {
        const { config } = props;
        const { fields } = config;
        return () => <ElForm>
            {
                fields.map(field => <ElFormItem label-width='50px'>{{
                    label: () => field.key,
                    default: () => <ElInput />
                }}</ElFormItem>)

            }
        </ElForm >;
    },
})