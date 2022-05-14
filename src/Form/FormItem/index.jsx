import React, { useContext, useLayoutEffect } from 'react';
import cn from 'classnames';

import FieldContext from '../context';

import S from './index.module.less';

export default function FormItem(props) {
    const {
        children,
        name,
        label,
        rules,
        layoutClass,
        itemClass,
        labelClass,
        controlClass,
        placeholder,
        options,
        ...reset
    } = props;

    const { getFieldValue, setFieldsValue, registerFieldEntities, getFieldErrorMsg, hideErrorMsg } = useContext(
        FieldContext
    );

    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    useLayoutEffect(() => {
        const unregister = registerFieldEntities({
            props,
            onStoreChange: forceUpdate,
        });
        return () => {
            unregister();
        };
    }, []);

    const getControlled = () => {
        return {
            ...reset,
            name,
            placeholder,
            options,
            value: getFieldValue(name),
            onChange: (e) => {
                const newValue = e?.target ? e.target.value : e;
                setFieldsValue({ [name]: newValue });
            },
        };
    };

    const isRequired = rules?.some((r) => r.required);

    return (
        <FormItemLayout
            name={name}
            label={label}
            required={isRequired}
            errorMsg={!hideErrorMsg && getFieldErrorMsg(name)}
            layoutClass={layoutClass}
            itemClass={itemClass}
            labelClass={labelClass}
            controlClass={controlClass}
        >
            {React.cloneElement(children, getControlled())}
        </FormItemLayout>
    );
}

function FormItemLayout(props) {
    const { name, label, errorMsg, required, children, layoutClass, itemClass, labelClass, controlClass } = props;
    return (
        <div className={cn(S.formItemLayout, layoutClass)}>
            <div className={cn(S.formItem, itemClass)}>
                {label && (
                    <label className={cn(S.label, { [S.required]: required }, labelClass)} htmlFor={name}>
                        {label}
                    </label>
                )}
                <div className={cn(S.control, controlClass)}>{children}</div>
            </div>
            {errorMsg && <div className={S.error}>{errorMsg}</div>}
        </div>
    );
}
