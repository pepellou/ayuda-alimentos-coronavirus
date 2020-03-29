var expect = require('expect.js');
var KB = require('../src/KB_Tree.js');
var Tree = KB.Tree;
var Page = KB.Page;

const PAGE_SIZE = 6;

let expectThisToThrow = (code, exception) => {
    try {
        code();
        throw 'This should not happen';
    } catch(e) {
        expect(e).to.be(exception);
    }
};

describe('KB.Tree', function() {

    describe('#__construct()', function() {

        it('should not contain any points', function() {
            var theTree = new KB.Tree({ pagesize: PAGE_SIZE });

            expect(theTree.count()).to.be(0);
        });

        it('should have a default pagesize of 4', function() {
            var theTree = new KB.Tree();

            expect(theTree.pagesize()).to.be(4);
        });

        it('should not allow a pagesize < 4', function() {
            expectThisToThrow(() => {
                new KB.Tree({ pagesize: 1 });
            }, KB.Exceptions.SmallPageSizeNotAllowedException);

            expectThisToThrow(() => {
                new KB.Tree({ pagesize: 2 });
            }, KB.Exceptions.SmallPageSizeNotAllowedException);

            expectThisToThrow(() => {
                new KB.Tree({ pagesize: 3 });
            }, KB.Exceptions.SmallPageSizeNotAllowedException);
        });

        it('should not allow an odd pagesize', function() {
            new KB.Tree({ pagesize: 4 });
            new KB.Tree({ pagesize: 6 });
            new KB.Tree({ pagesize: 8 });

            expectThisToThrow(() => {
                new KB.Tree({ pagesize: 5 });
            }, KB.Exceptions.OddPageSizeNotAllowedException);

            expectThisToThrow(() => {
                new KB.Tree({ pagesize: 7 });
            }, KB.Exceptions.OddPageSizeNotAllowedException);
        });

        describe('should contain an empty root which...', function() {

            it('should be defined', function() {
                expect(theTree.root()).not.to.be(undefined);
            });

            it('should be a Points page', function() {
                expect(theTree.root().pageType()).to.be(KB.PageType.PointsPage);
            });

            it('should be empty', function() {
                expect(theTree.root().children.length).to.be(0);
            });

            it('should have split type HORIZONTAL', function() {
                expect(theTree.root().splitType()).to.be(KB.SplitType.HORIZONTAL);
            });

            it('should be linked to the tree', function() {
                expect(theTree.root().tree()).to.be(theTree);
            });

            let theTree;

            beforeEach(function() {
                theTree = new KB.Tree({ pagesize: PAGE_SIZE });
            });

        });

        describe('should accept the redefinition of "x" and/or "y"', function() {

            it('throws exception when inserting an object with no "x" or no "y"', function() {
                var theTree = new KB.Tree();

                expectThisToThrow(() => {
                    theTree.insert({ lat: 10, lon: 10 });
                }, KB.Exceptions.MissingPropertyException);

                expectThisToThrow(() => {
                    theTree.insert({ x: 10, lon: 10 });
                }, KB.Exceptions.MissingPropertyException);

                expectThisToThrow(() => {
                    theTree.insert({ lat: 10, y: 10 });
                }, KB.Exceptions.MissingPropertyException);
            });

            it('allows redefinition of both', function() {
                var theTree = new KB.Tree({
                    pagesize: PAGE_SIZE,
                    x: (obj) => obj.lat,
                    y: (obj) => obj.lon
                });

                theTree.insert({ lat: 10, lon: 10 });
            });

            it('allows redefinition of one of them', function() {
                var theTree = new KB.Tree({
                    pagesize: PAGE_SIZE,
                    y: (obj) => obj.lon
                });

                theTree.insert({ aProperty: -1, x: 10, lon: 10 });

                expect(theTree.root().count()).to.be(1);
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

        describe('should create a region when count > page size', function() {

            beforeEach(function() {
                for (var i = 0; i < PAGE_SIZE; i++) {
                    expect(theTree.root().pageType()).to.be(KB.PageType.PointsPage);
                    theTree.insert({ x: i, y: i });
                }
            });

            it('the region must be created', function() {
                expect(theTree.root().pageType()).to.be(KB.PageType.PointsPage);

                theTree.insert({ x: 99, y: 99 });

                expect(theTree.root().pageType()).to.be(KB.PageType.RegionPage);
            });

            it('it will have pagesize / 2 children', function() {
                theTree.insert({ x: 99, y: 99 });

                expect(theTree.root().children.length).to.be(PAGE_SIZE / 2);
            });

            it('the children should be point pages', function() {
                theTree.insert({ x: 99, y: 99 });

                expect(theTree.root().children[0].pageType()).to.be(KB.PageType.PointsPage);
            });

        });

        // TODO test that maximum in a points page is pagesize while in a region page is pagesize / 2

        let theTree;
        const aPoint = { x: 1, y: 1 };

        beforeEach(function() {
            theTree = new KB.Tree({
                pagesize: PAGE_SIZE
            });
        });

    });

});

describe('KB.Page', function() {

    describe('#__construct()', function() {

        it('should start with an empty list of children', function() {
            var thePage = new KB.Page();

            expect(thePage.children.length).to.be(0);
        });

        it('should have a default split type horizontal', function() {
            var thePage = new KB.Page();

            expect(thePage.splitType()).to.be(KB.SplitType.HORIZONTAL);
        });

    });

    describe('#_wouldChangeLowerBoundary()', function() {

        describe('when splitType = HORIZONTAL', function() {

            let thePage;

            beforeEach(function() {
                thePage = new KB.Page({ splitType: KB.SplitType.HORIZONTAL, pagesize: 4 });
                thePage.insert({ x: 0, y: 0 });
                thePage.insert({ x: 10, y: 10 });
            });

            it('should return true if point.x < boundary minimum x', function() {
                expect(thePage._wouldChangeLowerBoundary({ x: -1 , y: -1 })).to.be(true);
                expect(thePage._wouldChangeLowerBoundary({ x: -1 , y: 5  })).to.be(true);
                expect(thePage._wouldChangeLowerBoundary({ x: -4 , y: 5  })).to.be(true);
            });

            it('should return false if point.x >= boundary minimum x', function() {
                expect(thePage._wouldChangeLowerBoundary({ x: 0  , y: 5  })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 0  , y: -1 })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 0  , y: 11 })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 5  , y: 5  })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 10 , y: 5  })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 15 , y: 5  })).to.be(false);
            });

        });

        describe('when splitType = VERTICAL', function() {

            let thePage;

            beforeEach(function() {
                thePage = new KB.Page({ splitType: KB.SplitType.VERTICAL, pagesize: 4 });
                thePage.insert({ x: 0, y: 0 });
                thePage.insert({ x: 10, y: 10 });
            });

            it('should return true if point.y < boundary minimum y', function() {
                expect(thePage._wouldChangeLowerBoundary({ x: -1 , y: -1 })).to.be(true);
                expect(thePage._wouldChangeLowerBoundary({ x: 5  , y: -1 })).to.be(true);
                expect(thePage._wouldChangeLowerBoundary({ x: 5  , y: -4 })).to.be(true);
            });

            it('should return false if point.y >= boundary minimum y', function() {
                expect(thePage._wouldChangeLowerBoundary({ x: 5  , y: 0  })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: -1 , y: 0  })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 11 , y: 0  })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 5  , y: 5  })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 5  , y: 10 })).to.be(false);
                expect(thePage._wouldChangeLowerBoundary({ x: 5  , y: 15 })).to.be(false);
            });

        });

    });

    describe('#insert()', function() {

        it('should add the point to the children array', function() {
            var thePage = new KB.Page();
            var aPoint = { x: 1, y: 2 };

            thePage.insert(aPoint);

            expect(thePage.children.length).to.be(1);
            expect(thePage.children[0]).to.be(aPoint);
        });

        describe('should keep the points sorted (according to split type) in the children array', function() {

            it('sorting by y when splitType is HORIZONTAL', function() {
                var thePage = new KB.Page({ pagesize: 4, splitType: KB.SplitType.HORIZONTAL });

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

            it('sorting by x when splitType is VERTICAL', function() {
                var thePage = new KB.Page({ pagesize: 4, splitType: KB.SplitType.VERTICAL });

                thePage.insert({ x: 1, y: 2 });
                thePage.insert({ x: -3, y: 5 });
                thePage.insert({ x: 3, y: 0 });
                thePage.insert({ x: 7, y: 6 });

                expect(thePage.children).to.eql([
                    { x: -3, y: 5 },
                    { x: 1, y: 2 },
                    { x: 3, y: 0 },
                    { x: 7, y: 6 }
                ]);
            });

        });

        it('should update the boundaries of the page', function() {
            var thePage = new KB.Page();
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
                thePage = new KB.Page({ pagesize: 4, tree: theTree });
                thePage.insert({ x: 1, y: 2 });
                thePage.insert({ x: 0, y: 4 });
                thePage.insert({ x: 1, y: 3 });
                thePage.insert({ x: 3, y: 1 });
            });

            it('should convert from PointsPage into RegionPage', function() {
                expect(thePage.pageType()).to.be(KB.PageType.PointsPage);

                thePage.insert({ x: 9, y: 9 });

                expect(thePage.pageType()).to.be(KB.PageType.RegionPage);
            });

            describe('should have 2 children, and those pages...', function() {

                it('should be 2', function() {
                    expect(thePage.children.length).to.be(2);
                });

                it('should be PointsPage', function() {
                    expect(thePage.children[0].pageType()).to.be(KB.PageType.PointsPage);
                    expect(thePage.children[1].pageType()).to.be(KB.PageType.PointsPage);
                });

                it('should contain all the points', function() {
                    expect(
                        thePage.children[0].children.length +
                        thePage.children[1].children.length
                    ).to.be(thePage.pagesize() + 1);
                });

                it('should be linked to the parent page', function() {
                    expect(thePage.children[0].parent()).to.be(thePage);
                    expect(thePage.children[1].parent()).to.be(thePage);
                });

                it('should be linked to the tree', function() {
                    expect(thePage.children[0].tree()).to.be(theTree);
                    expect(thePage.children[1].tree()).to.be(theTree);
                });

                beforeEach(function() {
                    thePage.insert({ x: 9, y: 9 });
                });

            });

            it('should keep switching split pageType', function() {
                expect(thePage.splitType()).to.be(KB.SplitType.HORIZONTAL);

                thePage.insert({ x: 9, y: 9 });

                expect(thePage.children[0].splitType()).to.be(KB.SplitType.VERTICAL);

                thePage.insert({ x: 11, y: 10 });
                thePage.insert({ x: 6, y: 14 });

                expect(thePage.children[1].children[0].splitType()).to.be(KB.SplitType.HORIZONTAL);
            });

            it('should properly update its boundaries and its children\'s boundaries', function() {
                thePage.insert({ x: 9, y: 9 });

                expect(thePage.boundaries).to.eql({
                    x: [ 0, 9 ],
                    y: [ 1, 9 ]
                });

                expect(thePage.children[0].boundaries).to.eql({
                    x: [ 1, 3 ],
                    y: [ 1, 2 ]
                });

                expect(thePage.children[1].boundaries).to.eql({
                    x: [ 0, 9 ],
                    y: [ 3, 9 ]
                });
            });

            it('should support the addition of new points [REGRESSION]', function() {
                thePage.insert({ x: 9, y: 9 });
                thePage.insert({ x: 99, y: 99 });

                expect(thePage.children[0].children).to.eql([
                    { x: 1, y: 2 },
                    { x: 3, y: 1 }
                ]);

                expect(thePage.children[1].children).to.eql([
                    { x: 0, y: 4 },
                    { x: 1, y: 3 },
                    { x: 9, y: 9 },
                    { x: 99, y: 99 }
                ]);
            });

        });

    });

});

