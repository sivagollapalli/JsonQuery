describe("JsonQuery", function(){
    var input;

    beforeEach(function(){
        input = JsonQuery(Movies);
    });
    describe("where", function(){
        var expected_movies;

        beforeEach(function(){
            expected_movies = [
            {"name":"Cool Hand Luke","rating":8.2,"director":"Stuart Rosenberg","year":1967,"actor":"Paul Newman"},
            {"name":"The Graduate","rating":8.1,"director":"Mike Nichols","year":1967,"actor":"Dustin Hoffman"},
            {"name":"Guess Who's Coming to Dinner","rating":7.7,"director":"Stanley Kramer","year":1967,"actor":"Spencer Tracy"}          ];
        });

        it("with no operator", function(){
            actual = input.where({'year': 1967}).exec();

            expect(actual.length).toEqual(3)
            expect(actual[0]).toEqual(expected_movies[0]);
        });

        it("with $eq operator", function(){
            actual = input.where({'year.$eq': 1967}).exec();

            expect(actual.length).toEqual(3)
            expect(actual[0]).toEqual(expected_movies[0]);
        });

        it("with $ne operator", function(){
            input = JsonQuery(expected_movies);
            actual = input.where({'rating.$ne': 8.2}).exec();

            expect(actual.length).toEqual(2)
            expect(actual[0]).toEqual(expected_movies[1]);
            expect(actual[1]).toEqual(expected_movies[2]);
        });
    });

    describe("where", function(){
        it("with $li operator", function(){
            actual = input.where({'name.$li': 'Terminator'}).exec();

            expect(actual.length).toEqual(2)
            expect(actual[0].name).toEqual("Terminator 2: Judgment Day");
            expect(actual[1].name).toEqual("The Terminator");
        });

        it("with $li operator with regex", function(){
            actual = input.where({'name.$li': /[a-zA-Z]+ [0-9]+/}).exec();

            expect(actual.length).toEqual(2)
            expect(actual[0].name).toEqual("Terminator 2: Judgment Day");
            expect(actual[1].name).toEqual("4 Months, 3 Weeks and 2 Days");
        });

        it("with $li without case sensitiveness", function(){
            actual = input.where({'name.$li': /terminator/i}).exec();

            expect(actual.length).toEqual(2)
            expect(actual[0].name).toEqual("Terminator 2: Judgment Day");
            expect(actual[1].name).toEqual("The Terminator");
        });
    });

    describe("where", function(){
        it("with $bt operator", function(){
            actual = input.where({'year.$bt': [1991, 1993]}).exec();

            expect(actual.length).toEqual(1)
            expect(actual[0]).toEqual({"name":"The Last of the Mohicans","rating":7.7,"director":"Michael Mann","year":1992,"actor":"Daniel Day-Lewis"});
        });

        it("$bt operator with improper range", function(){
            actual = input.where({'year.$bt': [9.1, 9.3]}).exec();

            expect(actual.length).toEqual(0)
        });

        it("$bt operator with float range", function(){
            actual = input.where({'rating.$bt': [8.5, 8.7]}).exec();

            expect(actual.length).toEqual(1)
            expect(actual[0]).toEqual({"name":"Terminator 2: Judgment Day","rating":8.6,"director":"James Cameron","year":1991,"actor":"Arnold Schwarzenegger"});
        });
    });

    describe("where", function(){
        it("with $lt operator", function(){
            actual = input.where({'rating.$lt': 7.6}).exec();

            expect(actual.length).toEqual(1)
            expect(actual[0]).toEqual({"name":"You Can Count on Me","rating":7.5,"director":"Kenneth Lonergan","year":2000,"actor":"Laura Linney"});
        });

        it("with $gt operator", function(){
            actual = input.where({'rating.$gt': 8.6}).exec();

            expect(actual.length).toEqual(1)
            expect(actual[0]).toEqual({"name":"Once Upon a Time in the West","rating":8.7,"director":"Sergio Leone","year":1968,"actor":"Henry Fonda"});
        });
    });

    describe("where", function(){
        it("with $in operator", function(){
            actual = input.where({'year.$in': [1991, 1992]}).exec();

            expect(actual.length).toEqual(3)
            expect(actual[0]).toEqual({"name":"Terminator 2: Judgment Day","rating":8.6,"director":"James Cameron","year":1991,"actor":"Arnold Schwarzenegger"});
        expect(actual[1]).toEqual({"name":"The Last of the Mohicans","rating":7.7,"director":"Michael Mann","year":1992,"actor":"Daniel Day-Lewis"});
        expect(actual[2]).toEqual({"name":"Barton Fink","rating":7.7,"director":"Joel Coen","year":1991,"actor":"John Turturro"});
        });

        it("with $ni operator", function(){
            actual = input.where({'rating.$ni': [7.5, 7.6, 7.7, 7.8, 7.9, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6]}).exec();

            expect(actual.length).toEqual(1)
            expect(actual[0]).toEqual({"name":"Once Upon a Time in the West","rating":8.7,"director":"Sergio Leone","year":1968,"actor":"Henry Fonda"})
        });
    });

    describe("where", function(){
        it("with multiple operators", function(){
            actual = input.where({'year.$bt': [1969, 1992], 'rating.$in': [7.6, 7.7], 'actor.$li': 'John'}).exec()

            expect(actual.length).toEqual(2)
            expect(actual[0]).toEqual({"name":"Barton Fink","rating":7.7,"director":"Joel Coen","year":1991,"actor":"John Turturro"})
            expect(actual[1]).toEqual({ name : 'A Fish Called Wanda', rating : 7.6, director : 'Charles Crichton', year : 1988, actor : 'John Cleese'});
        });
    });
});
