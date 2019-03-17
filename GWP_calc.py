# -*- coding: utf-8 -*-
"""
Created on Mon Mar 12 14:40:56 2018

@author: Thomas Gibon <t.gibon@gmail.com>

You probably read that methane is a greenhouse gas more potent than CO2. What
does this mean? To what extent is it true?

This is a model of greenhouse gases' radiative forcing, using the values of the
IPCC AR5, pages 731-738 here

    https://www.ipcc.ch/pdf/assessment-report/ar5/wg1/WG1AR5_Chapter08_FINAL.pdf

CO2 follows a more intricate cycle, and cannot be modelled with a simple decay
function. The model used can be found at:
    
    https://www.atmos-chem-phys.net/13/2793/2013/acp-13-2793-2013.pdf

This is inspired by the PhD thesis of Allan Shimako, available here
    
    https://tel.archives-ouvertes.fr/tel-01706684/document

Radiative forcing is the ability of certain gases to "trap" heat in the atmosphere,
this phenomenon is better known as greenhouse effect. Some gases are more efficient
than others at trapping heat, and some remain much longer than others.

The output of this code is an animation with three panels, showing the effect of
the instant release of 1 Mt (1 megatonne = 1 million tonnes = 1 billion kilograms)
of each of the greenhouse gases selected, where:
    - the top panel shows the instant forcing due to the gases being present in
    the Earth's atmosphere (in watts per square meter),
    - the middle panel shows the cumulative effect of that forcing, equal to
    the areas under the curves in the top graph integrated over the Earth's
    surface every year (in joules),
    - the bottom panel shows the cumulated forcing (middle panel values) of
    gases relative to that of carbon dioxide. This measure is called "global
    warming potential" and is usually calculated for three time horizons: 20,
    100, and 500 years, which are shown on the bottom graph.


"""

import pandas as pd
import matplotlib.pyplot as plt

from tqdm import trange
from matplotlib import animation

#Constants
substances = [
       'Sulfur hexafluoride(Air/)',
       'Dinitrogen monoxide(Air/)',
       'Methane, fossil(Air/)',
       'Ethane, 1,1-difluoro-, HFC-152a(Air/high. pop.)',
       'Ethane, 1,1,1,2-tetrafluoro-, HFC-134a(Air/high. pop.)',
       'Methane, trichlorofluoro-, CFC-11(Air/high. pop.)',
       'Methane, tetrafluoro-, CFC-14(Air/high. pop.)',
       'Carbon dioxide(Air/)']

earth_area = 510072000000000 # m2
year_in_s  = 365.2425 * 24 * 3600 # s/yr

n_sub = len(substances)

# Functions

# Calculate radiative forcing
def RF_calc():
    return None

# Animation function
def animate(b):
    # b should be mapped to t so that b = 1 is t = 1, and b = 300 is t = 1000
    
    # comment or uncomment the following
#    b = 10**(b/100)
    
    b_max = 1000
    t_max = 10000
    b *= t_max/b_max
    index_b = int(b/timestep)
    text = []
#    print('{}'.format(b/b_max))
#    h_crossed = set()
    
    for d, ax in enumerate(axes):
        if d == 0:
            # Have to remove the fills
            for coll in (ax.collections):
                ax.collections.remove(coll)
            # ...before drawing them again...
            fills = [ax.fill_between(RF_Mt.index[:index_b].tolist(),
                        RF_Mt[s].iloc[:index_b].tolist(),
                        color = colors[s],
                        alpha = 0.12,
                        hatch = 3*'/'*(s == 'Carbon dioxide(Air/)'))
                    for s in substances]
            
        if d == 1:
            for s,l in zip(substances, ax.lines[:n_sub]):
                l.set_data(RFI.index[:index_b].tolist(), RFI[s].iloc[:index_b])
                if s == 'Carbon dioxide(Air/)':
                    l.set_linewidth(3)
        if d == 2:
            for s,l in zip(substances, ax.lines[:n_sub]):
                l.set_data(GWP.index[:index_b].tolist(), GWP[s].iloc[:index_b])
                if s == 'Carbon dioxide(Air/)':
                    l.set_linewidth(3)
            
