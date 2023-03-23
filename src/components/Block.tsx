import { defineComponent, resolveComponent } from "vue";
import { ElInput, ElSelect, ElOption, ElDatePicker } from "element-plus";

const reserveTags = ['span', 'div', 'p']

export default defineComponent({
    components: {
        ElInput, ElSelect, ElOption, ElDatePicker
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        field: {
            type: Object,
            required: false
        }
    },
    setup(props, ctx) {
        const { config, field } = props;
        const component = reserveTags.includes(config.tag) ? config.tag : resolveComponent(config.tag);
        return () => <component>{config.value}</component>;
    }
});
