import { defineComponent, defineAsyncComponent } from "vue";
import { ElFormItem } from "element-plus";

function formatToElementRules(config: Record<string, any>) {
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

        const rules = formatToElementRules(config) ?? [];
        
        // 处理插槽 利用了递归组件
        const slots = {}
        if (config.slots) {
            for (let key in config.slots) {
                let slot = config.slots[key];
                if (!Array.isArray(slot)) {
                    slot = [slot]
                }
                // @ts-ignore
                slots[key] = () => slot.map(item => <Block config={item} field={config} key={item.key || item.value} {...item.attrs}></Block>);
            }
        }
        return () => <ElFormItem prop={config.key} rules={rules} {...config.attrs}>{{
            ...slots
        }}</ElFormItem >
    }
});
