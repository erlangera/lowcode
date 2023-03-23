import { defineComponent, ref } from "vue";
import { ElForm } from "element-plus"
import FormItemComp from "./FormItemComp";
import { config2Form } from "../utils/converter.js"

export default defineComponent({
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    setup(props, ctx) {
        const { config } = props;
        const form = ref(config2Form(config));
        console.log(form);
        const { fields } = config;
        return () => <ElForm model={form}>
            {
                fields.map(field => <FormItemComp config={field}></FormItemComp>)
            }
        </ElForm >;
    },
})