## Ward map ##

# load packages
library(tidyverse) ; library(sf) ; library(ggsn)

# load lab theme
source("https://trafforddatalab.github.io/assets/theme/ggplot2/theme_lab.R")

boundary <- st_read("https://www.trafforddatalab.io/spatial_data/ward/2023/trafford_ward_full_resolution.geojson", quiet = TRUE) %>%
  mutate(area_name = gsub(" Ward", "", area_name))

# load buildings and clip to ward boundary 
bldgs <- st_read("https://www.traffordDataLab.io/open_data/buildings/trafford_buildings.geojson", quiet = TRUE) %>% 
  select(-area_code, -area_name)

# load roads and clip to ward boundary 
roads <- st_read("https://www.traffordDataLab.io/open_data/open_roads/trafford_roadLink.geojson", quiet = TRUE) %>% 
  select(identifier, class, roadNumber, name1)

# load built-up areas
urban <- st_read("https://www.traffordDataLab.io/open_data/built_up_areas/gm_built_up_areas.geojson", quiet = TRUE) %>% 
  select(-area_code, -area_name) 

green_space <- st_read("https://www.traffordDataLab.io/open_data/greenspaces/trafford_greenspace_sites.geojson", quiet = TRUE) %>% 
  filter(site_type != "Religious Ground and Cemetries")

mapFun <- function(wardName,ward,urban,bldgs,roads,green_space) {

p <- ggplot() +
  geom_sf(data = ward, colour = NA, fill = "#8AA37B", alpha = 0.7) +
  geom_sf(data = urban, colour = NA, fill = "#d9d9d9") +
  geom_sf(data = bldgs, colour = "#757575", fill = NA, alpha = 1, linewidth = 0.25) +
  geom_sf(data = subset(roads, class == "A Road"), linewidth = 1.2, colour = "#ffffff", alpha = 1) +
  geom_sf(data = subset(roads, class != "A Road"), linewidth = 0.5, colour = "#ffffff", alpha = 1) +
  geom_sf(data = green_space, colour = NA, fill = "#357a38", alpha = 0.7) +
  geom_sf(data = ward, colour = "#212121", fill = "transparent", linewidth = 0.3) +
  labs(x = NULL, y = NULL, title = NULL, subtitle = NULL,
       caption = "Contains National Statistics data © and Ordnance Survey data © Crown copyright and database right 2023  |  @traffordDataLab") +
  theme_lab() +
  theme(plot.caption = element_text(size = 6, colour = "#757575", hjust = 0, margin = margin(b = 2))) +
  coord_sf(datum = NA) +
  scalebar(data = ward, location = "bottomright", 
           dist = 0.5, height = 0.01, st.dist = 0.02, dist_unit = "km",border.size = 0.4,# st.bottom = FALSE,
           st.size = 3, transform = TRUE, model = "WGS84",
           st.color = "#212121", box.color = "#212121", box.fill = c("#757575", "#ffffff"))
}

for(i in 1:21) {

ward_name <- (boundary %>%
  st_drop_geometry())$area_name[i]

ward <- boundary %>% 
  filter(area_name == ward_name)

p <- mapFun(ward_name,ward,urban %>% st_intersection(ward) ,bldgs %>% st_intersection(ward),roads %>% st_intersection(ward),green_space %>% st_intersection(ward))

ggsave(file = paste0(gsub(" ", "_",ward_name),".svg"), scale = 1.2, width = 6, height = 6)
p + labs(title = ward_name) 
  ggsave(paste0(gsub(" ", "_",ward_name),".png"), dpi = 300, scale = 1.2, width = 6, height = 6)
  
}
