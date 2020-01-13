if (typeof(tests) !== "object") {
    tests = [];
}

/**
 * Sets up a collection and/or a view with the appropriate documents and indexes.
 *
  */
function collectionPopulator(isView, nDocs, indexes, docGenerator, collectionOptions) {
    return function(collectionOrView) {
        Random.setRandomSeed(258);

        collectionOrView.drop();

        var db = collectionOrView.getDB();
        var collection;
        if (isView) {
            // 'collectionOrView' is a view, so specify a backing collection to serve as its source
            // and perform the view creation.
            var viewName = collectionOrView.getName();
            var collectionName = viewName + "_BackingCollection";
            collection = db.getCollection(collectionName);
            collection.drop();

            var viewCreationSpec = {create: viewName, viewOn: collectionName};
            assert.commandWorked(db.runCommand(Object.extend(viewCreationSpec, collectionOptions)));
        } else {
            collection = collectionOrView;
        }

        var collectionCreationSpec = {create: collection.getName()};
        assert.commandWorked(
            db.runCommand(Object.extend(collectionCreationSpec, collectionOptions)));
        var bulkOp = collection.initializeUnorderedBulkOp();
        for (var i = 0; i < nDocs; i++) {
            bulkOp.insert(docGenerator(i));
        }
        bulkOp.execute();
        indexes.forEach(function(indexSpec) {
            assert.commandWorked(collection.ensureIndex(indexSpec));
        });
    };
}

/**
 * Rewrites a query op in benchRun format to the equivalent aggregation command op, also in benchRun
 * format.
 */
function rewriteQueryOpAsAgg(op) {
    var newOp = {
        op: "command",
        ns: "#B_DB",
        command: {
            aggregate: "#B_COLL",
            pipeline: [],
            cursor: {}
        }
    };
    var pipeline = newOp.command.pipeline;

    // Special case handling for legacy OP_QUERY find $query syntax. This is used as a workaround to
    // test queries with sorts in a fashion supported by benchRun.
    //
    // TODO SERVER-5722: adding full-blown sort support in benchRun should prevent us from requiring
    // this hack.
    if (op.query && op.query.$query) {
        pipeline.push({$match: op.query.$query});

        if (op.query.$orderby) {
            pipeline.push({$sort: op.query.$orderby});
        }

        return newOp;
    }

    if (op.query) {
        pipeline.push({$match: op.query});
    }

    if (op.skip) {
        pipeline.push({$skip: op.skip});
    }

    if (op.limit) {
        pipeline.push({$limit: op.limit});
    } else if (op.op === "findOne") {
        pipeline.push({$limit: 1});
    }

    // Confusingly, benchRun uses the name "filter" to refer to the projection (*not* the query
    // predicate).
    if (op.filter) {
        pipeline.push({$project: op.filter});
    }

    return newOp;
}

/**
 * Creates test cases and adds them to the global testing array. By default, each test case
 * specification produces several test cases:
 *  - A find on a regular collection.
 *  - A find on an identity view.
 *  - The equivalent aggregation operation on a regular collection.
 */
function addTestCase(options) {
    var isView = true;
    var indexes = options.indexes || [];
    var tags = options.tags || [];

    tests.push({
        tags: ["query"].concat(tags),
        name: "Queries." + options.name,
        pre: collectionPopulator(
            !isView, options.nDocs, indexes, options.docs, options.collectionOptions),
        post: function(collection) {
            collection.drop();
        },
        ops: [options.op]
    });

    if (options.createViewsPassthrough !== false) {
        tests.push({
            tags: ["views", "query_identityview"].concat(tags),
            name: "Queries.IdentityView." + options.name,
            pre: collectionPopulator(
                isView, options.nDocs, indexes, options.docs, options.collectionOptions),
            post: function(view) {
                view.drop();
                var collName = view.getName() + "_BackingCollection";
                view.getDB().getCollection(collName).drop();
            },
            ops: [options.op]
        });
    }

    // Generate a test which is the aggregation equivalent of this find operation.
    tests.push({
        tags: ["agg_query_comparison"].concat(tags),
        name: "Aggregation." + options.name,
        pre: collectionPopulator(
            !isView, options.nDocs, indexes, options.docs, options.collectionOptions),
        post: function(collection) {
            collection.drop();
        },
        ops: [rewriteQueryOpAsAgg(options.op)]
    });
}

/**
 * Setup: Create a collection of documents containing only an ObjectId _id field.
 *
 * Test: Empty query that returns all documents.
 */
addTestCase({
    name: "Empty",
    tags: ["regression"],
    // This generates documents to be inserted into the collection, resulting in 100 documents
    // with only an _id field.
    nDocs: 100,
    docs: function(i) {
        return {};
    },
    op: {op: "find", query: {}}
});

/**
 * Setup: Create a collection of documents with only an ObjectID _id field.
 *
 * Test: Query for a document that doesn't exist. Scans all documents using a collection scan and
 * returns no documents.
 */
addTestCase({
    name: "NoMatch",
    tags: ["regression"],
    nDocs: 100,
    docs: function(i) {
        return {};
    },
    op: {op: "find", query: {nonexistent: 5}}
});


/**
 * Setup: Create a collection of documents with only an integer _id field.
 *
 * Test: Query for all documents with integer _id in the range (50,100). All threads are returning
 * the same documents.
 */
addTestCase({
    name: "IntIDRange",
    tags: ["regression"],
    nDocs: 4800,
    docs: function(i) {
        return {_id: i};
    },
    op: {op: "find", query: {_id: {$gt: 50, $lt: 100}}}
});





var largeArray = [];
for (var i = 0; i < 1000; i++) {
    largeArray.push(i * 2);
}


/**
 * Setup: Create a collection of documents with indexed integer field x.
 *
 * Test: Query for all the documents (empty query), and use projection to return the field x. Each
 * thread accesses all the documents.
 */
addTestCase({
    name: "FindProjection",
    tags: ["regression", "indexed"],
    nDocs: 100,
    docs: function(i) {
        return {x: i};
    },
    indexes: [{x: 1}],
    op: {op: "find", query: {}, filter: {x: 1}}
});





