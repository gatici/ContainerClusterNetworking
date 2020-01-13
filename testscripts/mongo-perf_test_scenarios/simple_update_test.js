if ( typeof(tests) != "object" ) {
    tests = [];
}


/**
 * Setup: Populate the collection with 100 documents that have 512 fields with 
 *        a single character "a" 
 * Test:  Each thread does two multi updates on all documents
 *        First change a_256 to "a", then to "aa" 
 *        High contention on the documents as a result from the multi-updates
 */
tests.push( { name: "Update.FieldAtOffset",
              tags: ['update','regression'],
              pre: function( collection ) {
                  collection.drop();

                  var kFieldCount = 512;

                  // Build the document and insert several copies.
                  var toInsert = {};
                  for (var i = 0; i < kFieldCount; i++) {
                      toInsert["a_" + i.toString()] = "a";
                  }

                  var docs = [];
                  for (var i = 0; i < 100; i++) {
                      docs.push(toInsert);
                  }
                  collection.insert(docs);
                  collection.getDB().getLastError();
              },
              ops: [
                  { op:  "update",
                    multi: true,
                    query: {},
                    update: { $set: { "a_256": "a" } }
                  },
                  { op:  "update",
                    multi: true,
                    query: {},
                    update: { $set: { "a_256": "aa" } }
                  }
              ] } );


