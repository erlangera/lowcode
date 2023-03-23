import { defineComponent } from "vue";
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
        const from = config2Form(config);
        console.log(from);
        const { fields } = config;
        return () => <ElForm >
            {
                fields.map(field => <FormItemComp config={field}></FormItemComp>)

            }
        </ElForm >;
    },
})