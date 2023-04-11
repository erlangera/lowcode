import { defineComponent, toRef } from "vue";

export default defineComponent({
    name: 'PlainTextComp',
    props: {
        modelValue: {
            required: true
        }
    },
    setup(props, ctx) {
        return () => <div style={'word-break: break-word;'}>{JSON.stringify(props.modelValue)}</div>
    }
});