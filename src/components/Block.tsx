import { defineComponent, resolveComponent, inject } from "vue";
import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton } from "element-plus";
import PlainTextComp from "./PlainTextComp";
import { formCompContextKey } from "./constant";
import { upperFirstCharacter } from "../utils/converter";

const reserveTags = ['span', 'div', 'p']

const Block = defineComponent({
    name: 'Block',
    components: {
        ElInput, ElSelect, ElOption, ElDatePicker, ElButton, PlainTextComp
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
        const { config, field: fieldConfig } = props;
        
        if (Array.isArray(config)) {
            return () => config.map(item => <Block config={item} field={fieldConfig}></Block>)
        }

        // 处理FormComp provide的属性
        const formContext = inject(formCompContextKey);
        const { model, openDialog } = formContext;

        // 处理监听
        const listeners = {};
        if (config.trigger) {
            listeners[`on${upperFirstCharacter(config.trigger)}`] = () => {
                openDialog(fieldConfig.key, config.triggerCb.form);
            }
        }

        // 处理插槽 利用了递归组件
        const slots = {}
        if (config.slots) {
            for (let key in config.slots) {
                let slot = config.slots[key];
                if (!Array.isArray(slot)) {
                    slot = [slot]
                }
                slots[key] = () => slot.map(item => <Block config={item} field={fieldConfig} key={item.key || item.value} {...item}></Block>);
            }
        }

        // 渲染
        if (reserveTags.includes(config.tag)) {
            // 原生标签
            return () => <config.tag {...config.attrs}>{config.value}</config.tag>
        } else {
            // 组件
            const component = resolveComponent(config.tag);
            return () => <component v-model={model[fieldConfig.key]} {...config.attrs} {...listeners}>{{
                ...slots
            }}</component>;
        }
    }
});

export default Block;
