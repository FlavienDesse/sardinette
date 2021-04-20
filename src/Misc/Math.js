import * as THREE from 'three'

/**
 * B-spline interpolation of control points of any dimensionality using de Boor's algorithm.
 * The interpolator can take an optional weight vector, making the resulting curve a Non-Uniform Rational B-Spline (NURBS) curve if you wish so.
 * The knot vector is optional too, and when not provided an unclamped uniform knot vector will be generated internally.
 * @param {number} t position along the curve in the [0, 1] range
 * @param {number} degree degree of the curve. Must be less than or equal to the number of control points minus 1. 1 is linear, 2 is quadratic, 3 is cubic, and so on.
 * @param {Array<Array<number>>} points control points that will be interpolated. Can be vectors of any dimensionality ([x, y], [x, y, z], ...)
 * @param {Array<number>} knots optional knot vector. Allow to modulate the control points interpolation spans on t. Must be a non-decreasing sequence of number of points + degree + 1 length values.
 * @param {Array<number>} weights
 * @returns {Array<number>} A point
 * @see original : https://github.com/thibauts/b-spline/blob/master/index.js
 */
function deBoor(t, degree, points, knots, weights) {

    let i, j, s, l            // function-scoped iteration variables
    let n = points.length     // points count
    let d = points[0].length  // point dimensionality

    if (degree < 1) throw new Error('degree must be at least 1 (linear)')
    if (degree > (n - 1)) throw new Error('degree must be less than or equal to point count - 1')

    if (!weights) {
        // build weight vector of length [n]
        weights = new Array(n).fill(1)
    }

    if (!knots) {
        // build knot vector of length [n + degree + 1]
        knots = Array.from(new Array(n + degree + 1), (_, idx) => idx)
    } else if (knots.length !== n + degree + 1) throw new Error('bad knot vector length')

    let domain = [
        degree,
        knots.length - 1 - degree
    ]

    // remap t to the domain where the spline is defined
    let low = knots[domain[0]]
    let high = knots[domain[1]]
    t = t * (high - low) + low

    if (t < low || t > high) throw new Error('out of bounds')

    // find s (the spline segment) for the [t] value provided
    for (s = domain[0]; s < domain[1]; s++) {
        if (t >= knots[s] && t <= knots[s + 1]) {
            break
        }
    }

    // convert points to homogeneous coordinates
    let v = []
    for (i = 0; i < n; i++) {
        v[i] = []
        for (j = 0; j < d; j++) {
            v[i][j] = points[i][j] * weights[i]
        }
        v[i][d] = weights[i]
    }

    // l (level) goes from 1 to the curve degree + 1
    let alpha
    for (l = 1; l <= degree + 1; l++) {
        // build level l of the pyramid
        for (i = s; i > s - degree - 1 + l; i--) {
            alpha = (t - knots[i]) / (knots[i + degree + 1 - l] - knots[i])

            // interpolate each component
            for (j = 0; j < d + 1; j++) {
                v[i][j] = (1 - alpha) * v[i - 1][j] + alpha * v[i][j]
            }
        }
    }

    // convert back to cartesian and return
    let result = []
    for (i = 0; i < d; i++) {
        result[i] = v[s][i] / v[s][d]
    }

    return result
}

/**
 * Computes the euclidian distance between two points
 * @param {Array<number>|THREE.Vector3} pointA
 * @param {Array<number>|THREE.Vector3} pointB
 * @returns {number}
 */
function distance(pointA, pointB) {

    // Format the point A if not in the good format
    if (pointA.x !== undefined) {
        pointA = [pointA.x, pointA.y, pointA.z]
    }
    // Format the point B if not in the good format
    if (pointB.x !== undefined) {
        pointB = [pointB.x, pointB.y, pointB.z]
    }

    // Find the highest dimension of the two points
    let dimension = Math.max(pointA.length, pointB.length)

    let sum = 0
    for (let i = 0; i < dimension; i++) {

        // Use 0 as a default value if the point has a lower dimension
        let a = pointA[i] || 0
        let b = pointB[i] || 0

        // Add the powers of two
        sum += Math.pow(a - b, 2)
    }

    // Return the square root
    return Math.sqrt(sum)
}

/**
 * Computes the approximated length of a curve
 * @param {Array<Array<number>>|Array<THREE.Vector3>} points
 * @param {boolean} closed Optional parameter that tells if the curve is closed or not closed
 * @returns {number} The length of the curve
 */
function curveLength(points, closed) {
    let formattedPoints = points
    // Format the point if not in the good format
    if (points[0].x !== undefined) {
        formattedPoints = fromVector3(points)
    }

    // Don't close the curve by default
    closed = closed || false

    let sum = 0
    formattedPoints.forEach((elt, idx) => {
        if (formattedPoints.length === idx + 1) return

        // Add the distances
        sum += distance(elt, formattedPoints[idx + 1])
    })
    if (closed) sum += distance(formattedPoints[0], formattedPoints[formattedPoints.length - 1])

    return sum
}

