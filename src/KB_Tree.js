var KB_PageType = {
    PointsPage: 'PointsPage',
    RegionPage: 'RegionPage'
};

var KB_SplitType = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL',
    next: function(pageType) {
        return pageType == KB_SplitType.HORIZONTAL ? KB_SplitType.VERTICAL : KB_SplitType.HORIZONTAL;
    }
};

var KB_Exceptions = {
    SmallPageSizeNotAllowedException: new Error('Cannot create tree with a pagesize less than 4'),
    OddPageSizeNotAllowedException: new Error('Cannot create tree with an odd pagesize - only even pagesizes are allowed')
};

var KB_Printer = function(tree) {

    this.print = function() {
        return this._printPage(tree.root()).join('\n');
    };

    this._printPage = function(page) {
        return (page.pageType() == KB_PageType.PointsPage)
            ? this._printPointsPage(page)
            : this._printRegionPage(page);
    };

    this._printPointsPage = function(page) {
        return [
            this._printHeadline(page),
            '|',
            '+----{ ' + page.children.map(p => '(' + p.x + ', ' + p.y + ')').join(', ') + ' }'
        ];
    };

    this._printRegionPage = function(page) {
        var self = this;
        var parts = [];

        parts.push(this._printHeadline(page));

        page.children.forEach((p, i) => {
            parts.push('|');
            var pref = (i < page.children.length - 1) ? [ '|----', '|    ' ] : [ '+----', '     ' ];
            Array.prototype.push.apply(parts, self._printPage(p).map((l, j) => (j == 0) ? pref[0] + l : pref[1] + l));
        });

        return parts;
    };

    this._printHeadline = (page) => '[' + this._printPageType(page) + ' (max: ' + page.pagesize() + ')]' + this._printBoundaries(page) + this._printSplitType(page);

    this._printPageType = (page) => ((page.pageType() == KB_PageType.PointsPage) ? 'POINTS' : 'REGION' );

    this._printSplitType = (page) => ' - split: ' + page.splitType();

    this._printBoundaries = (page) => {
        return ' - boundaries: ['
            + page.boundaries.x[0] + ', '
            + page.boundaries.x[1] + '] x ['
            + page.boundaries.y[0] + ', '
            + page.boundaries.y[1] + ']';
    };

    return this;
};

var KB_Page = function(options) {

    this.init = function() {
        this._pageType = KB_PageType.PointsPage;
        this._splitType = (options && options.splitType) ? options.splitType : KB_SplitType.HORIZONTAL;
        this._pagesize = (options && options.pagesize) ? options.pagesize : 2;
        this._parent = (options && options.parent) ? options.parent : null;
        this._count = 0;
        this._tree = (options && options.tree) ? options.tree : null;
        this.children = [];
        this.boundaries = null;
    };

    Object.assign(this, {
        pagesize:  () => this._pagesize,
        splitType: () => this._splitType,
        pageType:  () => this._pageType,
        parent:    () => this._parent,
        count:     () => this._count,
        tree:      () => this._tree
    });

    this.convertToRegion = function() {
        this._pageType = KB_PageType.RegionPage;

        this.insert = function(point) {
            this._count++;
            // TODO maybe we need to rebalance the tree when 1st child starts overlapping with 2nd and so
            let index_to_insert = this._findLastChildThatWouldntChangeLowerBoundary(point);
            this.children[index_to_insert].insert(point);
            this._updateBoundaries(point);
        };
    };

    this.insert = function(point) {
        this._count++;
        if (this.children.length == this.pagesize()) {
            this.splitAndAdd(point);
            this.convertToRegion();
        } else {
            this.children.push(point);
            this.children.sort(
                (this.splitType() == KB_SplitType.HORIZONTAL)
                ? (p1, p2) => p1.y - p2.y
                : (p1, p2) => p1.x - p2.x
            );
        }
        this._updateBoundaries(point);
    };

    this._updateBoundaries = function(point) {
        if (this.boundaries == null) {
            this.boundaries = {
                x: [ point.x, point.x ],
                y: [ point.y, point.y ]
            };
        } else {
            if (point.x < this.boundaries.x[0]) {
                this.boundaries.x[0] = point.x;
            }
            if (point.x > this.boundaries.x[1]) {
                this.boundaries.x[1] = point.x;
            }
            if (point.y < this.boundaries.y[0]) {
                this.boundaries.y[0] = point.y;
            }
            if (point.y > this.boundaries.y[1]) {
                this.boundaries.y[1] = point.y;
            }
        }
    };

    this._findLastChildThatWouldntChangeLowerBoundary = function(point) {
        let index_to_insert = 0;
        for (var i = 0; i < this.children.length; i++) {
            if (!this.children[i]._wouldChangeLowerBoundary(point)) {
                index_to_insert = i;
            }
        }
        return index_to_insert;
    };

    this._wouldChangeLowerBoundary = function(point) {
        return (this.splitType() == KB_SplitType.VERTICAL)
            ? point.y < this.boundaries.y[0]
            : point.x < this.boundaries.x[0];
    };

    this.splitAndAdd = function(point) {
        let newChildren = [];
        for (var i = 0; i < this.pagesize() / 2; i++) {
            var theChildPage = new KB_Page({
                pagesize: this.pagesize(),
                splitType: KB_SplitType.next(this.splitType()),
                parent: this,
                tree: this.tree()
            });
            theChildPage.insert(this.children[2 * i]);
            theChildPage.insert(this.children[2 * i + 1]);
            newChildren.push(theChildPage);
        }

        this.children = newChildren;

        index_to_insert = this._findLastChildThatWouldntChangeLowerBoundary(point);
        this.children[index_to_insert].insert(point);
    };

    return this.init();
};

var KB_Tree = function(options) {

    this.init = function() {
        this._count = 0;
        this._pagesize = (options && options.pagesize) ? options.pagesize : 4;

        this._ensurePagesizeIsValid();

        this._root = new KB_Page({
            pagesize: this.pagesize(),
            splitType: KB_SplitType.HORIZONTAL,
            tree: this
        });
    };

    Object.assign(this, {
        pagesize:  () => this._pagesize,
        count:     () => this._count,
        root:      () => this._root
    });

    this.insert = function(point) {
        this._count++;
        this.root().insert(point);
    };

    this._ensurePagesizeIsValid = () => {
        if (this.pagesize() < 4) {
            throw KB_Exceptions.SmallPageSizeNotAllowedException;
        }
        if (this.pagesize() % 2 == 1) {
            throw KB_Exceptions.OddPageSizeNotAllowedException;
        }
    };

    return this.init();
};


module.exports = {
    Tree: KB_Tree,
    Page: KB_Page,
    PageType: KB_PageType,
    SplitType: KB_SplitType,
    Exceptions: KB_Exceptions,
    Printer: KB_Printer
};

