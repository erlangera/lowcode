import { defineComponent, watch } from "vue";
import { ElInput } from "element-plus";

export default defineComponent({
    name: 'CustomInputComp',
    props: {
        modelValue: {
            type: String,
            required: false,
        },
        maxLength: {
            type: Number,
            required: false
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const handleChange = (value) => {
            // debugger
            console.log(value)
            ctx.emit('update:modelValue', value)
        }
        return () => <ElInput modelValue={props.modelValue} onUpdate:modelValue={handleChange}>{{
            append: () => <div style={{ color: props.modelValue.length > props.maxLength ? 'red' : '' }}>
                {props.modelValue.length + '/' + props.maxLength}
            </div>
        }}</ElInput >
    },
});