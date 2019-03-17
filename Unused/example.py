import numpy as np
from matplotlib import pyplot as plt
from matplotlib import animation

X = np.linspace(0,3.428, num=250)
Y = np.sin(X*3)

fig = plt.figure(figsize=(13,5), dpi=80)
ax = plt.axes(xlim=(0, 3.428), ylim=(-1,1))
line, = ax.plot([], [], lw=5)

def init():
    line.set_data([], [])
    return line,

def animate(i):
    x = X[0:(i-1)]
    y = Y[0:(i-1)]
    line.set_data(x,y)
    p = plt.fill_between(x, y, 0, facecolor = 'C0', alpha = 0.2)
    return line, p,

anim = animation.FuncAnimation(fig,animate, init_func=init, 
                               frames = 250, interval=20, blit=True)

plt.show()