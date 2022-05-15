import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { isEmpty } from 'lodash-es';

import FieldContext from './context';
import useForm from './useForm';
import FormItem from './FormItem';

function FormComp(
    { children, form, onFinish, onFinishFailed, onValuesChange, hideErrorMsg, initialValues, className },
    ref
) {
    const [formInstance] = useForm(form);
    useEffect(() => {
        if (!isEmpty(initialValues)) {
            formInstance.setInitialValues(initialValues);
        }
    }, []);

    useImperativeHandle(ref, () => formInstance);

    formInstance.setCallbacks({
        onFinish,
        onFinishFailed,
        onValuesChange,
    });
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                formInstance.submit();
            }}
            className={className}
        >
            <FieldContext.Provider value={{ ...formInstance, hideErrorMsg }}>{children}</FieldContext.Provider>
        </form>
    );
}

const Form = forwardRef(FormComp);
Form.Item = FormItem;
export default Form;
