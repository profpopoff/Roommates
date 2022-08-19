// Функция, которая склоняет слово к числу (num = число, dec = массив слов)
export const enumerate = (num, dec) => {
    if (num <= 20 && num >= 10) return dec[2]
    if (num > 20) num = num % 10
    if (num > 100) num = num % 100
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2]
}

// Среднее значение чисел массива
export const average = (nums) => {
    if (nums[0]) {
        return nums.reduce((a, b) => (a + b)) / nums.length
    }
    return 0
}

export const jsonParser = (data) => JSON.parse(JSON.stringify(data))