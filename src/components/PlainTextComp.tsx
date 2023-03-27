import { defineComponent, toRef } from "vue";

export default defineComponent({
    name: 'PlainTextComp',
    props: {
        modelValue: {
            required: true
        }
    },
    setup(props, ctx) {
        return () => <div>{JSON.stringify(props.modelValue)}</div>
    }
});