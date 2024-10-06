import numpy as np
import matplotlib.pyplot as plt

# Constants
G = 6.67430e-11  # Gravitational constant (m^3 kg^-1 s^-2)
m_sun = 1.98847e30  # Mass of the Sun (kg)
masses = np.array([m_sun, 3.302e23, 4.8685e24, 5.97219e24, 6.4171e23, 1.89813e27, 5.68319e26, 8.68103e25, 1.0241e26])  # Masses of Sun and 8 planets
AU = 1.496e11  # Astronomical unit (m)
day = 86400  # Seconds in a day

# Initial positions (x, y, z) and velocities (vx, vy, vz) for Sun and 8 planets
# Units: [m, m, m, m/s, m/s, m/s]

# Define the initial conditions for the Sun and planets
initial_conditions = np.array([
    [1.81899e+08, 9.83830e+08, -1.58778e+07, -1.12474e+01, 7.54876e+00, 2.68723e-01],  # Sun
    [-5.67576e+10, -2.73592e+10, 2.89173e+09, 1.16497e+04, -4.14793e+04, -4.45952e+03],  # Mercury
    [4.28480e+10, 1.00073e+11, -1.11872e+09, -3.22930e+04, 1.36960e+04, 2.05091e+03],  # Venus
    [-1.43778e+11, -4.00067e+10, -1.38875e+07, 7.65151e+03, -2.87514e+04, 2.08354e+00],  # Earth
    [-1.14746e+11, -1.96294e+11, -1.32908e+09, 2.18369e+04, -1.01132e+04, -7.47957e+02],  # Mars
    [-5.66899e+11, -5.77495e+11, 1.50755e+10, 9.16793e+03, -8.53244e+03, -1.69767e+02],  # Jupiter
    [8.20513e+10, -1.50241e+12, 2.28565e+10, 9.11312e+03, 4.96372e+02, -3.71643e+02],  # Saturn
    [2.62506e+12, 1.40273e+12, -2.87982e+10, -3.25937e+03, 5.68878e+03, 6.32569e+01],  # Uranus
    [4.30300e+12, -1.24223e+12, -7.35857e+10, 1.47132e+03, 5.25363e+03, -1.42701e+02],  # Neptune
])

# Extract the Sun's position and velocity
sun_position = initial_conditions[0, :3]
sun_velocity = initial_conditions[0, 3:6]

# Remove the mass and radius from initial_conditions (columns 6 and 7)
initial_conditions = initial_conditions[:, :6]

# Reformat the positions and velocities relative to the Sun
for i in range(1, len(initial_conditions)):
    initial_conditions[i, :3] -= sun_position  # Adjust position
    initial_conditions[i, 3:6] -= sun_velocity  # Adjust velocity

# Set the Sun's position and velocity to zero
initial_conditions[0, :6] = 0

# Print the reformatted initial conditions
print(initial_conditions)


# ODE system: Returns the derivatives [vx, vy, vz, ax, ay, az] for each body in 3D
def n_body_system(t, y, masses):
    N = len(masses)  # Number of bodies
    dydt = np.zeros_like(y)  # Initialize the derivatives array
    
    for i in range(N):
        # Extract positions and velocities for body i
        x_i, y_i, z_i, vx_i, vy_i, vz_i = y[6*i:6*(i+1)]
        
        # Set velocity derivatives
        dydt[6*i] = vx_i
        dydt[6*i+1] = vy_i
        dydt[6*i+2] = vz_i
        
        # Initialize accelerations
        ax, ay, az = 0, 0, 0
        
        # Compute gravitational interaction with all other bodies
        for j in range(N):
            if i != j:
                x_j, y_j, z_j = y[6*j], y[6*j+1], y[6*j+2]
                r_ij = np.sqrt((x_i - x_j)**2 + (y_i - y_j)**2 + (z_i - z_j)**2)  # Distance between body i and j
                
                # Gravitational force contribution from body j
                f = G * masses[j] / r_ij**3
                
                # Update accelerations based on gravitational force
                ax -= f * (x_i - x_j)
                ay -= f * (y_i - y_j)
                az -= f * (z_i - z_j)
        
        # Set acceleration derivatives
        dydt[6*i+3] = ax
        dydt[6*i+4] = ay
        dydt[6*i+5] = az
    
    return dydt

