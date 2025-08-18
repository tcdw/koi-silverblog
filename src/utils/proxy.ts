type Handler<T> = {
    [P in keyof T]?: (value: T[P] | undefined, prevValue: T[P] | undefined, original: T) => void;
};

export function createEffectObject<T extends object>(initial: T, handler: Handler<T> = {}): T {
    return new Proxy(initial, {
        set(target, p: string, newValue: any): boolean {
            if (handler[p as keyof T]) {
                handler[p as keyof T]!(newValue, target[p as keyof T], target);
            }
            target[p as keyof T] = newValue;
            return true;
        },
        deleteProperty(target, p: string): boolean {
            if (handler[p as keyof T]) {
                handler[p as keyof T]!(undefined, target[p as keyof T], target);
            }
            delete target[p as keyof T];
            return true;
        },
    });
}
