var expect = require('expect.js');
var KB_Tree = require('../src/KB_Tree.js');

const PAGE_SIZE = 7;

describe('KB_Tree', function() {

    describe('#insert()', function() {

        it('should add point to the tree', function() {
            expect(theTree.count()).to.be(0);

            theTree.insert(aPoint);
            expect(theTree.count()).to.be(1);

            theTree.insert(aPoint);
            expect(theTree.count()).to.be(2);

            // TODO check that if we find all the points in the tree, they're the ones we added
        });

        it('should create a region when count > page size', function() {
            for (var i = 0; i < PAGE_SIZE; i++) {
                expect(theTree.root.type).to.be(KB_Tree.Page.PointsPage);
                theTree.insert({ x: i, y: i });
            }

            theTree.insert({ x: 99, y: 99 });

            expect(theTree.root.type).to.be(KB_Tree.Page.RegionPage);
            expect(theTree.root.children.length).to.be(2);
        });

    });

    let theTree;
    const aPoint = { x: 1, y: 1 };

    beforeEach(function() {
        theTree = new KB_Tree({
            pagesize: PAGE_SIZE
        });
    });

});

describe('KB_Tree.Page', function() {

    describe('#__construct()', function() {

        it('should start with an empty list of children', function() {
            var thePage = new KB_Tree.Page();

            expect(thePage.children.length).to.be(0);
        });

    });

    describe('#insert()', function() {

        it('should add the point to the children array', function() {
            var thePage = new KB_Tree.Page();
            var aPoint = { x: 1, y: 2 };

            thePage.insert(aPoint);

            expect(thePage.children.length).to.be(1);
            expect(thePage.children[0]).to.be(aPoint);
        });

        it('should update the boundaries of the page', function() {
            var thePage = new KB_Tree.Page();
            var aPoint = { x: 1, y: 2 };
            var anotherPoint = { x: 4, y: 12 };

            expect(thePage.boundaries).to.eql(null);

            thePage.insert(aPoint);
            expect(thePage.boundaries).to.eql({
                x: [ 1, 1 ],
                y: [ 2, 2 ]
            });

            thePage.insert(anotherPoint);
            expect(thePage.boundaries).to.eql({
                x: [ 1, 4 ],
                y: [ 2, 12 ]
            });
        });

        describe('when the page size is reached', function() {

            let thePage;

            beforeEach(function() {
                thePage = new KB_Tree.Page({ pagesize: 2 });
                thePage.insert({ x: 1, y: 2 });
                thePage.insert({ x: 0, y: 4 });
            });

            it('should convert from PointsPage into RegionPage', function() {
                expect(thePage.type).to.be(KB_Tree.Page.PointsPage);

                thePage.insert({ x: 9, y: 9 });

                expect(thePage.type).to.be(KB_Tree.Page.RegionPage);
            });

            it('should have 2 PointsPage as children', function() {
                thePage.insert({ x: 9, y: 9 });

                expect(thePage.children[0].type).to.be(KB_Tree.Page.PointsPage);
                expect(thePage.children[1].type).to.be(KB_Tree.Page.PointsPage);
                expect(
                    thePage.children[0].children.length +
                    thePage.children[1].children.length
                ).to.be(thePage._pagesize + 1);
            });

            it('should properly update its boundaries and its children\'s boundaries', function() {
                thePage.insert({ x: 9, y: 9 });

                expect(thePage.boundaries).to.eql({
                    x: [ 0, 9 ],
                    y: [ 2, 9 ]
                });

                expect(thePage.children[0].boundaries).to.eql({
                    x: [ 1, 1 ],
                    y: [ 2, 2 ]
                });

                expect(thePage.children[1].boundaries).to.eql({
                    x: [ 0, 9 ],
                    y: [ 4, 9 ]
                });
            });

        });

    });

});
