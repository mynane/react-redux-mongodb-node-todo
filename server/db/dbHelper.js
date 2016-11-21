var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var ImageEntity = require('../models/Image').ImageEntity;

var pageQuery = function (page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page
    };
    async.parallel({
        count: function (done) {  // 查询数量
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        records: function (done) {   // 查询一页的记录.populate(populate)
            Model.find(queryParams).populate(populate).skip(start).limit(pageSize).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        }
    }, function (err, results) {
        var count = results.count;
        $page.pageCount = (count - 1) / pageSize + 1;
        $page.count = results.count;
        $page.results = results.records;
        $page.results.files = results.files;
        callback(err, $page);
    });
};

var detailQuery = function (Model, populate, queryParams, sortParams, callback) {
    var $page = {};
    async.parallel({
        detail: function (done) {   // 查询一页的记录.populate(populate)
            Model.findOne(queryParams).populate(populate).sort(sortParams).exec(function (err, doc) {
                done(err, doc);
            });
        },
        files: function (done) {
            ImageEntity.find({'listId': queryParams._id}).exec(function(err, doc){
                done(err, doc);
            });
        }
    }, function (err, results) {
        callback(err, results);
    });
}
module.exports = {
    pageQuery: pageQuery,
    detailQuery: detailQuery
};