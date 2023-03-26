import { defineComponent } from "vue";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";


export default defineComponent({
    name: 'EditorComp',
    props: {
        modelValue: {
            type: String,
            required: false
        }
    },
    emits: ["update:modelValue"],
    setup(props, ctx) {
        return () => <div ref="editorRef"></div>;
    },
    mounted() {
        let startState = EditorState.create({
            doc: this.modelValue,
            extensions: [
                basicSetup,
                keymap.of(defaultKeymap),
                json(),
                EditorView.updateListener.of((v) => {
                    if (v.docChanged) {
                        this.$emit("update:modelValue", v.state.toJSON().doc);
                    }
                }),
            ],
        });

        let view = new EditorView({
            state: startState,
            parent: this.$refs.editorRef,
        });
    },
});