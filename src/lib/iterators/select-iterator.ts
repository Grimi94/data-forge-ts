//
// An iterator that applies a selector function to each item.
//

export type SelectorFn<ValueT, ToT> = (value: ValueT, index: number) => ToT;

export class SelectIterator<ValueT, ToT> implements Iterator<ToT> {

    iterator: Iterator<ValueT>;
    selector: SelectorFn<ValueT, ToT>;
    index = 0;

    constructor(iterator: Iterator<ValueT>, selector: SelectorFn<ValueT, ToT>) {
        this.iterator = iterator;
        this.selector = selector;
    }

    next(): IteratorResult<ToT> {
        var result = this.iterator.next();
        if (result.done) {
            // https://github.com/Microsoft/TypeScript/issues/8938
            return ({ done: true } as IteratorResult<ToT>)  // <= explicit cast here!;
        }

        return {
            done: false,
            value: this.selector(result.value, this.index++)
        };
    }
}