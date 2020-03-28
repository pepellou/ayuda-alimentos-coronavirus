var expect = require('expect.js');
var KB_Tree = require('../src/KB_Tree.js');

const PAGE_SIZE = 6;

describe('KB_Tree', function() {

    describe('#__construct()', function() {

        let expectThisToThrow = (code, exception) => {
            try {
                code();
                throw 'This should not happen';
            } catch(e) {
                expect(e).to.be(exception);
            }
        };

        it('should not contain any points', function() {
            var theTree = new KB_Tree({ pagesize: PAGE_SIZE });

            expect(theTree.count()).to.be(0);
        });

        it('should have a default pagesize of 4', function() {
            var theTree = new KB_Tree();

            expect(theTree.pagesize()).to.be(4);
        });

        it('should not allow a pagesize < 4', function() {
            expectThisToThrow(() => {
                new KB_Tree({ pagesize: 1 });
            }, KB_Tree.Exceptions.SmallPageSizeNotAllowedException);

            expectThisToThrow(() => {
                new KB_Tree({ pagesize: 2 });
            }, KB_Tree.Exceptions.SmallPageSizeNotAllowedException);

            expectThisToThrow(() => {
                new KB_Tree({ pagesize: 3 });
            }, KB_Tree.Exceptions.SmallPageSizeNotAllowedException);
        });

        it('should not allow an odd pagesize', function() {
            new KB_Tree({ pagesize: 4 });
            new KB_Tree({ pagesize: 6 });
            new KB_Tree({ pagesize: 8 });

            expectThisToThrow(() => {
                new KB_Tree({ pagesize: 5 });
            }, KB_Tree.Exceptions.OddPageSizeNotAllowedException);

            expectThisToThrow(() => {
                new KB_Tree({ pagesize: 7 });
            }, KB_Tree.Exceptions.OddPageSizeNotAllowedException);
        });

        describe('should contain an empty root which...', function() {

            it('should be defined', function() {
                expect(theTree.root).not.to.be(undefined);
            });

            it('should be a Points page', function() {
                expect(theTree.root.pageType()).to.be(KB_Tree.PageType.PointsPage);
            });

            it('should be empty', function() {
                expect(theTree.root.children.length).to.be(0);
            });

            it('should have split type HORIZONTAL', function() {
                expect(theTree.root.splitType()).to.be(KB_Tree.SplitType.HORIZONTAL);
            });

            it('should be linked to the tree', function() {
                expect(theTree.root.tree).to.be(theTree);
            });

            let theTree;

            beforeEach(function() {
                theTree = new KB_Tree({ pagesize: PAGE_SIZE });
            });

        });

    });

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
                expect(theTree.root.pageType).to.be(KB_Tree.PageType.PointsPage);
                theTree.insert({ x: i, y: i });
            }

            theTree.insert({ x: 99, y: 99 });

            expect(theTree.root.pageType).to.be(KB_Tree.PageType.RegionPage);
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

        it('should have a default split type horizontal', function() {
            var thePage = new KB_Tree.Page();

            expect(thePage.splitType).to.be(KB_Tree.SplitType.HORIZONTAL);
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

        it('should keep the points sorted (according to split type) in the children array', function() {
            var thePage = new KB_Tree.Page({ pagesize: PAGE_SIZE, splitType: KB_Tree.SplitType.HORIZONTAL });

            thePage.insert({ x: 1, y: 2 });
            thePage.insert({ x: -3, y: 5 });
            thePage.insert({ x: 3, y: 0 });
            thePage.insert({ x: 7, y: 6 });

            expect(thePage.children).to.eql([
                { x: 3, y: 0 },
                { x: 1, y: 2 },
                { x: -3, y: 5 },
                { x: 7, y: 6 }
            ]);
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
            let theTree = 'just a tree';

            beforeEach(function() {
                thePage = new KB_Tree.Page({ pagesize: 4, tree: theTree });
                thePage.insert({ x: 1, y: 2 });
                thePage.insert({ x: 0, y: 4 });
                thePage.insert({ x: 1, y: 3 });
                thePage.insert({ x: 3, y: 1 });
            });

            it('should convert from PointsPage into RegionPage', function() {
                expect(thePage.pageType()).to.be(KB_Tree.PageType.PointsPage);

                thePage.insert({ x: 9, y: 9 });

                expect(thePage.pageType()).to.be(KB_Tree.PageType.RegionPage);
            });

            describe('should have 2 children, and those pages...', function() {

                it('should be 2', function() {
                    expect(thePage.children.length).to.be(2);
                });

                it('should be PointsPage', function() {
                    expect(thePage.children[0].pageType()).to.be(KB_Tree.PageType.PointsPage);
                    expect(thePage.children[1].pageType()).to.be(KB_Tree.PageType.PointsPage);
                });

                it('should contain all the points', function() {
                    expect(
                        thePage.children[0].children.length +
                        thePage.children[1].children.length
                    ).to.be(thePage.pagesize() + 1);
                });

                it('should be linked to the parent page', function() {
                    expect(thePage.children[0].parent).to.be(thePage);
                    expect(thePage.children[1].parent).to.be(thePage);
                });

                it('should be linked to the tree', function() {
                    expect(thePage.children[0].tree).to.be(theTree);
                    expect(thePage.children[1].tree).to.be(theTree);
                });

                beforeEach(function() {
                    thePage.insert({ x: 9, y: 9 });
                });

            });

            it('should keep switching split pageType', function() {
                expect(thePage.splitType()).to.be(KB_Tree.SplitType.HORIZONTAL);

                thePage.insert({ x: 9, y: 9 });

                expect(thePage.children[0].splitType()).to.be(KB_Tree.SplitType.VERTICAL);

                thePage.insert({ x: 11, y: 10 });
                thePage.insert({ x: 6, y: 14 });

                expect(thePage.children[1].children[0].splitType()).to.be(KB_Tree.SplitType.HORIZONTAL);
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

            it('should support the addition of new points', function() {
                thePage.insert({ x: 9, y: 9 });
                thePage.insert({ x: 99, y: 99 });

                expect(thePage.children[0].children).to.eql([
                    { x: 1, y: 2 },
                    { x: 99, y: 99 }
                ]);

                expect(thePage.children[1].children).to.eql([
                    { x: 0, y: 4 },
                    { x: 9, y: 9 }
                ]);

            });

        });

    });

    describe('#print()', function() {

        it('should print a simple points page', function() {
            theTree.insert({ x: 3, y: 6 });
            theTree.insert({ x: 2, y: 7 });
            theTree.insert({ x: 17, y: 15 });
            theTree.insert({ x: 6, y: 12 });

            expect(theTree.print()).to.eql([
                '[POINTS (max: 7)] - boundaries: [2, 17] x [6, 15]',
                '|',
                '+----{ (3, 6), (2, 7), (6, 12), (17, 15) }',
            ].join('\n'));
        });

        it('should print a tree with nested pages', function() {
            theTree.insert({ x: 3, y: 6 });
            theTree.insert({ x: 2, y: 7 });
            theTree.insert({ x: 17, y: 15 });
            theTree.insert({ x: 6, y: 12 });
            theTree.insert({ x: 13, y: 15 });
            theTree.insert({ x: 9, y: 1 });
            theTree.insert({ x: 10, y: 19 });
            theTree.insert({ x: 16, y: 8 });

            expect(theTree.print()).to.eql([
                '[REGION (max: 7)] - boundaries: [2, 17] x [1, 19] - split: HORIZONTAL',
                '|',
                '|----[POINTS (max: 7)] - boundaries: [2, 9] x [1, 12]',
                '|    |',
                '|    +----{ (9, 1), (3, 6), (2, 7), (6, 12) }',
                '|',
                '+----[POINTS (max: 7)] - boundaries: [10, 17] x [8, 19]',
                '     |',
                '     +----{ (16, 8), (17, 15), (13, 15), (10, 19) }',
            ].join('\n'));
        });

        it('should print a tree with several levels of nesting', function() {
            theTree = new KB_Tree({
                pagesize: 2
            });

            theTree.insert({ x: 3, y: 6 });
            theTree.insert({ x: 2, y: 7 });
            theTree.insert({ x: 17, y: 15 });
            theTree.insert({ x: 6, y: 12 });
            theTree.insert({ x: 13, y: 15 });
            theTree.insert({ x: 9, y: 1 });
            theTree.insert({ x: 10, y: 19 });
            theTree.insert({ x: 16, y: 8 });

            expect(theTree.print()).to.eql([
                '[REGION (max: 2)] - boundaries: [2, 17] x [1, 19] - split: HORIZONTAL',
                '|',
                '|----[REGION (max: 2)] - boundaries: [3, 16] x [1, 19] - split: VERTICAL',
                '|    |',
                '|    |----[REGION (max: 2)] - boundaries: [3, 16] x [1, 19] - split: HORIZONTAL',
                '|    |    |',
                '|    |    |----[POINTS (max: 2)] - boundaries: [9, 16] x [1, 8]',
                '|    |    |    |',
                '|    |    |    +----{ (9, 1), (16, 8) }',
                '|    |    |',
                '|    |    +----[POINTS (max: 2)] - boundaries: [3, 10] x [6, 19]',
                '|    |         |',
                '|    |         +----{ (3, 6), (10, 19) }',
                '|    |',
                '|    +----[POINTS (max: 2)] - boundaries: [6, 13] x [12, 15]',
                '|         |',
                '|         +----{ (6, 12), (13, 15) }',
                '|',
                '+----[POINTS (max: 2)] - boundaries: [2, 17] x [7, 15]',
                '     |',
                '     +----{ (2, 7), (17, 15) }'
            ].join('\n'));
        });

        let theTree;

        beforeEach(function() {
            theTree = new KB_Tree({
                pagesize: PAGE_SIZE
            });
        });

    });

});
