import React from 'react';

import S from './index.module.less';

export default function Input({ onChange, value, placeholder = '请输入' }) {
    return <input value={value} onChange={onChange} className={S.input} placeholder={placeholder} />;
}
