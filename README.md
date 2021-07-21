# Animation-of-Covid-Vaccination-Progress-in-the-US
![image](https://github.com/YuanWANG2662/Animation-of-Covid-Vaccination-Progress-in-the-US/blob/main/dashboard.png)
## 1. Description
As the situation of the Covid-19 pandemic in the US is gradually getting better with the progress of the vaccination, it would be of great interest to visualize and animate exactly how the vaccination has been proceeding in the US, using a dynamic spatio-temporal map built in a web app. This web app aims to explore the progress of the Covid-19 vaccination in the United States with animations of several related variables using relevant animation modules from [ArcGIS API for JavaScript (ArcGIS JS API)](https://developers.arcgis.com/javascript/latest/), which can help government leaders and officials in the health care sector to make more timely and reasonable decisions.
## 2.Data Source
The data used for this WebApp is from a fully open-source [JHU GovEx GitHub repository](https://github.com/govex/COVID-19/tree/master/data_tables/vaccine_data) hosted by the [Johns Hopkins University Coronavirus Resource Center](https://coronavirus.jhu.edu/), which includes both [global vaccination sources](https://github.com/govex/COVID-19/blob/master/data_tables/vaccine_data/global_data/readme.md) and [US vaccination sources](https://github.com/govex/COVID-19/blob/master/data_tables/vaccine_data/us_data/readme.md), and is updated on a daily basis. 
## 3. Functionality
The proposed web application will implement the following functionalities:
* Visualization of the basemap and vector layer (polygons of states) showing the distribution of daily vaccination using  appropriate symbology (choropleth, dot density, or proportionally scaled circle) according to the meaning of the variable.
* A time-slider to animate different variables (e.g., daily doses, daily doses divided by population) through time
* Interaction design: search box, pop-up, layer selection, etc.
* A separate section to display histogram for the change of variables over time
* Visualization of extra layers like vaccination centers or testing centers
* Downloadable data service: shapefile or map (and if possible, GIF of the animation)
* Chart:
![image](https://github.com/YuanWANG2662/Animation-of-Covid-Vaccination-Progress-in-the-US/blob/main/chart.png)

Published on Netify:
https://kind-northcutt-dba963.netlify.app/
