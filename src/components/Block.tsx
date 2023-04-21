import { defineComponent, resolveComponent, inject, toRef } from "vue";
import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton, ElCascader } from "element-plus";
import { Edit, Plus, Minus } from '@element-plus/icons-vue';
import PlainTextComp from "./PlainTextComp";
import FormComp from "./FormComp";
import ListComp from "./ListComp";
import { formCompContextKey } from "./constant";
import { upperFirstCharacter, getValueByPath } from "../utils/converter";
import CustomInputComp from "./custom/CustomInputComp";
import CustomTextareaComp from "./custom/CustomTextareaComp";
import CustomImageUploadComp from "./custom/CustomImageUploadComp";

const reserveTags = ['span', 'div', 'p']

function toRefByPath(obj: object, path: string) : any {
    const segments = path.split('.');
    const key = segments.pop();
    return toRef(getValueByPath(obj, segments.join('.')), key);
}

const Block = defineComponent({
    name: 'Block',
    components: {
        ElInput, ElSelect, ElOption, ElDatePicker, ElButton, ElCascader, Edit, Plus, Minus, ListComp, PlainTextComp, FormComp, CustomInputComp, CustomTextareaComp, CustomImageUploadComp
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

        // 数组循环渲染
        if (Array.isArray(config)) {
            return () => config.map(item => <Block config={item} field={fieldConfig} index={index} {...item.attrs}></Block>)
        }

        // 处理FormComp FormItemComp provide的属性
        const formInject = inject(formCompContextKey);
        const { model, emit } = formInject;

        const valueRef = index !== undefined
            ? toRef(fieldConfig?.key ? getValueByPath(model, fieldConfig.key) : model, index)
            : (fieldConfig?.key ? toRefByPath(model, fieldConfig.key) : toRef(formInject, 'model'));

        // 处理监听
        const listeners = {};
        if (config.trigger) {
            listeners[`on${upperFirstCharacter(config.trigger)}`] = () => {
                switch (config.triggerCb.type) {
                    case 'dialog':
                        emit('dialog', config.triggerCb, index, fieldConfig?.key);
                        break;
                    case 'insert':
                        let value = config.triggerCb.value;
                        if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
                            value = JSON.parse(JSON.stringify(value));
                        }
                        emit('insert', value, index, fieldConfig?.key);
                        break;
                    case 'remove':
                        emit('remove', index, fieldConfig?.key);
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
            // TODO 解析组件失败的情况
            return () => <component v-model={valueRef.value} index={index} config={config} field={fieldConfig} {...ctx.attrs} {...config.attrs} {...listeners}>{{
                ...slots
            }}</component>;
        }
    }
});

export default Block;
