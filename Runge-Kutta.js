const G = 6.67430e-11;  // Gravitational constant (m^3 kg^-1 s^-2)
const m_sun = 1.98847e30;  // Mass of the Sun (kg)
const masses = [m_sun, 3.302e23, 4.8685e24, 5.97219e24, 6.4171e23, 1.89813e27, 5.68319e26, 8.68103e25, 1.0241e26];  // Masses of Sun and planets
const AU = 1.496e11;  // Astronomical unit (m)
const day = 86400;  // Seconds in a day

// Initial positions and velocities for Sun and planets
let initial_conditions = [
    [0,0,0,0,0,0],  // Sun
    [-4.108411877039495E+07, 2.997375954154480E+07, 6.217890408222714E+06, -3.865743010383652E+01, -3.733889075044869E+01, 4.944436024774976E-01],  // Mercury
    [-1.069987422398024E+08, -1.145572515113905E+07, 6.016588327139664E+06, 3.513460276994624E+00, -3.497755629371660E+01, -6.830913209445484E-01],  // Venus
    [-2.481099325965390E+07, 1.449948612736719E+08, -8.215203670851886E+03, -2.984146365518679E+01, -5.126262286859617E+00, 1.184224839788195E-03],  // Earth
    [-4.388577457378983E+07, -2.170849264747524E+08, -3.473007284583151E+06, 2.466191455128526E+01, -2.722160161977370E+00, -6.619819103693254E-01],  // Mars
    [5.225708576244547E+08, 5.318268827721269E+08, -1.390073285881653E+07, -9.481190567392032E+00, 9.781942400350085E+00, 1.714274561397779E-01],  // Jupiter
    [1.345793242617223E+09, -5.559294178115252E+08, -4.389262609579784E+07, 3.146297313479314E+00, 8.917916155362638E+00, -2.799382290475703E-01],  // Saturn
    [1.835714294722568E+09, 2.288891426259816E+09, -1.529865738122165E+07, -5.371828306112230E+00, 3.954368764227032E+00, 8.423549070186587E-02],  // Uranus
    [4.464446647141849E+09, -2.679158335073845E+08, -9.736583677508335E+07, 2.818440617089212E-01, 5.469942022851473E+00, -1.190017755456774E-01],  // Neptune
];

// N-body system: Returns the derivatives [vx, vy, vz, ax, ay, az] for each body in 3D
function nBodySystem(t, y, masses) {
    const N = masses.length; // Number of bodies
    const dydt = new Array(y.length).fill(0); // Initialize the derivatives array

    for (let i = 0; i < N; i++) {
        // Extract positions and velocities for body i
        const x_i = y[6 * i];
        const y_i = y[6 * i + 1];
        const z_i = y[6 * i + 2];
        const vx_i = y[6 * i + 3];
        const vy_i = y[6 * i + 4];
        const vz_i = y[6 * i + 5];

        // Set velocity derivatives
        dydt[6 * i] = vx_i;
        dydt[6 * i + 1] = vy_i;
        dydt[6 * i + 2] = vz_i;

        // Initialize accelerations
        let ax = 0, ay = 0, az = 0;

        // Compute gravitational interaction with all other bodies
        for (let j = 0; j < N; j++) {
            if (i !== j) {
                const x_j = y[6 * j];
                const y_j = y[6 * j + 1];
                const z_j = y[6 * j + 2];
                const r_ij = Math.sqrt((x_i - x_j) ** 2 + (y_i - y_j) ** 2 + (z_i - z_j) ** 2); // Distance between body i and j

                // Gravitational force contribution from body j
                const f = G * masses[j] / (r_ij ** 3);

                // Update accelerations based on gravitational force
                ax -= f * (x_i - x_j);
                ay -= f * (y_i - y_j);
                az -= f * (z_i - z_j);
            }
        }

        // Set acceleration derivatives
        dydt[6 * i + 3] = ax;
        dydt[6 * i + 4] = ay;
        dydt[6 * i + 5] = az;
    }

    return dydt;
}