#            h_crossed_old = h_crossed
#            h_crossed = set(h for h in horizons if h <= b)
            for h in horizons:
                if (b-1 < h <= b):
                    gwps = GWP.iloc[int(h/timestep),:][substances]
                    ax.axvline(x=h, color = 'k', linestyle='--')
                    text.append(ax.text(.9*h,10.2,'GWP{}'.format(h),rotation=90, fontweight='bold'))
                    for i, gwp in enumerate(gwps):
                        text.append(ax.text(1.02*h,
                                     1.15*gwp,
                                     '{:2.0f}'.format(round(gwp,3-len(str(int(gwp))))),
                                     color = colors[substances[i]],
                                     fontweight='bold' * (h == 100) + 'normal' * (h != 100)))
    return axes, fills, text

# Initialisation function
def init_func():
    fills = [axes[0].fill_between([RF_Mt.index[0]],
                        [RF_Mt[s].iloc[0]],
                        color = colors[s],
                        alpha = 0.15,
                        hatch = 3*'/'*(s == 'Carbon dioxide(Air/)'))
        for s in substances]
    return axes, fills, []

if __name__ == '__main__':
        
    # Import
    if 'RF_Mt' not in locals().keys():
        RF      = pd.read_csv('results_radiative_1000.csv',dtype=pd.np.float64) # Radiative forcing
        RF.index = RF['time(years)']
        RFI     = RF.cumsum(0)                              # Radiative forcing integrated
        RFI.drop(columns='time(years)', inplace = True)
        GWP     = RFI.div(RFI['Carbon dioxide(Air/)'],0)    # Global warming potential
        RF_Mt   = RF * 1e9                                  # Radiative forcing for 1 Mt, in W/m2
        RFI    *= year_in_s * earth_area                    # Integrated forcing on Earth over a year
    
    # Set the figure variables
    # - time step
    timestep = (GWP.iloc[-1,:].name - GWP.iloc[0,:].name)/(GWP.shape[0] - 1)
    # - figure and axes as a subplot
    fig, axes = plt.subplots(3, 1, sharex = True, figsize = (16,16))
    
    ## Plot radiative forcing
    plt_RF = RF_Mt[substances].plot(
           logy = True,
           ax = axes[0],
           title = 'Radiative forcing of 1 Mt pulse emission at t = 0, in W/m²')
    
    # Adjust y axis
    ymax = plt_RF.get_ylim()[1]
    plt_RF.set_ylim([1e-8, RF_Mt[substances].max().max() * 1.5])
    
    # Get colors
    colors = {s:l.get_color() for s,l in zip(substances, plt_RF.get_lines())}
    
    ## Plot integrated radiative forcing
    plt_RFI = RFI[substances].plot(
           logy = True,
           ax = axes[1],
           title = 'Cumulated radiative forcing of 1 Mt pulse emission at t = 0, in J, well-mixed, globally')
    
    ## Plot GWP
    plt_GWP = GWP[substances].plot(
           xlim = (1,1000),
           logy = True,
           logx = True,
           ax = axes[2],
           title = 'GWP with time, in kg CO₂ equivalents/kg')
    
    horizons = [20,100,500]
    
    anim = animation.FuncAnimation(fig, animate, init_func=init_func,
                                   frames=trange(1000), interval=1, blit=False)
    
    dpi = 100
    writer = animation.writers['ffmpeg'](fps=30)
    anim.save('final_big_3.mp4',writer=writer,dpi=dpi)
    
    #plt_RF.get_figure().savefig('radiative_forcing_1000.png', dpi=600)
    #plt_GWP.get_figure().savefig('GWP_1000.png', dpi=600)
