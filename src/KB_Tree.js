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
    }

    this.insert = function(point) {
        this._count++;
        this.root.insert(point);
    }

    return this.init();
};

KB_Tree.Page = function(options) {
    this.type = KB_Tree.Page.PointsPage;
    this.children = [];
    this._pagesize = (options && options.pagesize) ? options.pagesize : 2;

    this.insert = function(point) {
        if (this.children.length == this._pagesize) {
            this.type = KB_Tree.Page.RegionPage;
            this.splitAndAdd(point);
        } else {
            this.children.push(point);
        }
    };

    this.splitAndAdd = function(point) {
        let newChildren = [
            new KB_Tree.Page(this._pagesize),
            new KB_Tree.Page(this._pagesize)
        ];
        for (var i = 0; i < this._pagesize / 2; i++) {
            newChildren[0].insert(this.children[i]);
        }
        for (var i = this._pagesize / 2; i < this.children.length; i++) {
            newChildren[1].insert(this.children[i]);
        }
        newChildren[1].insert(point);
        this.children = newChildren;
    };

    return this;
};

KB_Tree.Page.OverflowException = 'The page size has been reached and cannot add more points';
KB_Tree.Page.PointsPage = 'PointsPage';
KB_Tree.Page.RegionPage = 'RegionPage';


module.exports = KB_Tree;
