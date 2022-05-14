import React from 'react';

// import { Icon, Picker as FPicker } from '@facejs/ui';

import S from './index.m.less';

export default function Picker({ value, onChange, placeholder = '请选择', options = [], ...reset }) {
    /** 根据数据value获取数据name显示 */
    const getPickerContent = () => {
        let selectOptions = [];
        if (options?.length > 0) {
            if (value?.length > 1) {
                options.map((item, index) => {
                    const selectIndex = item.findIndex((item) => item.id == value[index]);
                    selectOptions.push(item[selectIndex]);
                });
            } else if (value?.length === 1) {
                const selectIndex = options.findIndex((item) => item.id == value[0]);
                selectOptions = [options[selectIndex]];
            }
        }
        if (selectOptions.length) {
            return selectOptions.map((item) => item?.name).join(',');
        } else {
            return <div style={{ color: '#9aa0b1' }}>{placeholder}</div>;
        }
    };

    /** 根据picker选择选项index获取数据value */
    const pickerChange = (indexArr) => {
        let realValue = [];
        if (indexArr.length > 1) {
            options.map((item, index) => {
                const selectOption = item[indexArr[index]];
                realValue.push(selectOption.id);
            });
        } else if (indexArr.length === 1) {
            const selectOption = options[indexArr[0]];
            realValue = [selectOption.id];
        }
        onChange?.(realValue);
    };

    /** 根据数据value获取picker选中选项的index */
    const getPickerValues = () => {
        let selectIndexArr = [];
        if (value?.length > 1) {
            options.map((item, index) => {
                const selectIndex = item.findIndex((item) => item.id == value[index]);
                selectIndexArr.push(selectIndex);
            });
        } else if (value?.length === 1) {
            const selectIndex = options.findIndex((item) => item.id == value[0]);
            selectIndexArr = [selectIndex];
        }
        // 没有传入value，默认设置第一个索引，避免不切换column获取不到默认的第一个
        return selectIndexArr?.length > 0 ? selectIndexArr : [0];
    };

    return (
        <FPicker className={S.picker} {...reset} value={getPickerValues()} onChange={pickerChange} range={options}>
            <div className={S.content}>{getPickerContent()}</div>
            <Icon className={S.arrow} name="ic_direction_right" size={32} color="#babeca" />
        </FPicker>
    );
}

const FPicker = () => {}

const Icon = () => {}