describe('KB.Printer', function() {

    describe('#print()', function() {

        it('should print a simple points page', function() {
            theTree.insert({ x: 3, y: 6 });
            theTree.insert({ x: 2, y: 7 });
            theTree.insert({ x: 17, y: 15 });
            theTree.insert({ x: 6, y: 12 });

            var printer = new KB.Printer(theTree);

            expect(printer.print()).to.eql([
                '[POINTS (max: 6)] - boundaries: [2, 17] x [6, 15] - split: HORIZONTAL',
                '|',
                '+----{ (3, 6), (2, 7), (6, 12), (17, 15) }',
            ].join('\n'));
        });

        it('should print a tree with nested pages', function() {
            theTree.insert({ x: 3, y: 6 });
            theTree.insert({ x: 2, y: 7 });
            theTree.insert({ x: 17, y: 15 });
            theTree.insert({ x: 6, y: 12 });
            theTree.insert({ x: 13, y: 14 });
            theTree.insert({ x: 9, y: 1 });
            theTree.insert({ x: 10, y: 19 });
            theTree.insert({ x: 16, y: 8 });

            var printer = new KB.Printer(theTree);

            expect(printer.print()).to.eql([
                '[REGION (max: 6)] - boundaries: [2, 17] x [1, 19] - split: HORIZONTAL',
                '|',
                '|----[POINTS (max: 6)] - boundaries: [3, 9] x [1, 6] - split: VERTICAL',
                '|    |',
                '|    +----{ (3, 6), (9, 1) }',
                '|',
                '|----[POINTS (max: 6)] - boundaries: [2, 16] x [7, 12] - split: VERTICAL',
                '|    |',
                '|    +----{ (2, 7), (6, 12), (16, 8) }',
                '|',
                '+----[POINTS (max: 6)] - boundaries: [10, 17] x [14, 19] - split: VERTICAL',
                '     |',
                '     +----{ (10, 19), (13, 14), (17, 15) }',
            ].join('\n'));
        });

        it('should print a tree with several levels of nesting', function() {
            theTree = new KB.Tree({ pagesize: 4 });

            theTree.insert({ x: 3, y: 6 });
            theTree.insert({ x: 2, y: 7 });
            theTree.insert({ x: 17, y: 15 });
            theTree.insert({ x: 6, y: 12 });
            theTree.insert({ x: 13, y: 14 });
            theTree.insert({ x: 9, y: 1 });
            theTree.insert({ x: 10, y: 19 });
            theTree.insert({ x: 16, y: 8 });
            theTree.insert({ x: 10, y: 10 });

            var printer = new KB.Printer(theTree);

            expect(printer.print()).to.eql([
                '[REGION (max: 4)] - boundaries: [2, 17] x [1, 19] - split: HORIZONTAL',
                '|',
                '|----[REGION (max: 4)] - boundaries: [2, 16] x [1, 10] - split: VERTICAL',
                '|    |',
                '|    |----[POINTS (max: 4)] - boundaries: [2, 3] x [6, 7] - split: HORIZONTAL',
                '|    |    |',
                '|    |    +----{ (3, 6), (2, 7) }',
                '|    |',
                '|    +----[POINTS (max: 4)] - boundaries: [9, 16] x [1, 10] - split: HORIZONTAL',
                '|         |',
                '|         +----{ (9, 1), (16, 8), (10, 10) }',
                '|',
                '+----[POINTS (max: 4)] - boundaries: [6, 17] x [12, 19] - split: VERTICAL',
                '     |',
                '     +----{ (6, 12), (10, 19), (13, 14), (17, 15) }'
            ].join('\n'));
        });

        let theTree;

        beforeEach(function() {
            theTree = new KB.Tree({
                pagesize: PAGE_SIZE
            });
        });

    });

});
