if ( typeof(tests) != "object" ) {
    tests = [];
}

/*
 * Setup:
 * Test: Insert empty documents into database
 * Notes: Let mongod create missing _id field
 *        The generated Object ID for _id will be monotically increasing, and
 *            the index on _id will continually add entries larger than
 *            any current entry.
 */
tests.push( { name: "Insert.Empty",
              tags: ['insert','regression'],
              pre: function( collection ) { collection.drop(); },
              ops: [
                  { op:  "insert",
                    doc: {} }
              ] } );



/*
 * Setup:
 * Test: Insert a vector of documents. Each document has an integer field
 * Notes: Generates the _id field on the client
 *        
 */
tests.push( { name: "Insert.IntVector",
              tags: ['insert','regression'],
              pre: function( collection ) { collection.drop(); },
              ops: [
                  { op:  "insert",
                    doc: docs }
              ] } );

          


/*
 * Setup:
 * Test: Insert a vector of large documents. Each document contains a long string
 * Notes: Generates the _id field on the client
 *        
 */
tests.push( { name: "Insert.LargeDocVector",
              tags: ['insert','regression'],
              pre: function( collection ) { collection.drop(); },
              ops: [
                  { op:  "insert",
                    doc: docs }
              ] } );

