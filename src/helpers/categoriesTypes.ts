export type category = {
    name: string,
    img: string
}

export type room = 'Kitchen' | 'Vanity' | 'Closet';

export type roomType = {
    defaultImg: string,
    categories: category[]
}


export type setCategoryType = (value: string) => void;

export type SliderType = {
    category: string,
    setCategory: setCategoryType,
    room: room,
    categoriesData: {
        "Kitchen": roomType,
        "Vanity": roomType,
        "Closet": roomType,
    }
}