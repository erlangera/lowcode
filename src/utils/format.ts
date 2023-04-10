export function formatFromList<T extends string | number>(key: T, list: Array<{ label: any, key: T }>): any {
    const item = list.find(item => item.key === key);
    if (item) {
        return item.slots?.label?.value;
    } else {
        return key;
    }
}