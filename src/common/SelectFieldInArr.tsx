import React, {FC} from 'react';
import Select, {OnChangeValue, StylesConfig} from "react-select";
import {useField} from "formik";
import styles from "./Form.module.sass";
import {optionTypeDoor} from "./SelectField";



type SelectFieldType = {
    options: optionTypeDoor[],
    name: string,
    val: optionTypeDoor | null,
    arrIndex: number,
    placeholder?: string
}

const SelectFieldInArr: FC<SelectFieldType> = ({options, name, val, arrIndex, placeholder = ""}) => {
    const [field, meta, {setValue}] = useField(name);
    const {value} = field
    const {error, touched} = meta;


    const onChange = (fullVal: OnChangeValue<optionTypeDoor, false>) => {
        const newVal = {...value[arrIndex], name: fullVal?.label, width: fullVal?.width, height: fullVal?.height};
        value.splice(arrIndex, 1, newVal);
        if (value) setValue(value);
    };

    const customStyles: StylesConfig<optionTypeDoor, false> = {
        control: (styles, state) => ({
            position: 'relative',
            background: 'transparent',
            maxWidth: '300px',
            border: state.isFocused ? '2px solid #FFCE90' : '2px solid #000',
            borderRadius: '6px',
            font: '400 16px/20px Inter, sans-serif',
            transition: 'all .2s ease',
            display: 'grid',
            gridTemplateColumns: '1fr 25px',
            gap: '10px',
            margin: 0,
            ':hover': {
                borderColor: '#FFCE90'
            }
        }),

        container: (baseStyles) => ({
            ...baseStyles,
            maxWidth: '300px',
        }),
        indicatorsContainer: (base) => ({
            ...base,
            marginRight: '5px'
        }),
        dropdownIndicator: () => ({
            width: '20px',
            height: '20px',
        }),
        valueContainer: (baseStyles) => ({
            ...baseStyles,
            padding: '5.5px 10px'
        }),
        placeholder: (baseStyles) => ({
            ...baseStyles,
            cursor: "pointer"
        }),
        menu: () => ({
            borderRadius: '9px',
            boxShadow: '0px 59px 65px -8px rgba(48,36,20, 0.52182), 0px 30px 36px -7px rgba(29,24,14, 0.413297), 0px 10px 8px -7px rgba(0,0,0, 0)',
            backgroundColor: 'rgba(255,255,255, 1)',
            maxHeight: "300px",
            width: '100%',
            position: 'absolute',
            overflow: 'hidden',
            zIndex: 2,
        }),
        option: () => ({
            font: '400, 16px/20px Inter',
            padding: '5px 10px',
            color: 'black',
            cursor: 'pointer',
            transition: 'all .2s ease',
            ':hover': {
                backgroundColor: 'rgba(255,206,144, 1)',

            }
        }),


    }
    return (
        <div
            className={[styles.row, styles.select, value && styles.active, error && touched ? 'error' : ''].join(' ')}>
            {touched && error ? <div className={styles.error}>{error}</div> : ''}

            <Select options={options}
                    onChange={onChange}
                    placeholder={placeholder}
                    styles={customStyles}
                    isSearchable={false}
                    defaultValue={val}
                    value={val}
            />
        </div>
    )
};

export default SelectFieldInArr;
