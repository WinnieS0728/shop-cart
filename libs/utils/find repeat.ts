export function findRepeat(array: any[]) {
    const repeatItem = array.filter((data, index) => array.indexOf(data) !== index)
    const repeatIndex = array.map((data, index) => {
        if (repeatItem.some(item => item === data)) {
            return index
        }
    })
    return repeatIndex 
}