import { defineComponent } from "vue";
import { ElTransfer } from "element-plus";

export default defineComponent({
    name: 'CustomTransferComp',
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
        const handleChange = (value) => {
            ctx.emit('update:modelValue', value)
        }
        return () => <ElTransfer modelValue={props.modelValue} onUpdate:modelValue={handleChange}
            titles={['Select items', 'Selected']} filterable filter-placeholder={"Search..."} data={props.config.data} />
    }
});
