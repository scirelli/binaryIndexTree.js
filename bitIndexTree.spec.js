if(global) var window = global;
if(require) window.BIT = require('./bitIndexTree');

(function unitTests(window) {
'use strict';
    function BIT_Tests() {
        let array = [1, 7, 3, 0, 5, 8, 3, 2, 6, 2, 1, 1, 4, 5];

        describe('Sum method', function(){
            let bit = new BIT(array);

            it('The prefix sum for index \'13\' should be 43.', function(){
                assert(bit.sum(13) === 43, 'bit.sum(13) === 43');
            });

            it('The prefix sum for index \'7\' should be 27.', function(){
                assert(bit.sum(7) === 27, 'bit.sum(7) === 27');
            });
            
            it('Should return \'0\' if the index is out of bounds.', function(){
                assert(bit.sum(15) === 0, 'bit.sum(15) === 0');
                assert(bit.sum(0) === 0, 'bit.sum(0) === 0');
            });
        });

        describe('Add method', function(){
            let bit = new BIT(array),
                expectedResult = [NaN, 1, 8, 3, 11, 7, 15, 3, 31, 6, 8, 1, 10, 4, 9];

            it('It should add the value to the correct elements. And return itself.', function(){
                assert(bit.add(2,5) === bit, 'bit.add(2,5) === bit');
                for(let i=1, l=bit.bit.length; i<l; i++){
                    assert(bit.bit[i] === expectedResult[i], bit.bit[i] + ' === ' + expectedResult[i]);
                }
            });

            it('It should do nothing to the tree if the index is out of range.', function(){
                assert(bit.add(20,25) === bit, 'bit.add(20,25) === bit');
                for(let i=1, l=bit.bit.length; i<l; i++){
                    assert(bit.bit[i] === expectedResult[i], bit.bit[i] + ' === ' + expectedResult[i]);
                }
            });
            
            it('It should do nothing to the tree if the index is out of range.', function(){
                assert(bit.add(-1,25) === bit, 'bit.add(0,25) === bit');
                for(let i=1, l=bit.bit.length; i<l; i++){
                    assert(bit.bit[i] === expectedResult[i], bit.bit[i] + ' === ' + expectedResult[i]);
                }
            });

            it('It should do nothing to the tree if the index is out of range.', function(){
                assert(bit.add(0,25) === bit, 'bit.add(0,25) === bit');
                for(let i=1, l=bit.bit.length; i<l; i++){
                    assert(bit.bit[i] === expectedResult[i], bit.bit[i] + ' === ' + expectedResult[i]);
                }
            });
        });

        describe('buildPrefixArray method', function(){
            let bit = new BIT(array);
        });
    };

    function assert(cond, message){
        if(!cond){
            throw new Error(message);
        }
    }
    
    function describe(msg, func){
        console.log(msg);
        func();
    }

    function it(desc, func){
        try{
            func();
            console.log('\t' + desc + '\tPASSED');
        }catch(e){
            console.error('\t' + desc + '\tFAILED', e);
        }
    }

    window.BIT_Tests = BIT_Tests;
    if(module.exports) module.exports = BIT_Tests;
})(window);
