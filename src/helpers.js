function cross(A,B){
        let result = [];
        for(let a of A){
            for(let b of B){
                result.push([a,b]);
            }
        }
        return(result);
    }
function arrayEquals(A,B){
    if (A === B) return true;
    for (var i = 0; i < A.length; i++) {
        if (A[i] !== B[i]) return false;
    }
    return true;
}

function unitContains(A,b){
    for(let a of A){
        if(arrayEquals(a,b)){
            return true;
        }            
    }
    return false;
}

function newPark(puzzles,difficulty){
    let puzzle;
    switch(difficulty){
        case 'easy':
            puzzle = puzzles.easy[Math.floor(Math.random() * puzzles.easy.length)];
            break ;
        case 'medium':
            puzzle = puzzles.medium[Math.floor(Math.random() * puzzles.medium.length)];
            break ;
        case 'test':
            puzzle = puzzles.test[0]
            break;
        default :
            puzzle = puzzles.test[0]
            break;
    }
    return puzzle
}

function isSolved(peers, json, parksPuzzle, trees){
  if (parksPuzzle.treeCount !== json.size) {
    return false;
  }
  for (let key in trees) {
    if (trees[key] === true) {
      for (let square of peers[key]) {
        if (trees[square.toString()] === true && square !== key) {
          return false;
        }
      }
    }
  }
  return true;
}      

// json => {json:original puzzle rows: [] co]s: , parks:[], peers:{},
function parsePuzzle(json){
    let size,puzzle,rowArr = [],colArr = [],
    squares, rows=[],cols=[],parks=[],peers ={};

    ({size,puzzle} = json ) ;
    for(let i = 0; i<size;i++){
        rowArr.push(i);
        colArr.push(i);
        parks.push([]);
        rows.push([]);
        cols.push([]);
    }
    squares = cross(rowArr,colArr)
    // Creating separate arrays for each park
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++ ){
            parks[puzzle[i][j]].push([i,j]) ;
            cols[j].push([i,j]);
            rows[i].push([i,j]);
        }
    }
    // Todo: optimize peer generation
    for(let sq of squares){
        let [a,b] = sq ;
        let sq_peers = new Set()
        for(let row of rows){
            if(unitContains(row,sq)){
                for(let val of row){
                    sq_peers.add(val.toString()) ;
                }
            }
        }
        for(let col of cols){
            if (unitContains(col, sq)) {
                for(let val of col){
                    sq_peers.add(val.toString()) ;
                }
            }
        }
        for(let park of parks){
            if (unitContains(park, sq)) {
                for(let val of park){
                    sq_peers.add(val.toString()) ;
                }
            }
        }
        for(let i = (a-1);(i <= (a+1) && i<size);i++ ){
            if(i<0){continue;}
            for(let j = (b-1); (j<=(b+1) && j<size);j++ ){
                if(j<0){continue;}
                sq_peers.add([i,j].toString()) ;
            }
        }
        peers[sq] = sq_peers ;            
    }
    return({json:json,squares:squares,rows:rows,cols:cols,parks:parks,peers:peers})
}

// Solving the current Board
// Todo: optimize checking square validity 
/*  variables: squares [0,0]...[i,j]...[n,n]
    values : "X,T"
    constraints:
    - number of Ts = n
    - Only one T in each unit (row,column,park)
    - Ts can't be next to each other 
    Starting with the first row, place a tree in the first valid column,
    -for each row, place a Tin the first valid position and move to the next row
    -If there are no valid positions, backtrack and try the next column of the previous row
*/
function currentPlacement(stack){
//Takes the column values from the stack,
//returns the corresponding tree placement
    return Array.from(stack.keys()).map((i) => [i, stack[i]]);
}
function isValid(peers,treePlacement, position){
//Checks if a tree may be placed in a given position
    let posStr = position.toString();
    for(let t of treePlacement){
        for(let sq of peers[t.toString()]){
            if(sq === posStr){
                return false ;
            }
        }            
    }
    return true ;
}
function solvePuzzle(peers,size){
    let stack = [],solutions = [], col =0, row=0  ;
    
    while(true){
        while(col<size && !(isValid(peers,currentPlacement(stack),[row,col]))){
            col++;
        }

        if(col<size){
            stack.push(col);
            if(row+1 >= size){
                solutions.push(currentPlacement(stack));
                stack.pop();
                col = size;                    
            }
            else{
                row++;
                col =0;
            }
        }
        if (col>=size){
            if(row === 0){                    
                return solutions
            }
            let curr = stack.pop();
            col = curr + 1 ;
            row -- ;
        }

    }
}

export {cross, arrayEquals, unitContains, newPark, isSolved, parsePuzzle, currentPlacement,isValid,solvePuzzle} ;