import { defineComponent } from "vue";

export default defineComponent({
    name: 'PlainTextComp',
    props: {
        modelValue: {
            required: true
        }
    },
    setup(props, ctx) {
        return () => <div style={'word-break: break-word;'}>
            { typeof props.modelValue === 'string' ? props.modelValue : JSON.stringify(props.modelValue)}
        </div>
    }
});