// Runge-Kutta-Fehlberg 4(5) method
function rkf45(f, y0, t0, tf, dt_initial, masses, tol = 1e-6, dt_min = 1e-6, dt_max = 1e6) {
    let t = t0;
    let y = Array.from(y0); // Convert to a copy of the array
    let dt = dt_initial;
    const ts = [t];
    const ys = [y];

    while (t < tf) {
        if (t + dt > tf) {
            dt = tf - t;
        }

        // Butcher tableau coefficients
        const a2 = 0.25, a3 = 3/8, a4 = 12/13, a5 = 1, a6 = 0.5;
        const b21 = 0.25;
        const b31 = 3/32, b32 = 9/32;
        const b41 = 1932/2197, b42 = -7200/2197, b43 = 7296/2197;
        const b51 = 439/216, b52 = -8, b53 = 3680/513, b54 = -845/4104;
        const b61 = -8/27, b62 = 2, b63 = -3544/2565, b64 = 1859/4104, b65 = -11/40;
        const r1 = 16/135, r2 = 0, r3 = 6656/12825, r4 = 28561/56430, r5 = -9/50, r6 = 2/55;
        const r1_alt = 25/216, r3_alt = 1408/2565, r4_alt = 2197/4104, r5_alt = -1/5;

        // Stage 1
        const k1 = dt * f(t, y, masses);

        // Stage 2
        const k2 = dt * f(t + a2 * dt, addVectors(y, multiplyVector(k1, b21)), masses);

        // Stage 3
        const k3 = dt * f(t + a3 * dt, addVectors(y, addVectors(multiplyVector(k1, b31), multiplyVector(k2, b32))), masses);

        // Stage 4
        const k4 = dt * f(t + a4 * dt, addVectors(y, addVectors(multiplyVector(k1, b41), addVectors(multiplyVector(k2, b42), multiplyVector(k3, b43)))), masses);

        // Stage 5
        const k5 = dt * f(t + a5 * dt, addVectors(y, addVectors(multiplyVector(k1, b51), addVectors(multiplyVector(k2, b52), addVectors(multiplyVector(k3, b53), multiplyVector(k4, b54))))), masses);

        // Stage 6
        const k6 = dt * f(t + a6 * dt, addVectors(y, addVectors(multiplyVector(k1, b61), addVectors(multiplyVector(k2, b62), addVectors(multiplyVector(k3, b63), addVectors(multiplyVector(k4, b64), multiplyVector(k5, b65))))), masses));

        // 4th and 5th order solutions
        const y4 = addVectors(y, addVectors(multiplyVector(k1, r1_alt), addVectors(multiplyVector(k3, r3_alt), addVectors(multiplyVector(k4, r4_alt), multiplyVector(k5, r5_alt)))));
        const y5 = addVectors(y, addVectors(multiplyVector(k1, r1), addVectors(multiplyVector(k3, r3), addVectors(multiplyVector(k4, r4), addVectors(multiplyVector(k5, r5), multiplyVector(k6, r6))))));

        // Error estimation
        const error = Math.max(...y5.map((val, idx) => Math.abs(val - y4[idx]))) / dt;

        // Adaptive step size control
        if (error <= tol) {
            t += dt;
            y = y5;
            ts.push(t);
            ys.push(y);
        }

        dt = dt * Math.min(Math.max(0.84 * Math.pow(tol / error, 0.25), 0.1), 4.0);
        dt = Math.max(Math.min(dt, dt_max), dt_min);
    }

    return [ts, ys];
}

// Helper functions for vector operations
function addVectors(a, b) {
    return a.map((val, idx) => val + b[idx]);
}

function multiplyVector(v, scalar) {
    return v.map(val => val * scalar);
}

const y0 = initial_conditions.flat(); // Flatten the initial conditions to a 1D array
const tf = 365 * day * 5; // Simulate for 5 years
const dt_initial = day;

// Run the simulation
const [times, results] = rkf45(nBodySystem, y0, 0, tf, dt_initial, masses);

// Extract the 3D positions of each planet over time
const positions = results.map(result => {
    return result.reduce((acc, val, idx) => {
        if (idx % 6 < 3) acc.push(val); // Get only the position components
        return acc;
    }, []);
});