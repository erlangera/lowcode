import { defineComponent } from "vue";
import { ElInput } from "element-plus";

export default defineComponent({
    name: 'CustomTextareaComp',
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
        const handleChange = (value: string) => {
            ctx.emit('update:modelValue', value)
        }
        return () => <div style={{width: '100%', position: 'relative'}}>{[
            <ElInput modelValue={props.modelValue} onUpdate:modelValue={handleChange} type={'textarea'} autosize={{ minRows: 4, maxRows: 8 }}></ElInput >,
            props.maxLength && <div style={{ color: props.modelValue?.length! > props.maxLength ? 'red' : '', position: 'absolute', right: '2px', bottom: '0' }}>
                {props.modelValue?.length + '/' + props.maxLength}
            </div> 
            ]}</div>
    },
});