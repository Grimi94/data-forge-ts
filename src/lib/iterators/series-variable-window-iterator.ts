//
// Iterates an underlying iterable in the 'windows'.
//

import { TakeIterable } from '../iterables/take-iterable';
import { SkipIterable } from '../iterables/skip-iterable';
import { Series, ISeries } from '../series';

/**
 * Compares to values and returns true if they are equivalent.
 */
export type ComparerFn<ValueT> = (a: ValueT, b: ValueT) => boolean;

export class SeriesVariableWindowIterator<IndexT, ValueT> implements Iterator<ISeries<IndexT, ValueT>> {

    iterator: Iterator<[IndexT, ValueT]>;
    nextValue: IteratorResult<[IndexT, ValueT]>;
    comparer: ComparerFn<ValueT>
    
    constructor(iterable: Iterable<[IndexT, ValueT]>, comparer: ComparerFn<ValueT>) {
        this.iterator = iterable[Symbol.iterator]();
        this.nextValue = this.iterator.next();
        this.comparer = comparer;
    }

    next(): IteratorResult<ISeries<IndexT, ValueT>> {

        if (this.nextValue.done) {
            // Nothing more to read.
            // https://github.com/Microsoft/TypeScript/issues/8938
            return ({ done: true } as IteratorResult<ISeries<IndexT, ValueT>>)  // <= explicit cast here!;
        }

        const pairs = [
            this.nextValue.value,
        ];

        let prevValue = this.nextValue.value;

        // Pull values until there is one that doesn't compare.
        // eslint-disable-next-line no-constant-condition
        while (true) {
            this.nextValue = this.iterator.next();
            if (this.nextValue.done) {
                break; // No more values.
            }

            if (!this.comparer(prevValue[1], this.nextValue.value[1])) {
                prevValue = this.nextValue.value;
                break; // Doesn't compare. Start a new window.
            }      
            
            pairs.push(this.nextValue.value);
            prevValue = this.nextValue.value;
        }

        const window = new Series<IndexT, ValueT>({
            pairs: pairs,
        });

        return {
            value: window,
            done: false,
        };
    }
}