export default class Object {


    static CONSTANT_ALL_POINTS = ["Point", "Mirrored Point"]
    static CONSTANT_ALL_SURFACES = ["Surface", "Import STL", "Loft Surface"]
    static CONSTANT_ALL_CURVES = ["B-Spline", "Catmull Rom Spline", "Mirrored Curve", "Bezier", "NURBS"]

    static DEFAULT_NAME_BEZIER = "Bezier0"
    static DEFAULT_NAME_NURBS = "NURBS0"
    static DEFAULT_NAME_CATMULL_ROM_SPLINE = "CatmullRomSpline0"
    static DEFAULT_NAME_B_SPLINE = "B-Spline0"
    static DEFAULT_NAME_MIRRORED_CURVE = "MirroredCurve0"
    static DEFAULT_COLOR_CURVE = 0x018436


    static DEFAULT_COLOR_SURFACE = 0xFFD70

    static DEFAULT_NAME_LOFT_SURFACE = "LoftSurface0"
    static DEFAULT_NAME_SURFACE = "Surface0"
    static DEFAULT_COLOR_SURFACE = 0xFFD70


    static DEFAULT_NAME_POINT = "Point0"
    static DEFAULT_COLOR_POINT = 0xFFD700
    static DEFAULT_SIZE_POINT = 0.1
    static DEFAULT_SIZE_POINT_SELECTED = 1

    static DEFAULT_NAME_MIRRORED_POINT = "MirroredPoint0"

}