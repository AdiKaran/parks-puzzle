

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

export {cross, arrayEquals, unitContains} ;