/**
 * Convert an Array of THREE.Vector3 into an Array of Array of number
 * @param {Array<THREE.Vector3>} points
 * @returns {Array<Array<number>>}
 * @see toVector3
 */
function fromVector3(points) {
    let res = []
    if (points[0].x === undefined) return points
    points.forEach(elt => {
        res.push([elt.x, elt.y, elt.z])
    })
    return res
}

/**
 * Convert an Array of Array of number into an Array of THREE.Vector3
 * @param {Array<Array<number>>} points
 * @returns {Array<THREE.Vector3>}
 * @see fromVector3
 */
function toVector3(points) {
    let res = []
    if (points[0].x !== undefined) return points
    points.forEach(elt => {
        res.push(new THREE.Vector3(elt[0], elt[1], elt[2]))
    })
    return res
}

/**
 *
 * @param {Array<Array<number>>|Array<THREE.Vector3>} points
 * @returns {Array<number>}
 */
function toVector1(points) {
    points = fromVector3(points)

    let res = []
    points.forEach(elt => {
        elt.forEach(coord => {
            res.push(coord)
        })
    })

    return res
}

function fromVector1(points) {
    let res = []

    for (let i = 0; i < points.length; i += 3) {
        res.push(new THREE.Vector3(points[i], points[i + 1], points[i + 2]))
    }

    return res;
}

/**
 * Computes the spline according to the inputs
 * @param {number} degree degree of the curve. Must be less than or equal to the number of control points minus 1. 1 is linear, 2 is quadratic, 3 is cubic, and so on.
 * @param {Array<Array<number>>|Array<THREE.Vector3>} controlPoints control points that will be interpolated. Can be vectors of any dimensionality ([x, y], [x, y, z], ...)
 * @param {number} resolution number of points per unit in the returned curve
 * @param {Array<number>} knots optional knot vector. Allow to modulate the control points interpolation spans on t. Must be a non-decreasing sequence of number of points + degree + 1 length values.
 * @param {Array<number>} weights optional control points weights. Must be the same length as the control point array.
 * @returns {Array<number>} an array of points that represents the spline.
 */
function bSpline(degree, controlPoints, resolution, knots, weights) {

    let formattedControlPoints = fromVector3(controlPoints)

    let points = []

    // Set the default resolution per unit
    if (!resolution) resolution = 50

    // Set the default knots array to undefined (will be initialized in the deBoor function)
    if (!knots || knots.length === 0) {
        knots = undefined
    } else {
        const isKnotsAscending = array => array.map((a, i) => a > array[i + 1]).indexOf(true) === -1
        if (!isKnotsAscending(knots)) {
            throw new Error("Bad knots vector")
        }
    }

    // Set the default weights array to undefined (will be initialized in the deBoor function)
    if (!weights || weights.length === 0) weights = undefined

    // Let's say the length is equal to 1, there are resolution * 1 points that are represented by pNum
    let pNum = resolution
    let length = 1

    let lastLength = length
    do {
        // With each loop, pNum will change according to the computed length
        // as the number of points will always be resolution * length
        pNum = Math.floor(resolution * length)
        points = []

        // Compute a homogeneous array of points representing the spline
        for (var t = 0; t <= pNum; t++) {
            points.push(deBoor(t / pNum, degree, formattedControlPoints, knots, weights))
        }

        // Compute the length of the curve
        length = curveLength(points)

        // If the length hasn't changed, we stop here
        if (lastLength === length) break
        lastLength = length

        // While the number of points doesn't match the length of the curve with the given resolution
        // This is an approximation with an error of 0.5%
    } while (length * 0.995 > pNum / resolution || length * 1.005 < pNum / resolution)

    return toVector1(points)
}

// C-SPLINE

/**
 * Computes the Centripetal Catmull-Rom spline according to the inputs
 * @param {Array<Array<number>>|Array<THREE.Vector3>} controlPoints control points that will be interpolated. Can be vectors of any dimensionality ([x, y], [x, y, z], ...)
 * @param {number} resolution number of points per unit in the returned curve
 * @param {boolean} closed if the curve should be closed or not
 * @returns {Array<number>} an array of points that represents the spline.
 */
