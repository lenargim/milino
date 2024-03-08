import * as Yup from 'yup';

export const CheckoutSchema = Yup.object({
    company: Yup.string()
        .required('Please write down your company name'),
    project: Yup.string()
        .required('Please write down your project name'),
    email: Yup.string()
        .email('E-mail is not valid')
        .required('Please write down your e-mail'),
    phone: Yup.string()
        .required('Please write down your phone number')
})