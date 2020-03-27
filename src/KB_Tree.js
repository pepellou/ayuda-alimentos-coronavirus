var KB_Tree = function(options) {

    this._count = 0;
    this._pagesize = (options && options.pagesize) ? options.pagesize : 2;

    this.init = function() {
        this.root = new KB_Tree.Page({
            pagesize: this._pagesize,
            splitType: KB_Tree.SplitType.HORIZONTAL
        });
    };

    this.count = function() {
        return this._count;
    };

    this.insert = function(point) {
        this._count++;
        this.root.insert(point);
    };

    this.print = function() {
        return this.root.print().join('\n');
    };

    return this.init();
};

KB_Tree.Page = function(options) {
    this.pageType = KB_Tree.PageType.PointsPage;
    this.splitType = (options && options.splitType) ? options.splitType : KB_Tree.SplitType.HORIZONTAL;
    this.children = [];
    this._pagesize = (options && options.pagesize) ? options.pagesize : 2;
    this.boundaries = null;

    this.convertToRegion = function() {
        this.pageType = KB_Tree.PageType.RegionPage;

        this.insert = function(point) {
            if (this.children.length == this._pagesize) {
                // TODO select child according to current dimension
                this.children[0].insert(point);
            } else {
                this.children.push(point);
                this.children.sort((p1, p2) => p1.y - p2.y);
            }
            this._updateBoundaries(point);
        };

        this.print = function() {
            var parts = [];

            parts.push('[' + this.printPageType() + ' (max: ' + this._pagesize + ')]' + this.printBoundaries() + this.printSplitType());

            this.children.forEach((p, i) => {
                parts.push('|');
                var pref = (i < this.children.length - 1) ? [ '|----', '|    ' ] : [ '+----', '     ' ];
                Array.prototype.push.apply(parts, p.print().map((l, j) => (j == 0) ? pref[0] + l : pref[1] + l));
            });

            return parts;
        };
    };

    this.insert = function(point) {
        if (this.children.length == this._pagesize) {
            this.splitAndAdd(point);
            this.convertToRegion();
        } else {
            this.children.push(point);
            this.children.sort((p1, p2) => p1.y - p2.y);
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

    this.splitAndAdd = function(point) {
        let newChildren = [
            new KB_Tree.Page({ pagesize: this._pagesize, splitType: KB_Tree.SplitType.next(this.splitType) }),
            new KB_Tree.Page({ pagesize: this._pagesize, splitType: KB_Tree.SplitType.next(this.splitType) })
        ];
        for (var i = 0; i < this._pagesize / 2; i++) {
            newChildren[0].insert(this.children[i]);
        }
        for (; i < this.children.length; i++) {
            newChildren[1].insert(this.children[i]);
        }
        newChildren[1].insert(point);

        this.children = newChildren;
    };

    this.printPageType = () => ((this.pageType == KB_Tree.PageType.PointsPage) ? 'POINTS' : 'REGION' );
    this.printSplitType = () => ((this.pageType == KB_Tree.PageType.PointsPage) ? '' : (' - split: ' + this.splitType))
    this.printBoundaries = () => {
        return ' - boundaries: ['
            + this.boundaries.x[0] + ', '
            + this.boundaries.x[1] + '] x ['
            + this.boundaries.y[0] + ', '
            + this.boundaries.y[1] + ']';
    };

    this.print = function() {
        return [
            '[' + this.printPageType() + ' (max: ' + this._pagesize + ')]' + this.printBoundaries() + this.printSplitType(),
            '|',
            '+----{ ' + this.children.map(p => '(' + p.x + ', ' + p.y + ')').join(', ') + ' }'
        ];
    };

    return this;
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


module.exports = KB_Tree;
