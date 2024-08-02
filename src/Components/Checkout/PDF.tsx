import React, {FC} from 'react';
import {Page, Text, View, Document, StyleSheet, Image} from '@react-pdf/renderer';
import {CheckoutType, OrderFormType} from "../../helpers/types";
import {CartItemType} from "../../store/reducers/generalSlice";
import {getImg} from "../../helpers/helpers";

// Create s
const s = StyleSheet.create({
    page: {
        padding: '2vh 2vw'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    table: {
        display: 'flex',
        flexDirection: "column",
        border: '1px solid #000',
        borderRadius: '3px',
    },
    cartItem: {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        padding: '3px',
        borderBottom: "1px solid #000"
    },
    itemPrice: {
        display: "flex",
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '20vw'
    },
    itemName: {
        font: '500 19px/1.2 $mainFont',
        paddingBottom: '6pt'
    },
    category: {
        fontSize: '12.5px',
        fontStyle: 'italic'
    },
    note: {
        paddingTop: '6pt',
        fontSize: '13px',
        fontStyle: 'italic'
    },
    sum: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '1.2',
        width: '15vw'
    },
    data: {
        width: '30vw'
    },
    img: {
        width: '20vw'
    }
})

type StrType = {
    roomStr: string | null,
    doorStr: string | null,
    boxMaterialStr: string | null,
    drawerStr: string | null,
    leatherStr: string | null,
}

// Create Document Component
const PDF: FC<{ values: CheckoutType, cart: CartItemType[], str: StrType }> = ({values, cart, str}) => (
    <Document language="en">
        <Page orientation="landscape" style={s.page}>
            <View style={s.section}>
                <Text>Materials:</Text>
                <Text>{str.roomStr}</Text>
                <Text>Door: {str.doorStr}</Text>
                <Text>Box Material: {str.boxMaterialStr}</Text>
                <Text>Drawer: {str.drawerStr}</Text>
                {str.leatherStr ? <Text>Leather: {str.leatherStr}</Text> : null}
            </View>

            <View style={s.table}>
                {cart.map((el, index) => {
                    return (
                        <View style={s.cartItem} key={index}>
                            <View style={s.img} >
                                <Image src={getImg('products-checkout', el.img)}></Image>
                            </View>
                            <View style={s.data}>
                                <Text style={s.itemName}>{el.name}</Text>
                                <Text style={s.category}>{el.category}</Text>
                                <View>
                                    {/*<CartItemOptions item={el}/>*/}
                                </View>
                                {el.note ? <Text style={s.note}>*{el.note}</Text> : null}
                            </View>
                            <Text style={s.itemPrice}>{el.price}$ x {el.amount}</Text>
                            <Text style={s.sum}>{(el.price * el.amount).toFixed(1)}$</Text>
                        </View>
                    )

                })}

            </View>
        </Page>
    </Document>
);

export default PDF;