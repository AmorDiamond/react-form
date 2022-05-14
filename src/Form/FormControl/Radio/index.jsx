import React from 'react';
import cn from 'classnames';

// import { Radio as FRadio, View } from '@facejs/ui';

import S from './index.m.less';

export default function Radio({ value, onChange, options, name }) {
    const radioOptions = options?.map((item) => {
        if (value == item.value) {
            item.checked = true;
        }
        return item;
    });
    return (
        <div>
            <FRadio.Group
                type={'tag'}
                name={name}
                options={radioOptions}
                renderItem={(item) => {
                    return <div className={cn(S.tag, item.checked && S.checkTag)}>{item.label}</div>;
                }}
                onChange={(selected) => {
                    onChange(selected.value);
                }}
            />
        </div>
    );
}

const FRadio = () => {}
FRadio.Group = () => {}