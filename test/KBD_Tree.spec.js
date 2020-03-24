var assert = require('assert');
var KBD_Tree = require('../src/KBD_Tree.js');

describe('KBD_Tree', function() {

    describe('#insert()', function() {

        it('should add point to the tree', function() {
            var theTree = new KBD_Tree();
            var aPoint = { x: 1, y: 1 };

            assert.equal(0, theTree.count());

            theTree.insert(aPoint);
            assert.equal(1, theTree.count());

            theTree.insert(aPoint);
            assert.equal(2, theTree.count());

            // TODO check that if we find all the points in the tree, they're the ones we added
        });

    });

});