function catmullRomSpline(controlPoints, resolution, closed, isResolutionRelativeToLength) {

    let formattedControlPoints = toVector3(controlPoints)


    if (isResolutionRelativeToLength === undefined) isResolutionRelativeToLength = true

    let points = []

    // Set the default resolution per unit
    if (!resolution) resolution = 100
    if (!closed) closed = false

    let curve = new THREE.CatmullRomCurve3(formattedControlPoints, closed)

    // Let's say the length is equal to 1, there are resolution * 1 points that are represented by pNum
    let pNum = resolution
    let length = 1

    let lastLength = length
    do {
        // With each loop, pNum will change according to the computed length
        // as the number of points will always be resolution * length
        pNum = Math.ceil(resolution * length)
        points = []

        // Compute a homogeneous array of points representing the spline
        for (var t = 0; t <= pNum; t++) {
            points.push(curve.getPoint(t / pNum))
        }

        // Compute the length of the curve
        length = curveLength(points)

        // If the length hasn't changed, we stop here
        if (lastLength === length) break
        lastLength = length

        // While the number of points doesn't match the length of the curve with the given resolution
        // This is an approximation with an error of 0.5%
    } while (isResolutionRelativeToLength && (length * 0.995 > pNum / resolution || length * 1.005 < pNum / resolution))

    return toVector1(points)
}

/**
 *
 * @param {Array<THREE.Vector3>} curveA
 * @param {Array<THREE.Vector3>} curveB
 * @returns {Array<Array<THREE.Vector3>} An array of triangles
 */
function getSurface(curveA, curveB) {
    let triangles = []

    let maxLength = Math.max(curveA.length, curveB.length)
    let smallCurve
    let longCurve
    if (maxLength === curveA.length) {
        longCurve = fromVector3(curveA)
        smallCurve = fromVector3(curveB)
    } else {
        longCurve = fromVector3(curveB)
        smallCurve = fromVector3(curveA)
    }

    if (smallCurve.length !== longCurve.length) {
        let ratio = (longCurve.length - smallCurve.length) / (smallCurve.length - 1)
        let trace = 0

        for (let i = 1; i < smallCurve.length; i++) {
            trace += ratio
            let n = Math.floor(trace)
            let j = 1
            if (trace >= 1 || (i === smallCurve.length - 1 && trace > 0.5)) {
                let a = {x: smallCurve[i - 1][0], y: smallCurve[i - 1][1], z: smallCurve[i - 1][2]}
                let b = {x: smallCurve[i][0], y: smallCurve[i][1], z: smallCurve[i][2]}
                let c = {x: 0, y: 0, z: 0}
                while (trace >= 1 || (i === smallCurve.length - 1 && trace > 0.5)) {
                    c.x = a.x + (b.x - a.x) / (n + 1) * j
                    c.y = a.y + (b.y - a.y) / (n + 1) * j
                    c.z = a.z + (b.z - a.z) / (n + 1) * j
                    smallCurve.splice(i, 0, [c.x, c.y, c.z])
                    i++
                    j++
                    trace--
                }
            }
        }
    }

    smallCurve.forEach((elt, idx) => {
        if (idx + 1 >= smallCurve.length) return
        let t = [elt, longCurve[idx], smallCurve[idx + 1]]
        let t2 = [longCurve[idx], smallCurve[idx + 1], longCurve[idx + 1]]
        triangles.push(toVector3(t))
        triangles.push(toVector3(t2))
    })
    return triangles
}

/**
 *
 * @param {THREE.Vector3} point
 * @param {Array<THREE.Vector3>} curve
 * @returns {THREE.Vector3} The mirrored point
 */
function mirrorPointFromCurve(point, curve) {
    let res = new THREE.Vector3(0, 0, 0)

    curve.forEach(elt => {
        res.x += 2 * elt.x - point.x
        res.y += 2 * elt.y - point.y
        res.z += 2 * elt.z - point.z
    })

    res.x /= curve.length
    res.y /= curve.length
    res.z /= curve.length
    res.x = Math.round(res.x * 10000) / 10000
    res.y = Math.round(res.y * 10000) / 10000
    res.z = Math.round(res.z * 10000) / 10000
    return res
}

/**
 *
 * @param {THREE.Vector3} point
 * @param {string} axis
 */
function mirrorPoint(point, axis) {

    switch (axis.toLowerCase()) {
        case 'x':
            point[0] *= -1
            break
        case 'y':
            point[1] *= -1
            break
        case 'z':
            point[2] *= -1
            break
        default:
            throw new Error("Axis invalid")
    }
    return point
}

/**
 *
 * @param {Array<THREE.Vector3>} curve
 * @param {string} axis
 * @returns {Array<THREE.Vector3>} The mirrored curve
 */
function mirrorCurve(curve, axis) {

    let res = []

    for (let i = 0; i < curve.length; i += 3) {
        let elt = [curve[i], curve[i + 1], curve[i + 2]]
        res.push(...mirrorPoint(elt, axis))
    }

    return res
}

/**
 *
 * @param {Array<Array<THREE.Vector3>>} curves  The points of each curve
 * @param {number} minResolution The minimum resolution
 * @returns {Array<Array<THREE.Vector3>>} An array of triangles
 */
