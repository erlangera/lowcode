import { defineComponent, resolveComponent, inject } from "vue";
import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton } from "element-plus";
import { Edit, Plus, Minus } from '@element-plus/icons-vue';
import PlainTextComp from "./PlainTextComp";
import FormComp from "./FormComp";
import { formCompContextKey, formItemCompContextKey } from "./constant";
import { upperFirstCharacter } from "../utils/converter";
import CustomInputComp from "./custom/CustomInputComp";

const reserveTags = ['span', 'div', 'p']

const Block = defineComponent({
    name: 'Block',
    components: {
        ElInput, ElSelect, ElOption, ElDatePicker, ElButton, Edit, Plus, Minus, PlainTextComp, FormComp, CustomInputComp
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        field: {
            type: Object,
            required: false
        },
        index: {
            type: Number,
            required: false
        }
    },
    setup(props, ctx) {
        const { config, field: fieldConfig, index } = props;

        // 处理FormComp FormItemComp provide的属性
        const { model, openDialog } = inject(formCompContextKey);
        const { insert, remove } = inject(formItemCompContextKey);

        // list
        if (config.type === 'list') {
            return () => model[fieldConfig.key].map((_, i) => <Block config={config.item} field={fieldConfig} index={i}></Block>)
        }

        // 子表单
        if (config.type === 'form') {
            return () => index !== undefined
                ?
                <FormComp v-model={model[fieldConfig.key][index]} index={index} config={config} ></FormComp>
                :
                <FormComp v-model={model[fieldConfig.key]} config={config} ></FormComp>;
        }

        if (Array.isArray(config)) {
            return () => config.map(item => <Block config={item} field={fieldConfig} index={index} {...item.attrs}></Block>)
        }


        // 处理监听
        const listeners = {};
        if (config.trigger) {
            listeners[`on${upperFirstCharacter(config.trigger)}`] = () => {
                switch (config.triggerCb.type) {
                    case 'dialog':
                        openDialog(fieldConfig.key, config.triggerCb.form, index);
                        break;
                    case 'insert':
                        let value = config.triggerCb.value;
                        if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
                            value = JSON.parse(JSON.stringify(value));
                        }
                        insert(value);
                        break;
                    case 'remove':
                        remove(index);
                        break;
                    default:
                        break;
                }
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
                slots[key] = () => slot.map(item => <Block config={item} field={fieldConfig} index={index} key={item.key || item.value} {...item}></Block>);
            }
        }

        // 渲染
        if (reserveTags.includes(config.tag)) {
            // 原生标签
            return () => <config.tag {...config.attrs} index={index}>{config.value}</config.tag>
        } else {
            // 组件
            const component = resolveComponent(config.tag);
            return () => index !== undefined
                ?
                <component v-model={model[fieldConfig.key][index]} index={index} {...config.attrs} {...listeners}>{{
                    ...slots
                }}</component>
                :
                <component v-model={model[fieldConfig.key]} {...config.attrs} {...listeners}>{{
                    ...slots
                }}</component>;
        }
    }
});

export default Block;
