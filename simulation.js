function powerset(array) {
  var result = [];
  result.push([]);

  for (var i = 1; i < (1 << array.length); i++) {
    var subset = [];
    for (var j = 0; j < array.length; j++)
      if (i & (1 << j))
        subset.push(array[j]);

    result.push(subset);
  }

  return result;
}

function permutations(xs) {
    let ret = [];
    
    for (let i = 0; i < xs.length; i = i + 1) {
        let rest = permutations(xs.slice(0, i).concat(xs.slice(i + 1)));
        if(!rest.length) {
            ret.push([xs[i]])
        } else {
            for(let j = 0; j < rest.length; j = j + 1) {
                ret.push([xs[i]].concat(rest[j]))
            }
        }
    }

    return ret;
}

function all_rols(schools) {
    rols = [];
    for (const subset of powerset(schools)) {
        for (const permutation of permutations(subset)) {            
            let new_rol = permutation;
            new_rol.push("none");
            rols.push(new_rol);
        }
    }
    return rols;
}

function unconditional_probability_vec(rol, schools) {
    let probability_vec = [];
    for (let i = 0; i < rol.length; i++) {
        pr = schools[rol[i]][1];
        // get rejected by all schools before the current one.
        for (let j = 0; j < i; j++) {
            pr *= (1 - schools[rol[j]][1]);
        }
        probability_vec.push(pr);
    }
    return probability_vec;
}

function information_utility(consump_school, ref_school, schools, lbd) {
    let k = 1
    if (schools[consump_school][0] < schools[ref_school][0]) {
        k = lbd;
    }
    return k * (schools[consump_school][0] - schools[ref_school][0]);
}

function ebra(rol, schools, lbd) {
    const probs = unconditional_probability_vec(rol, schools);
    let sum = 0;
    for (let consump_ind = 0; consump_ind < rol.length; consump_ind++) {
        for (let ref_ind = 0; ref_ind < rol.length; ref_ind++) {
            const consump = rol[consump_ind];
            const ref = rol[ref_ind];
            sum += ((schools[consump][0] + information_utility(consump, ref, schools, lbd)) * probs[consump_ind] * probs[ref_ind]);
        }
    }
    return sum;
}

function optimize(schools, lbd) {
    const rols = all_rols(Object.keys(schools));
    schools["none"] = [0, 1]

    let max = 0;
    let max_rol = ["none"];
    
    for (const rol of rols) {
        const res_ebra = ebra(rol, schools, lbd);
        console.log(lbd);
        if (res_ebra > max) {
            max_rol = rol;
            max = res_ebra;
        }
    }

    return max_rol_to_str(max_rol);
}

function max_rol_to_str(max_rol) {
    let ret = max_rol[0];
    for (let i = 1; i < max_rol.length; i++) {
        ret = ret.concat(" > ", max_rol[i]);
    }
    return ret;
}

