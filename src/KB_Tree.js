var KB_Tree = function(options) {

    this.init = function() {
        this._count = 0;
        this._pagesize = (options && options.pagesize) ? options.pagesize : 4;

        this._ensurePagesizeIsValid();

        this.root = new KB_Tree.Page({
            pagesize: this.pagesize(),
            splitType: KB_Tree.SplitType.HORIZONTAL,
            tree: this
        });
    };

    Object.assign(this, {
        pagesize:  () => this._pagesize,
        count:     () => this._count
    });

    this.insert = function(point) {
        this._count++;
        this.root.insert(point);
    };

    this._ensurePagesizeIsValid = () => {
        if (this.pagesize() < 4) {
            throw KB_Tree.Exceptions.SmallPageSizeNotAllowedException;
        }
        if (this.pagesize() % 2 == 1) {
            throw KB_Tree.Exceptions.OddPageSizeNotAllowedException;
        }
    };

    this.print = function() {
        return this.root.print().join('\n');
    };

    return this.init();
};

KB_Tree.Page = function(options) {

    this.init = function() {
        this._pageType = KB_Tree.PageType.PointsPage;
        this._splitType = (options && options.splitType) ? options.splitType : KB_Tree.SplitType.HORIZONTAL;
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
        this._pageType = KB_Tree.PageType.RegionPage;

        this.insert = function(point) {
            this._count++;
            let index_to_insert = 0;
            for (var i = 0; i < this.children.length; i++) {
                if (!this.children[i].wouldChangeLowerBoundary(point)) {
                    index_to_insert = i;
                }
            }
            // TODO maybe we need to rebalance the tree when 1st child starts overlapping with 2nd and so
            this.children[index_to_insert].insert(point);
            this._updateBoundaries(point);
        };

        this.print = function() {
            var parts = [];

            parts.push('[' + this.printPageType() + ' (max: ' + this.pagesize() + ')]' + this.printBoundaries() + this.printSplitType());

            this.children.forEach((p, i) => {
                parts.push('|');
                var pref = (i < this.children.length - 1) ? [ '|----', '|    ' ] : [ '+----', '     ' ];
                Array.prototype.push.apply(parts, p.print().map((l, j) => (j == 0) ? pref[0] + l : pref[1] + l));
            });

            return parts;
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
                (this.splitType() == KB_Tree.SplitType.HORIZONTAL)
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

    this.wouldChangeLowerBoundary = function(point) {
        return (this.splitType() == KB_Tree.SplitType.VERTICAL)
            ? point.y < this.boundaries.y[0]
            : point.x < this.boundaries.x[0];
    };

    this.splitAndAdd = function(point) {
        let newChildren = [];
        let index_to_insert = 0;
        for (var i = 0; i < this.pagesize() / 2; i++) {
            var theChildPage = new KB_Tree.Page({
                pagesize: this.pagesize(),
                splitType: KB_Tree.SplitType.next(this.splitType()),
                parent: this,
                tree: this.tree()
            });
            theChildPage.insert(this.children[2 * i]);
            theChildPage.insert(this.children[2 * i + 1]);
            newChildren.push(theChildPage);
            if (!theChildPage.wouldChangeLowerBoundary(point)) {
                index_to_insert = i;
            }
        }
        newChildren[index_to_insert].insert(point);

        this.children = newChildren;
    };

    this.printPageType = () => ((this.pageType() == KB_Tree.PageType.PointsPage) ? 'POINTS' : 'REGION' );
    this.printSplitType = () => (' - split: ' + this.splitType());
    this.printBoundaries = () => {
        return ' - boundaries: ['
            + this.boundaries.x[0] + ', '
            + this.boundaries.x[1] + '] x ['
            + this.boundaries.y[0] + ', '
            + this.boundaries.y[1] + ']';
    };

    this.print = function() {
        return [
            '[' + this.printPageType() + ' (max: ' + this.pagesize() + ')]' + this.printBoundaries() + this.printSplitType(),
            '|',
            '+----{ ' + this.children.map(p => '(' + p.x + ', ' + p.y + ')').join(', ') + ' }'
        ];
    };

    return this.init();
};

KB_Tree.PageType = {
    PointsPage: 'PointsPage',
    RegionPage: 'RegionPage'
};

KB_Tree.SplitType = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL',
    next: function(pageType) {
        return pageType == KB_Tree.SplitType.HORIZONTAL ? KB_Tree.SplitType.VERTICAL : KB_Tree.SplitType.HORIZONTAL;
    }
};

KB_Tree.Exceptions = {
    SmallPageSizeNotAllowedException: new Error('Cannot create tree with a pagesize less than 4'),
    OddPageSizeNotAllowedException: new Error('Cannot create tree with an odd pagesize - only even pagesizes are allowed')
};


module.exports = KB_Tree;
