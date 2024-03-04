type Handler<T> = {
    [P in keyof T]?: (value: T[P] | undefined, original: T) => void;
};

export function createEffectObject<T extends object>(
    initial: T,
    handler: Handler<T> = {}
): T {
    return new Proxy(initial, {
        set(target, p: string, newValue: any): boolean {
            target[p as keyof T] = newValue;
            if (handler[p as keyof T]) {
                handler[p as keyof T]!(newValue, target);
            }
            return true;
        },
        deleteProperty(target, p: string): boolean {
            delete target[p as keyof T];
            if (handler[p as keyof T]) {
                handler[p as keyof T]!(undefined, target);
            }
            return true;
        }
    });
}