# Runge-Kutta-Fehlberg 4(5) method
def rkf45(f, y0, t0, tf, dt_initial, masses, tol=1e-6, dt_min=1e-6, dt_max=1e6):
    t = t0
    y = np.array(y0)
    dt = dt_initial
    ts = [t]
    ys = [y]
    
    while t < tf:
        if t + dt > tf:
            dt = tf - t
        
        # Butcher tableau coefficients
        a2, a3, a4, a5, a6 = 0.25, 3/8, 12/13, 1, 0.5
        b21 = 0.25
        b31, b32 = 3/32, 9/32
        b41, b42, b43 = 1932/2197, -7200/2197, 7296/2197
        b51, b52, b53, b54 = 439/216, -8, 3680/513, -845/4104
        b61, b62, b63, b64, b65 = -8/27, 2, -3544/2565, 1859/4104, -11/40
        r1, r2, r3, r4, r5, r6 = 16/135, 0, 6656/12825, 28561/56430, -9/50, 2/55
        r1_alt, r3_alt, r4_alt, r5_alt = 25/216, 1408/2565, 2197/4104, -1/5
        
        # Stage 1
        k1 = dt * f(t, y, masses)
        
        # Stage 2
        k2 = dt * f(t + a2 * dt, y + b21 * k1, masses)
        
        # Stage 3
        k3 = dt * f(t + a3 * dt, y + b31 * k1 + b32 * k2, masses)
        
        # Stage 4
        k4 = dt * f(t + a4 * dt, y + b41 * k1 + b42 * k2 + b43 * k3, masses)
        
        # Stage 5
        k5 = dt * f(t + a5 * dt, y + b51 * k1 + b52 * k2 + b53 * k3 + b54 * k4, masses)
        
        # Stage 6
        k6 = dt * f(t + a6 * dt, y + b61 * k1 + b62 * k2 + b63 * k3 + b64 * k4 + b65 * k5, masses)
        
        # 4th and 5th order solutions
        y4 = y + r1_alt * k1 + r3_alt * k3 + r4_alt * k4 + r5_alt * k5
        y5 = y + r1 * k1 + r3 * k3 + r4 * k4 + r5 * k5 + r6 * k6
        
        # Error estimation
        error = np.max(np.abs(y5 - y4)) / dt
        
        # Adaptive step size control
        if error <= tol:
            t += dt
            y = y5
            ts.append(t)
            ys.append(y)
        
        dt = dt * min(max(0.84 * (tol / error)**0.25, 0.1), 4.0)
        dt = max(min(dt, dt_max), dt_min)
    
    return np.array(ts), np.array(ys)

# Run the RKF45 method for the 3D N-body system
y0 = initial_conditions.flatten()  # Flatten the initial conditions to a 1D array
tf = 365 * day * 5   # Simulate for 10 years
dt_initial = day

# Run the simulation
times, results = rkf45(n_body_system, y0, 0, tf, dt_initial, masses)

# Extract the 3D positions of each planet over time
positions = results.reshape(-1, len(masses), 6)[:, :, :3]  # Extract positions (x, y, z)

print(positions)

# Plot the orbits of the planets in 3D
fig = plt.figure(figsize=(10, 10))
ax = fig.add_subplot(111, projection='3d')

# Define colors for the bodies
colors = ['yellow', 'gray', 'orange', 'blue', 'red', 'brown', 'gold', 'lightblue', 'darkblue']
names = ['Sun', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']

# Plot each planet's orbit
for i in range(len(masses)):
    ax.plot(positions[:, i, 0] / AU, positions[:, i, 1] / AU, positions[:, i, 2] / AU, 
            label=names[i], color=colors[i])

# Customize the plot
ax.set_title('Orbits of the Solar System')
ax.set_xlabel('X [AU]')
ax.set_ylabel('Y [AU]')
ax.set_zlabel('Z [AU]')
ax.legend()
ax.grid(True)
plt.show()

