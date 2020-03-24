var KBD_Tree = function() {

    this._count = 0;

    this.count = function() {
        return this._count;
    }

    this.insert = function() {
        this._count++;
    }

    return this;
};

module.exports = KBD_Tree;
