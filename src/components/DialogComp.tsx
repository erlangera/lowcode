import { defineComponent } from "vue";
import { ElDialog } from "element-plus";

export default defineComponent({
    name: 'DialogComp',
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    setup(props, ctx) {
        const { config } = props;
        console.log(config)
        return () => <ElDialog></ElDialog >
    }
});