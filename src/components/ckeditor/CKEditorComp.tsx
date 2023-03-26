import { defineComponent } from "vue";

export default defineComponent({
    name: 'CKEditorComp',
    props: {
        modelValue: {
            type: String,
            required: false
        }
    },
    emits: ["update:modelValue"],
    setup(props, ctx) {
        return () => <div ref="ckEditorRef"></div>;
    },
    mounted() {
        import('../../../lib/ckeditor/build/ckeditor.js').then(module => {
            const { Editor } = module.default;
            Editor.create(this.$refs.ckEditorRef);
        })
    },
})