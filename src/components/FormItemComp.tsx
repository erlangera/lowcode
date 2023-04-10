import { defineComponent, defineAsyncComponent, provide, inject } from "vue";
import { ElFormItem } from "element-plus";
import { formCompContextKey, formItemCompContextKey } from "./constant";

function formatToElementRules(config) {
    let res = [];
    if (config.required) {
        res.push({
            required: true,
            message: 'Not empty.'
        })
    }
    if (Array.isArray(config.rules)) {
        res = res.concat(config.rules);
    } else if (typeof config.rules === 'object' && config.rules !== null) {
        res.push(config.rules);
    }
    return res;
}

export default defineComponent({
    name: 'FormItemComp',
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    components: {
        // 通过异步组件解决循环依赖问题
        Block: defineAsyncComponent(() => import("./Block"))
    },
    setup(props, ctx) {
        const { config } = props;

        // 处理FormComp provide的属性
        const { model } = inject(formCompContextKey);
        const insert = (value) => {
            model[config.key].push(value);
        }
        const remove = (index) => {
            model[config.key].splice(index, 1);
        }
        provide(formItemCompContextKey, {
            insert,
            remove,
        })
        const rules = formatToElementRules(config) ?? [];
        return () => <ElFormItem prop={config.key} rules={rules} {...config.attrs}>{{
            label: () => <Block config={config.slots.label} field={config}></Block>,
            default: () => <Block config={config.slots.default} field={config}></Block>
        }}</ElFormItem >
    }
});
