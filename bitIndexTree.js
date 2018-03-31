/*
 * Binary Index Tree
 *
 * Problem:
 *  Enables log(n) time computation of
 *
 *  1. SUM: Compute a prefix sum
 *  2. ADD: Add a value to an element.
 *  
 *  This algorithm works on arrays that are base 1.
 *  Treat the array as if the starting index is 1. In JS arrays start with 0. So create arrays length+1.
 *
 *  Example:
 *      [NaN, 1, 7, 3, 0, 5, 8, 3, 2, 6]
 *
 *      Sum of the first 5 numbers. Prefix sum.
 *      SUM(5) = 1 + 7 + 3 + 0 + 5 = 16
 *
 *      Add 5 to position four
 *      ADD(4,5) = [NaN, 1, 7, 3, 5, 5, 8, 3, 2, 6]
 *      
 *      Sum of the first 7 numbers
 *      SUM(7) = 1 + 7 + 3 + 5 + 5 + 8 + 3 = 32
 *
 *  Simple Array approach:
 *      SUM in O(n), ADD in O(1)
 *
 *      SUM by iterationg over the array
 *      ADD regular A[i] += x
 *
 *  Could compute a prefix array
 *      Prefix sum array: [ NaN, 1, 8, 11, 11, 16, 24, 27, 29, 35 ]
 *      Now if you wanted to add a number you would have to update the entire prefix array.
 *      SUM in O(1), ADD in O(n)
 *
 *  How to do it better.
 *  [NaN, 1, 7, 3, 0, 5, 8, 3, 2, 6, 2, 1, 1, 4, 5]
 *    0   1  2  3  4  5  6  7  8  9 10 11 12 13 14
 *
 *  By using the sum of binary ranges.
 *  SUM(13) = 43 
 *      ▼
 *      13 = 2^3 + 2^2 + 2^0
 *         =  8  +  4  +  1
 *            ┌ A range of 8 plus a range of 4 plus a range of one
 *  SUM(13) = RANGE(1, 8) + RANGE(9, 12) + RANGE(13, 13) = 43
 *                  1 → 8 +       9 → 12 +      → 13
 *                      = 29   +       = 10  +     = 4   = 43
 *  
 *  What Binary ranges do you need to pre-compute to be able to use binary ranges?
 *
 *  [NaN, 1, 7, 3, 0, 5, 8, 3, 2, 6, 2, 1, 1, 4, 5]
 *    0   1  2  3  4  5  6  7  8  9 10 11 12 13 14
 *  
 *  You want to divide the array into binary ranges.
 *   2^0 2^1 2^2 2^3 2^4 ...
 *    1   2   4   8   16 ...   ◁ These are the prefix array lengths.
 *    
 *  [NaN, 1,    7,    3,    0,    5,    8,    3,    2,    6,    2,    1,    1,    4,    5]
 *    0   1     2     3     4     5     6     7     8     9    10    11    12    13    14
 *                                                                                           
 *        1     8          11                      29                                            ◁ Computed prefix array values              
 *      [1,1] [1,2]       [1,4]                   [1,8]                                          ◁ The range it was computed from. Use the binary numbers to determine the length of the range. For example the number 8 would be 1 to 8 which would be stored in the 8th element
 *                    3           5    13                 6     8          10                    ◁ Treat the gaps as new arrays with their starting index the cell you are at. Compute the binary range pre-fix for this new array.
 *                  [3,3]       [5,5] [5,6]             [9,9] [9,10]      [9,12]                 ◁ Only a range of 1 can fit in the first gap. In the second gap only a range of 1 and 2 can fit.
 *                                            3                        1            4       9
 *                                          [7,7]                   [11,11]      [13,13] [13,14]
 *                                                                                               
 * [NaN,  1,    8,    3,   11,    5,   13,    3,   29,    6,    8,     1,   10,     4,      9]   ◁ The binary index tree array
 *    0   1     2     3     4     5     6     7     8     9    10     11    12     13      14    ◁ The indecies
 *
 * Now how do you use this prefix sum array? Back to the original problem...
 * SUM(13)
 * We want to get the ranges 
 *    RANGE(13, 13) * RANGE(9, 12) + RANGE(1, 8)
 * You can see at index 13 you have your RANGE(13, 13)
 * How do you get to RANGE(9, 12) and RANGE(1, 8)?
 * You go up and left in the tree
 *  [NaN, 1,    7,    3,    0,    5,    8,    3,    2,    6,    2,    1,    1,    4,    5]
 *    0   1     2     3     4     5     6     7     8     9    10    11    12    13    14
 *                                                                                           
 *        1     8          11                      29                                           
 *      [1,1] [1,2]       [1,4]                   [1,8] ─────────────────┐
 *                                                 1000                  │                        
*                    3           5    13                 6     8          10              
 *                  [3,3]       [5,5] [5,6]             [9,9] [9,10]      [9,12] ───┐
 *                                                                         1100     │                                                                                               
 *                                            3                        1            4       9
 *                                          [7,7]                   [11,11]      [13,13] [13,14]
 *                                                                                1101
 * [NaN,  1,    8,    3,   11,    5,   13,    3,   29,    6,    8,     1,   10,     4,      9]   
 *    0   1     2     3     4     5     6     7     8     9    10     11    12     13      14
 *       0001  0010  0011  0100  0101 0110  0111  1000  1001  1010   1011  1100   1101    1110   ◁ The index in binary
 * Represent the indices are binary numbers.
 * Starting at index 13, unset the last set bit to get the index that is up and to the left until the index is 0000
 * 
 * To calculate the up and left do:
 *    To get the last set bit: x & (-x)
 *    So up and left becomes: x - (x&(-x))
 *
 * Example 2
 * SUM(7) = RANGE(7,7) + RANGE(5,6) + RANGE(1,4)
 *
 *
 *  [NaN, 1,    7,    3,    0,    5,    8,    3,    2,    6,    2,    1,    1,    4,    5]
 *    0   1     2     3     4     5     6     7     8     9    10    11    12    13    14
 *                                                                                           
 *        1     8          11                      29                                           
 *      [1,1] [1,2]       [1,4] ───────┐          [1,8] 
 *                                     │           1000                  
 *                   3           5     13                 6     8          10              
 *                  [3,3]       [5,5] [5,6] ──┐         [9,9] [9,10]      [9,12] 
 *                                            │                            1100                                                                                                    
 *                                            3                        1            4       9
 *                                          [7,7]                   [11,11]      [13,13] [13,14]
 *                                                                                1101
 * [NaN,  1,    8,    3,   11,    5,   13,    3,   29,    6,    8,     1,   10,     4,      9]
 *    0   1     2     3     4     5     6     7     8     9    10     11    12     13      14
 *       0001  0010  0011  0100  0101 0110  0111  1000  1001  1010   1011  1100   1101    1110   ◁ The index in binary
 *
 * How to do ADD
 * ADD(5, 2)
 *  [NaN, 1,    7,    3,    0,    5,    8,    3,    2,    6,    2,    1,    1,    4,    5]
 *    0   1     2     3     4     5     6     7     8     9    10    11    12    13    14
 *                                                                                           
 *        1     8          11                      29                                           
 *      [1,1] [1,2]       [1,4]        ┌───────── [1,8] 
 *                                     │           1000                  
 *                   3           5     13                 6     8          10              
 *                  [3,3]       [5,5]→[5,6]             [9,9] [9,10]      [9,12] 
 *                                                                         1100                                                                                                    
 *                                            3                        1            4       9
 *                                          [7,7]                   [11,11]      [13,13] [13,14]
 *                                                                                1101
 * [NaN,  1,    8,    3,   11,    5,   13,    3,   29,    6,    8,     1,   10,     4,      9]   
 *    0   1     2     3     4     5     6     7     8     9    10     11    12     13      14
 *       0001  0010  0011  0100  0101 0110  0111  1000  1001  1010   1011  1100   1101    1110   ◁ The index in binary
 *
 * The first position is obvious it's position 5. The next range that includes the 5 is the position to the right, 6. The next range that includes a 5 is 8.
 *
 * Looking at the binary indices. You're adding the last set bit.
 * Extract last set bit with: x&(-x)
 * Adding it with: x + (x&(-x))
 * 
 * With arrays that are base 0 use an array that is n+1.
 * Start with zero-array, insert each element with ADD.
 * RANGE_SUM(from, to) = SUM(to) - SUM(from-1)
 *
 * Also useful for other operations like product, xor
 */
if(global) var window = global;
(function(window) {
'use strict';
    function BIT(array) {
        this.bit = [0];

        this.buildPrefixArray(array);
    }

    BIT.prototype = {
        add: function add(num, index){
            while(index < this.bit.length){
                this.bit[index] += num;
                index = rightUp(index);
            }
            return this;
        },
        sum: function sum(index){
            var result = 0;

            if(index > 0 && index < this.bit.length){
                while(index){
                    result += this.bit[index];
                    index = upLeft(index);
                }
            }
            return result;
        },
        prefixSum: function(index){
            return sum(index);
        },
        buildPrefixArray: function buildPrefixArray(array){
            if(Array.isArray(array)){
                array = array.slice(0);
                array.unshift(0);
                this.bit = (new Array(array.length)).fill(0);

                for(var i=1, l=array.length; i<l; i++){
                    this.add(array[i], i);
                }
            }

            return this;
        }
    };
    
    function upLeft(index){
        return index - (index&(-index));
    }
    
    function rightUp(index){
        return index + (index&(-index));
    }
    window.BIT = BIT;
    if(module.exports) module.exports = BIT;
})(window);
