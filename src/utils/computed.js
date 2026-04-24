import SparkMD5 from 'spark-md5'

export const getFileMD5 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const spark = new SparkMD5.ArrayBuffer()
            spark.append(e.target.result)
            resolve(spark.end())
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })
}