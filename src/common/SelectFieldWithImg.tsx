import React, {FC, useEffect} from 'react';
import Select, {OnChangeValue, StylesConfig} from "react-select";
import {useField} from "formik";
import styles from "./Form.module.sass";
import {materialsData} from "../helpers/materialsTypes";


type SelectFieldType = {
    options: materialsData[],
    name: string,
    val: materialsData
}

const SelectFieldWithImg: FC<SelectFieldType> = ({options, name, val}) => {
    const [field, meta, {setValue}] = useField(name);
    const onChange = (value: OnChangeValue<materialsData, false>) => {
        if (value) setValue(value.value);
    };
    useEffect(() => {
        if (field.value && !val) {
            setValue('')
        }
    }, [val])

    const customStyles: StylesConfig<materialsData, false> = {
        control: (styles, state) => ({
            position: 'relative',
            background: 'transparent',
            maxWidth: '600px',
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
            padding: '2px',
        }),

        placeholder: (baseStyles) => ({
            ...baseStyles,
            cursor: "pointer"
        }),
        menu: () => ({
            borderRadius: '9px',
            boxShadow: '0px 59px 65px -8px rgba(48,36,20, 0.52182), 0px 30px 36px -7px rgba(29,24,14, 0.413297), 0px 10px 8px -7px rgba(0,0,0, 0)',
            backgroundColor: 'rgba(255,255,255, 1)',
            maxHeight: "600px",
            width: '100%',
            position: 'absolute',
            overflow: 'hidden',
            zIndex: 4,
        })
    }
    return (
        <div
            className={[styles.row, styles.selectImg].join(' ')}>
            <Select options={options}
                    onChange={onChange}
                    styles={customStyles}
                    isSearchable={false}
                    defaultValue={val}
                    value={val}
                    formatOptionLabel={el => (
                        <div className={styles.selectImgOption}>
                            <img src={el.img} alt={el.value}/>
                            <span>{el.value}</span>
                        </div>
                    )}
                    placeholder={val.value}

            />
        </div>
    )
};

export default SelectFieldWithImg;
