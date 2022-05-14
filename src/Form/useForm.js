// 定义状态管理
import { useRef } from 'react';

class FormStore {
    constructor() {
        this.store = {}; // 状态值： name: value
        this.fieldEntities = [];

        this.callbacks = {};
        this.errorsMsg = {}; // 表单错误信息
        this.initialValues = {};
    }

    setCallbacks = (callbacks) => {
        this.callbacks = { ...this.callbacks, ...callbacks };
    };

    // 注册实例(组件props和forceUpdate)，返回销毁实例的方法
    registerFieldEntities = (entity) => {
        this.fieldEntities.push(entity);

        return () => {
            this.fieldEntities = this.fieldEntities.filter((item) => item !== entity);
            delete this.store[entity.props.name];
            delete this.errorsMsg[entity.props.name];
        };
    };

    getFieldErrorMsg = (name) => {
        return this.errorsMsg[name];
    };

    getFieldsValue = () => {
        return { ...this.store };
    };

    getFieldValue = (name) => {
        return this.store[name];
    };

    setFieldsValue = (newStore) => {
        // 1. update store
        this.store = {
            ...this.store,
            ...newStore,
        };
        // 2. update Field
        this.fieldEntities.forEach((entity) => {
            Object.keys(newStore).forEach((k) => {
                if (k === entity.props.name) {
                    // 校验表单数据
                    this.validate(k, newStore[k], entity.props.rules);
                    // 更新表单
                    entity.onStoreChange();
                }
            });
        });
        this.callbacks.onValuesChange?.(newStore, this.store);
    };

    setInitialValues = (initialValues) => {
        this.initialValues = initialValues || {};
        const storeValues = this.getFieldsValue();
        this.setFieldsValue({ ...initialValues, ...storeValues });
    };

    requiredValidate = (value) => {
        return !(value === undefined || value === '');
    };
    patternValidate = (value, pattern) => {
        const reg = new RegExp(pattern);
        return reg.test(value);
    };

    validate = (name, value, rules) => {
        let err = [];
        // 简版校验
        if (rules?.length > 0) {
            rules.forEach((rule) => {
                if (rule.required && !this.requiredValidate(value)) {
                    err.push({ name, message: rule.message, value });
                } else if (rule.pattern && !this.patternValidate(value, rule.pattern)) {
                    err.push({ name, message: rule.message, value });
                } else if (rule.validator && !rule.validator(value)) {
                    err.push({ name, message: rule.message, value });
                }
            });

            if (err.length > 0) {
                // 保存错误信息
                const [firstErr] = err;
                this.errorsMsg[name] = firstErr.message;
            } else if (this.errorsMsg[name]) {
                // 删除错误信息
                delete this.errorsMsg[name];
            }
        }
        return err;
    };

    validateFields = () => {
        return new Promise((resolve, reject) => {
            let allErr = [];
            this.fieldEntities.forEach((entity) => {
                const { name, rules } = entity.props;

                const value = this.getFieldValue(name);
                const err = this.validate(name, value, rules);
                if (err.length > 0) {
                    allErr = [...allErr, ...err];
                    err.forEach((k) => {
                        if (k.message) {
                            // 有错误信息更新组件，显示错误提示
                            entity.onStoreChange();
                        }
                    });
                }
            });
            if (allErr.length > 0) {
                reject(allErr);
            } else {
                resolve(this.getFieldsValue());
            }
        });
    };

    submit = () => {
        // 提交
        const { onFinish, onFinishFailed } = this.callbacks;
        this.validateFields()
            .then(() => {
                // 校验通过
                onFinish?.(this.getFieldsValue());
            })
            .catch((err) => {
                // 校验不通过
                onFinishFailed?.(err, this.getFieldsValue());
            });
    };

    getForm = () => {
        return {
            getFieldsValue: this.getFieldsValue,
            getFieldValue: this.getFieldValue,
            setFieldsValue: this.setFieldsValue,
            registerFieldEntities: this.registerFieldEntities,
            submit: this.submit,
            setCallbacks: this.setCallbacks,
            getFieldErrorMsg: this.getFieldErrorMsg,
            validateFields: this.validateFields,
            setInitialValues: this.setInitialValues,
        };
    };
}

export default function useForm(form) {
    // 存值，在组件卸载之前指向的都是同一个值
    const formRef = useRef();

    if (!formRef.current) {
        if (form) {
            formRef.current = form;
        } else {
            const formStore = new FormStore();
            formRef.current = formStore.getForm();
        }
    }
    return [formRef.current];
}
