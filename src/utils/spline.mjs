/**
 * See original : https://github.com/thibauts/b-spline.
 * B-spline interpolation of control points of any dimensionality using de Boor's algorithm.
 * The interpolator can take an optional weight vector, making the resulting curve a Non-Uniform Rational B-Spline (NURBS) curve if you wish so.
 * The knot vector is optional too, and when not provided an unclamped uniform knot vector will be generated internally.
 * @param {number} t position along the curve in the [0, 1] range
 * @param {number} degree degree of the curve. Must be less than or equal to the number of control points minus 1. 1 is linear, 2 is quadratic, 3 is cubic, and so on.
 * @param {Array<Array<number>>} points control points that will be interpolated. Can be vectors of any dimensionality ([x, y], [x, y, z], ...)
 * @param {Array<number>} knots optional knot vector. Allow to modulate the control points interpolation spans on t. Must be a non-decreasing sequence of number of points + degree + 1 length values.
 * @param {Array<number>} weights 
 * @returns {Array<number>} A point
 */
function deBoor(t, degree, points, knots, weights) {

    let i,j,s,l;              // function-scoped iteration variables
    let n = points.length;    // points count
    let d = points[0].length; // point dimensionality

    if(degree < 1) throw new Error('degree must be at least 1 (linear)');
    if(degree > (n-1)) throw new Error('degree must be less than or equal to point count - 1');

    if(!weights) {
        // build weight vector of length [n]
        weights = [];
        for(i=0; i<n; i++) {
        weights[i] = 1;
        }
    }

    if(!knots) {
        // build knot vector of length [n + degree + 1]
        knots = [];
        for(i=0; i<n+degree+1; i++) {
        knots[i] = i;
        }
    } else {
        if(knots.length !== n+degree+1) throw new Error('bad knot vector length');
    }

    let domain = [
        degree,
        knots.length-1 - degree
    ];

    // remap t to the domain where the spline is defined
    let low  = knots[domain[0]];
    let high = knots[domain[1]];
    t = t * (high - low) + low;

    if(t < low || t > high) throw new Error('out of bounds');

    // find s (the spline segment) for the [t] value provided
    for(s=domain[0]; s<domain[1]; s++) {
        if(t >= knots[s] && t <= knots[s+1]) {
        break;
        }
    }

    // convert points to homogeneous coordinates
    let v = [];
    for(i=0; i<n; i++) {
        v[i] = [];
        for(j=0; j<d; j++) {
        v[i][j] = points[i][j] * weights[i];
        }
        v[i][d] = weights[i];
    }

    // l (level) goes from 1 to the curve degree + 1
    let alpha;
    for(l=1; l<=degree+1; l++) {
        // build level l of the pyramid
        for(i=s; i>s-degree-1+l; i--) {
        alpha = (t - knots[i]) / (knots[i+degree+1-l] - knots[i]);

        // interpolate each component
        for(j=0; j<d+1; j++) {
            v[i][j] = (1 - alpha) * v[i-1][j] + alpha * v[i][j];
        }
        }
    }

    // convert back to cartesian and return
    let result = [];
    for(i=0; i<d; i++) {
        result[i] = v[s][i] / v[s][d];
    }

    return result;
}

/**
 * Computes the spline according to the inputs
 * @param {number} degree degree of the curve. Must be less than or equal to the number of control points minus 1. 1 is linear, 2 is quadratic, 3 is cubic, and so on. 
 * @param {Array<Array<number>>} controlPoints control points that will be interpolated. Can be vectors of any dimensionality ([x, y], [x, y, z], ...)
 * @param {number} resolution number of points in the returned curve
 * @param {Array<number>} knots optional knot vector. Allow to modulate the control points interpolation spans on t. Must be a non-decreasing sequence of number of points + degree + 1 length values. 
 * @param {Array<number>} weights optional control points weights. Must be the same length as the control point array.
 * @returns {Array<Array<number>>} an array of points with a length of resolution. It represents the spline.
 */
export default function spline(degree, controlPoints, resolution, knots, weights) {
    let points = []
    if(!resolution) resolution = 100
    if(!knots || knots.length === 0) knots = undefined
    if(!weights || weights.length === 0) knots = undefined
    for(var t = 0; t < resolution; t++) {
        points.push(deBoor(t / resolution, degree, controlPoints, knots, weights))
    }
    return points
}