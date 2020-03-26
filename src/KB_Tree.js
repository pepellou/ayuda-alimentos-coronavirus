var KB_Tree = function(options) {

    this._count = 0;
    this._pagesize = (options && options.pagesize) ? options.pagesize : 2;

    this.init = function() {
        this.root = new KB_Tree.Page({
            pagesize: this._pagesize
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
    this.type = KB_Tree.Page.PointsPage;
    this.children = [];
    this._pagesize = (options && options.pagesize) ? options.pagesize : 2;
    this.boundaries = null;

    this.insert = function(point) {
        if (this.children.length == this._pagesize) {
            if (this.type == KB_Tree.Page.PointsPage) {
                this.type = KB_Tree.Page.RegionPage;
                this.splitAndAdd(point);
            } else {
                // TODO select child according to current dimension
                this.children[0].insert(point);
            }
        } else {
            this.children.push(point);
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
            new KB_Tree.Page({ pagesize: this._pagesize }),
            new KB_Tree.Page({ pagesize: this._pagesize })
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

    this.print = function() {
        var parts = [];
        parts.push(
            '['
            + ((this.type == KB_Tree.Page.PointsPage) ? 'POINTS' : 'REGION' )
            + ' (max: ' + this._pagesize + ')] - boundaries: ['
            + this.boundaries.x[0] + ', '
            + this.boundaries.x[1] + '] x ['
            + this.boundaries.y[0] + ', '
            + this.boundaries.y[1] + ']'
        );
        if (this.type == KB_Tree.Page.PointsPage) {
            parts.push('|');
            var line_points = '+----{ ';
            var first = true;
            for (var i = 0; i < this.children.length; i++) {
                var the_point = this.children[i];
                if (!first) {
                    line_points += ', ';
                }
                line_points += '(' + the_point.x + ', ' + the_point.y + ')';
                first = false;
            }
            parts.push(line_points + ' }');
        } else {
            var left_lines = this.children[0].print();
            var right_lines = this.children[1].print();
            parts.push('|');
            parts.push('|----' + left_lines.shift());
            left_lines.forEach(function(line) {
                parts.push('|    ' + line);
            });
            parts.push('|');
            parts.push('+----' + right_lines.shift());
            right_lines.forEach(function(line) {
                parts.push('     ' + line);
            });
        }
        return parts;
    };

    return this;
};

KB_Tree.Page.OverflowException = 'The page size has been reached and cannot add more points';
KB_Tree.Page.PointsPage = 'PointsPage';
KB_Tree.Page.RegionPage = 'RegionPage';


module.exports = KB_Tree;
