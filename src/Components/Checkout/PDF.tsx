import React, {FC} from 'react';
import {Page, Text, View, Document, StyleSheet, Image} from '@react-pdf/renderer';
import {CheckoutType} from "../../helpers/types";
import {CartItemType} from "../../store/reducers/generalSlice";
import {getCartTotal, getImg} from "../../helpers/helpers";
import logo from './../../assets/img/black-logo.jpg'
import CartItemOptions from "./PDF/CartItemOptions";

export const s = StyleSheet.create({
    page: {
        padding: '2vh 2vw',
        display: "flex",
        flexDirection: "column",
        gap: "3vh"
    },
    logo: {
        width: '200px',
        margin: '30px auto'
    },
    table: {
        display: 'flex',
        flexDirection: "column",
        borderTop: '1px solid #000',
        borderLeft: '1px solid #000',
        borderRight: '1px solid #000',
        borderRadius: '3px',
    },
    cartItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        gap: '15px',
        padding: '0.5vw',
        borderBottom: "1px solid #000"
    },
    itemPrice: {
        display: "flex",
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
        width: '15vw'
    },
    img: {
        display: "flex",
        maxWidth: "20vw"
    },
    data: {
        width: '50vw'
    },
    itemName: {
        fontSize: 19,
        fontWeight: 'semibold'
    },
    category: {
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "italic",
        color: "gray",
        marginBottom: '3px'
    },
    note: {
        paddingTop: '6pt',
        fontSize: '13px',
        fontStyle: 'italic'
    },
    sum: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: 1.2,
        width: '10vw'
    },
    th0: {
        display: "flex",
        flexDirection: 'row',
        alignItems: "center",
        fontSize: 12,
        width: "2vw",
        borderRight: '1px solid #000'
    },
    th1: {
        fontSize: 12,
        width: '20vw'
    },
    th2: {
        fontSize: 12,
        width: '50vw'
    },
    th3: {
        fontSize: 12,
        width: '15vw'

    },
    th4: {
        fontSize: 12,
        width: '10vw'
    },
    cartTotal: {
        fontSize: '20px',
        flexDirection: "row",
        justifyContent: "flex-end",
        height: '30px',
        width: '100%',
        textAlign: 'right',
        paddingRight: '5px'
    },
    itemOption: {
        fontSize: '12px'
    },
    blocks: {
        display: "flex",
        flexDirection: "column",
        gap: '5px',
    },
    h2: {
        fontSize: '14px',
        marginBottom: '5px'
    }
})

type StrType = {
    categoryStr: string | null,
    doorStr: string | null,
    boxMaterialStr: string | null,
    drawerStr: string | null,
    leatherStr: string | null,
}

const PDF: FC<{ values: CheckoutType, cart: CartItemType[], str: StrType }> = ({values, cart, str}) => (
    <Document language="en">
        <Page orientation="landscape" style={s.page}>
            <Image style={s.logo} src={logo}/>
            <View>
                <Text>Company name: {values.company}</Text>
                <Text>Project: {values.project}</Text>
                <Text>Email: {values.email}</Text>
                <Text>Phone: {values.phone}</Text>
            </View>
            <View>
                <Text>Door: {str.doorStr}</Text>
                <Text>Box Material: {str.boxMaterialStr}</Text>
                <Text>Drawer: {str.drawerStr}</Text>
                {str.leatherStr ? <Text>Leather: {str.leatherStr}</Text> : null}
            </View>
        </Page>
        <Page orientation="landscape" style={s.page}>
            <View style={s.table}>
                <View style={s.cartItem}>
                    <View style={s.th0}><Text>#</Text></View>
                    <View style={s.th1}><Text>Img</Text></View>
                    <View style={s.th2}><Text>Description</Text></View>
                    <View style={s.th3}><Text>Price</Text></View>
                    <View style={s.th4}><Text>Product total</Text></View>
                </View>
                {cart.map((el, index) => {
                    const image = getImg(el.category === 'Custom Parts' ? 'products-checkout/custom' : 'products-checkout', el.img);
                    return (
                        <View wrap={false} style={s.cartItem} key={index}>
                            <View style={s.th0}><Text>{++index}</Text></View>
                            <View style={s.img}>
                                <Image src={image}/>
                            </View>
                            <View style={s.data}>
                                <Text style={s.itemName}>{el.name}</Text>
                                <Text style={s.category}>{el.category}</Text>
                                <CartItemOptions el={el}/>
                                {el.note ? <Text style={s.note}>*{el.note}</Text> : null}
                            </View>
                            <View style={s.itemPrice}>
                                <Text>{el.price}$ x {el.amount}</Text>
                            </View>
                            <View style={s.sum}>
                                <Text>{(el.price * el.amount).toFixed(1)}$</Text>
                            </View>
                        </View>
                    )
                })}
            </View>
            <View style={s.cartTotal}><Text>Total ${getCartTotal(cart)}</Text></View>
        </Page>
    </Document>
);

export default PDF;