function loftSurface(curves, minResolution) {
    let surface = []
    let loftCurves = []

    minResolution = minResolution || 20
    let maxLength = 0

    // Find the maximum number of points
    curves.forEach(elt => {
        if (elt.length > maxLength) maxLength = elt.length
    })
    
    let closed = false
    if(curves[0].length === curves[curves.length - 1].length) {
        let first = curves[0]
        let last = curves[curves.length - 1]
        let doublon = true
        for(let i = 0; i < first.length; i++) {
            if(first[i].x !== last[i].x || first[i].y === last[i].y || first[i].z === last[i].z) {
                doublon = false
                break
            }
        }
        if(doublon) {
            closed = true
            curves.length--
        }
    }

    // Find the control points for the curves making the surface up
    for (let i = 0; i < curves.length; i++) {
        let curve = curves[i]
        let ratio = curve.length / maxLength

        // Uses a surjective function to map each point of the longest curve (of maxLength)
        // to the other curves' points uniformly
        if (i === 0) {
            for (let j = 0; j < maxLength; j++) {
                let val = ratio * (j + 1) - 1
                loftCurves.push([curve[Math.round(val < 0 ? 0 : val)]])
            }
        } else {
            let idx = 0
            for (let j = 0; j < maxLength; j++) {
                let val = ratio * (j + 1) - 1
                loftCurves[idx].push(curve[Math.round(val < 0 ? 0 : val)])
                idx++
            }
        }
    }

    let fullLoftCurves = []
    // Build the curves with the control points that were just computed
    loftCurves.forEach(elt => {
        let last = elt[0]
        let i = 1
        while (i < elt.length) {
            let current = elt[i]
            if (last.x === current.x && last.y === current.y && last.z === current.z) return
            last = current
            i++
        }
        fullLoftCurves.push(fromVector1(catmullRomSpline(elt, minResolution, closed)))
    })

    // Build the surfaces between each curve
    fullLoftCurves.forEach((elt, idx) => {
        if (idx === fullLoftCurves.length - 1) return
        let tmp = getSurface(elt, fullLoftCurves[idx + 1])
        tmp.forEach(triangle => {
            surface.push(triangle)
        })
    })
    return surface
}

/**
 * Compute a point of the Bezier's curve using De Casteljau’s algorithm
 * @param {Array<THREE.Vector3>} controlPoints
 * @param {number} t The timestep
 * @returns A point corresponding to the Bezier's curve of the control points at the given timestep
 */
function bezierStep(controlPoints, t) {
    if (controlPoints.length === 1) {
        return controlPoints[0]
    }

    let newControlPoints = []

    controlPoints.forEach((elt, idx) => {
        if (idx >= controlPoints.length - 1) return
        newControlPoints.push(new THREE.Vector3(
            elt.x + (controlPoints[idx + 1].x - elt.x) * t,
            elt.y + (controlPoints[idx + 1].y - elt.y) * t,
            elt.z + (controlPoints[idx + 1].z - elt.z) * t,
        ))
    })
    return bezierStep(newControlPoints, t)
}

/**
 * Computes the Bezier's curve using De Casteljau’s algorithm
 * @link https://javascript.info/bezier-curve
 * @param {Array<THREE.Vector3>} controlPoints
 * @param {number} resolution
 * @returns {Array<THREE.Vector3>}
 */
function bezierCurve(controlPoints, resolution) {

    controlPoints = toVector3(controlPoints)

    let points = []

    // Set the default resolution per unit
    if (!resolution) resolution = 100

    // Let's say the length is equal to 1, there are resolution * 1 points that are represented by pNum
    let pNum = resolution
    let length = 1

    let lastLength = length
    do {
        // With each loop, pNum will change according to the computed length
        // as the number of points will always be resolution * length
        pNum = Math.floor(resolution * length)
        points = []

        // Compute a homogeneous array of points representing the spline
        let t = 0
        for (t = 0; t <= pNum; t++) {
            points.push(bezierStep(controlPoints, t / pNum))
        }

        // Compute the length of the curve
        length = curveLength(points)

        // If the length hasn't changed, we stop here
        if (lastLength === length) break
        lastLength = length
        // While the number of points doesn't match the length of the curve with the given resolution
        // This is an approximation with an error of 0.5%
    } while (length * 0.995 > pNum / resolution || length * 1.005 < pNum / resolution)

    return toVector1(points)
}

export {
    bSpline,
    catmullRomSpline,
    toVector3,
    fromVector3,
    toVector1,
    fromVector1,
    curveLength,
    distance,
    getSurface,
    mirrorPoint,
    mirrorPointFromCurve,
    mirrorCurve,
    loftSurface,
    bezierCurve
}