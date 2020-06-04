import {
  cross,
  arrayEquals,
  unitContains,
  newPark,
  isSolved,
  parsePuzzle,
  currentPlacement,
  isValid,
  solvePuzzle,
} from "./helpers.js";

var puzzles = {
  test: [
    {
      size: 4,
      puzzle: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [2, 2, 2, 2],
        [3, 3, 3, 3],
      ],
    },
  ],
};

var parseJSON = {
    size : 3,
    puzzle: [
        [0,0,0],
        [1,1,1],
        [2,2,2],
    ]
}

describe("Unit Functions", function () {
  describe("cross(A,B)", function () {
    it("return the cartesian product of two lists", function () {
      expect(cross([1, 2], [2, 4])).toEqual([
        [1, 2],
        [1, 4],
        [2, 2],
        [2, 4],
      ]);
    });
    it("returns an empty list of both lists are empty ", function () {
      expect(cross([], [])).toEqual([]);
    });
  });
  describe("arrayEquals(A,B)",function (){
      it("returns true is both arrays are empty", function () {
          expect(arrayEquals([],[])).toEqual(true)
      });
  });
  describe("unitContains(A,b)",function (){
      it("checks if a list A contains a given list b", function (){
          expect(unitContains([[1,2],[3,4]],[1,2])).toEqual(true);
          expect(unitContains([[[0,0]]],[0,0])).toEqual(false);
      });
  });
});

describe("newPark(puzzles,difficulty)",function (){
    it("check if newPark returns the correct park", function (){
        expect(newPark(puzzles,"test")).toEqual(puzzles.test[0]);
    });
});

let parsed = parsePuzzle(parseJSON)
describe("parsePuzzle(json)",function () { 
    it("check if json correct",function (){
        expect(parsed.json).toEqual(parseJSON);
    });
    it("check if squares are correct", function () {
        expect(parsed.squares.sort()).toEqual([[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]].sort()) ;
    });
    it("check if rows are correct", function () {
        expect(parsed.rows.sort()).toEqual([ [[0,0],[0,1],[0,2]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]]].sort());
    });
    it("check if columns are correct", function () {
        expect(parsed.cols.sort()).toEqual([ [[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]]].sort());
    });
    it("check if peers are correct", function () {
        expect(parsed.peers["0,0"]).toEqual( new Set(["0,0","0,1","0,2","1,0","1,1","2,0"]) ) ;
    });
});

let simple = parsePuzzle(puzzles.test[0])
describe("solvePuzzle", function () {
    it("check that no solutions are returned for a puzzle with no solutions",function (){
        expect(solvePuzzle(parsed.peers,parseJSON.size)).toEqual([]);
    });
    it("check that the test puzzle is solved correctly", function () {
        expect(solvePuzzle(simple.peers,puzzles.test[0].size).sort()).toEqual([[[0,1],[1,3],[2,0],[3,2]],[[0,2],[1,0],[2,3],[3,1]]])
    })

})
