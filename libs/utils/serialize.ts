export function JSON_serialize<T>(object: T): T {
    return JSON.parse(JSON.stringify(object))
}