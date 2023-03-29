import { defineComponent, resolveComponent, inject } from "vue";
import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton } from "element-plus";
import { Edit, Plus } from '@element-plus/icons-vue';
import PlainTextComp from "./PlainTextComp";
import { formCompContextKey } from "./constant";
import { upperFirstCharacter } from "../utils/converter";

const reserveTags = ['span', 'div', 'p']

const Block = defineComponent({
    name: 'Block',
    components: {
        ElInput, ElSelect, ElOption, ElDatePicker, ElButton, PlainTextComp, Edit, Plus
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
            return () => config.map(item => <Block config={item} field={fieldConfig} {...item.attrs}></Block>)
        }

        // 处理FormComp provide的属性
        const { model, openDialog } = inject(formCompContextKey);

        // 处理监听
        const listeners = {};
        if (config.trigger) {
            listeners[`on${upperFirstCharacter(config.trigger)}`] = () => {
                switch (config.triggerCb.type) {
                    case 'dialog':
                        openDialog(fieldConfig.key, config.triggerCb.form);
                        break;
                    case 'insert':
                        const defaultSlot = fieldConfig.slots.default;
                        const index = defaultSlot.length - 1;
                        // 配置中传入index方便绑定值及相关操作
                        const item = Array.isArray(config.triggerCb.item)
                            ?
                            config.triggerCb.item.map(item => ({ ...JSON.parse(JSON.stringify(item)), index }))
                            :
                            { ...config.triggerCb.item, index };
                        defaultSlot.splice(index, 0, item);
                        // 初始化值
                        model[fieldConfig.key][index] = config.triggerCb.default;
                        break;
                    case 'remove':
                        model[fieldConfig.key].splice(config.index, 1);
                        fieldConfig.slots.default.splice(config.index, 1);
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
            return () => config.index !== undefined
                ?
                <component v-model={model[fieldConfig.key][config.index]} {...config.attrs} {...listeners}>{{
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
