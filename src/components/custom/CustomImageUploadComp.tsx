import { defineComponent, ref } from "vue";
import { ElUpload, ElImage, ElIcon, ElProgress } from "element-plus";
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue';
import './CustomImageUploadComp.css';

export default defineComponent({
    name: 'CustomImageUploadComp',
    props: {
        modelValue: {
            type: String,
            required: false,
        }
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        const handleChange = (value: string) => {
            ctx.emit('update:modelValue', value)
        }

        const imageRef = ref();
        const loading = ref(false);
        const progress = ref(0);
        const onBeforeUpload = (file: File) => {
            console.log('可校验文件', file);
        }
        let timer: number | null;
        const httpRequest = (option: any) => {
            console.log(option);
            loading.value = true;
            progress.value = 0;
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            timer = setInterval(() => {
                if (progress.value >= 100) {
                    clearInterval(timer as number);
                    timer = null;
                    loading.value = false;
                    const url = URL.createObjectURL(option.file);
                    handleChange(url);
                } else {
                    progress.value++;
                    console.log(progress.value);
                }
            }, 40)
        }
        const abort = () => {
            clearInterval(timer as number);
            timer = null;
            loading.value = false;
        }
        return () =>
            <div class='custom-image-upload-comp'>{
                props.modelValue
                    ? [
                        // 图片
                        <ElImage ref={imageRef} src={props.modelValue} zoom-rate={1.2} preview-src-list={[props.modelValue]} fit="contain" />,
                        // 操作
                        <span class="hover-action-wrap">
                            <ElIcon onClick={() => imageRef.value.$el?.querySelector('img')?.click()}><ZoomIn /></ElIcon>
                            &nbsp;
                            &nbsp;
                            <ElIcon onClick={() => handleChange('')}><Delete /></ElIcon>
                        </span>
                    ]
                    : [
                        // 上传组件
                        <ElUpload class="image-uploader" action={"#"} fileList={[]} show-file-list={false} limit={1} before-upload={onBeforeUpload} http-request={httpRequest}>
                            <ElIcon v-show={!loading.value}><Plus /></ElIcon>
                        </ElUpload>,
                        // 进度条
                        loading.value
                            ? <span class="hover-action-wrap">
                                <ElProgress type="circle" percentage={progress.value}>
                                    <div class="progress-text">{`${progress.value.toFixed(1)}%`}</div>
                                    <ElIcon onClick={abort}><Delete /></ElIcon>
                                </ElProgress>
                            </span>
                            : null
                    ]
            }</div>;
    }
});