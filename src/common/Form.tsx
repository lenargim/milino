import {FC} from "react";
import styles from './Form.module.sass'
import {useField, ErrorMessage, Field} from "formik";
import CheckSvg from "../assets/img/CheckSvg";
import noImg from "../assets/img/noPhoto.png"

function handleFocus(input: HTMLInputElement): void {
    input.classList.add(`${styles.focused}`);
}

function handleBlur(input: HTMLInputElement, setTouched: (state: boolean) => void) {
    setTouched(true)
    if (input.value === '') input.classList.remove(`${styles.focused}`);
}

interface InputInterface {
    className?: string,
    name: string,
}

interface textInputInterface extends InputInterface {
    disabled?: boolean,
    type: 'text' | 'number' | 'email' | 'password' | 'date',
    label: string,
}
type option = {
    value: string,
    img?: string
}

type selectType = {
    name: string,
    label: string,
    options: option[],
    filter?: object,
}

interface RadioInterface extends InputInterface {
    img?: string,
    value: string,
    checked?: boolean,
    a?: number
}

interface ProductRadioInterface extends InputInterface {
    value: string,
}

interface ProductDimensionRadioCustomInterface extends InputInterface {
    value: null | number,
}

interface ProductOptionsRadioInterface extends InputInterface {
    value: string,
}

export const TextInput: FC<textInputInterface> = ({
                                                      className = '',
                                                      name,
                                                      label,
                                                      disabled = false,
                                                      type = 'text',
                                                  }) => {
    const [field, meta, helpers] = useField(name);
    const {error, touched} = meta;
    const length = field?.value?.length ?? 0;

    return (
        <div className={[styles.row, error && touched ? 'error' : null, className].join(' ')}>
            <Field
                className={[styles.input, length ? `${styles.focused}` : null, error && touched ? styles.inputError : null,].join(' ')}
                type={type}
                name={name}
                id={name}
                disabled={disabled}
                onFocus={(e: any) => handleFocus(e.target)}
                onBlur={(e: any) => handleBlur(e.target, helpers.setTouched)}
            />
            <label className={styles.label} htmlFor={name}>{label}</label>
            <ErrorMessage name={name} component="div" className={styles.error}/>
        </div>
    );
};

export const RadioInput: FC<RadioInterface> = ({name, value, className, img = noImg, checked = false, a}) => {
    const [field] = useField(name)
    return (
        <div className={[className, styles.checkboxSelect].join(' ')}>
            <Field type="radio" checked={checked} name={name} value={value} id={`${name}_${value}`}/>
            <label htmlFor={`${name}_${value}`} className={styles.radioLabel}>
                <img src={img} alt={value} className={styles.radioImg}/>
                <span>{value}</span>
                {field.value === value && <CheckSvg classes={styles.checked}/>}
            </label>
        </div>
    )
}

export const RadioInputGrain: FC<RadioInterface> = ({name, value, className, img = noImg, checked = false, a}) => {
    console.log(`${value} ${checked}`)
    const [field, , helpers] = useField(name);

    const handleChange = (inputElement: HTMLInputElement) => {
        helpers.setValue(inputElement.value)
    }
    return (
        <div className={[className, styles.checkboxSelect].join(' ')}>
            <Field type="radio" checked={checked} onChange={(e:any) => handleChange(e.target)} name={name} value={value} id={`${name}_${value}`}/>
            <label htmlFor={`${name}_${value}`} className={styles.radioLabel}>
                <img src={img} alt={value} className={styles.radioImg}/>
                <span>{value}</span>
                {field.value === value && <CheckSvg classes={styles.checked}/>}
            </label>
        </div>
    )
}


export const ProductRadioInputDimentions: FC<ProductDimensionRadioCustomInterface> = ({name, value, className}) => {
    const [field, , helpers] = useField(name)


    function convert(input: HTMLInputElement): void {
        helpers.setValue(+input.value)
    }

    return (
        <div className={[className, styles.productRadio].join(' ')}>
            <Field
                onChange={(e: any) => convert(e.target)}
                type="radio" name={name} value={value}
                id={`${name}_${value}`}/>
            <label htmlFor={`${name}_${value}`}
                   className={styles.radioLabel}><span>{value ? value : `Custom ${name}`}</span></label>
        </div>
    )
}

export const ProductRadioInput: FC<ProductRadioInterface> = ({name, value, className}) => {

    return (
        <div className={[className, styles.productRadio].join(' ')}>
            <Field
                type="radio" name={name} value={value}
                id={`${name}_${value}`}/>
            <label htmlFor={`${name}_${value}`}
                   className={styles.radioLabel}><span>{value}</span></label>
        </div>
    )
}

export const ProductRadioInputCustom: FC<ProductDimensionRadioCustomInterface> = ({name, value, className}) => {
    return (
        <div className={[className, styles.productText].join(' ')}>
            <label htmlFor={name}>
                <Field
                    type="number"
                    name={name}
                    id={name}
                    placeholder={name}
                />
            </label>
            <ErrorMessage name={name} component="div" className={styles.error}/>
        </div>
    )
}

export const ProductOptionsInput: FC<ProductOptionsRadioInterface> = ({name, className, value}) => {

    return (
        <div className={[className, styles.productRadio].join(' ')}>
            <Field
                type="checkbox" name={'Options'} value={value}
                id={value}/>
            <label htmlFor={value}
                   className={styles.radioLabel}><span>{value}</span></label>
        </div>
    )
}