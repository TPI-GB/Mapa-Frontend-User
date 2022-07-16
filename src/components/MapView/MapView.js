import * as React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import Markers from "../Markers";
import "./MapView.scss";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import petitions from "../Petitions";
import { useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MapView() {
  let { nameFilter } = useParams();
  let { categoryFilter } = useParams();
  let { featuresFilter } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [feature, setFeature] = useState([]);
  const [latitude, setLatitude] = useState("-35.768021379446026");
  const [longitude, setLongitude] = useState("-58.49708847640829");
  const [currentResponse, setCurrentResponse] = useState("sucess");

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    if (nameFilter === undefined) {
      nameFilter = "all";
    }
    if (categoryFilter === undefined) {
      categoryFilter = "all";
    }
    if (featuresFilter === undefined) {
      featuresFilter = "all";
    }
    let data = {};
    data.name = nameFilter;
    data.category = categoryFilter;
    data.features = featuresFilter.split(",");
    const res = await petitions.GetPlacesFilter(data);
    setPlaces(res);
    const categoriesValues = await petitions.GetCategories();
    const featureValues = await petitions.GetFeatures();
    setFeatures(featureValues.map((x) => x.name));
    setCategories(categoriesValues);
    if (nameFilter !== "all") {
      setName(nameFilter);
    } else {
      setName("");
    }
    if (categoryFilter !== "all") {
      setSelectedCategory(categoryFilter ? categoryFilter.trim() : "");
    } else {
      setSelectedCategory("Todas" ? "Todas".trim() : "");
    }
    if (featuresFilter !== "all") {
      setFeature(JSON.parse(JSON.stringify(featuresFilter.split(","))));
    } else {
      setFeature(JSON.parse(JSON.stringify([])));
    }
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          successCurrentLocation,
          errorCurrentLocation,
          { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
        );
      } else {
        alert(
          "Atencion, este navegador no soporta visualizar su ubicación actual"
        );
      }
    } catch (err) {
      console.log(err);
      setLatitude("-35.768021379446026");
      setLongitude("-58.49708847640829");
      setCurrentResponse("fail");
    }

    function successCurrentLocation(pos) {
      var crd = pos.coords;
      setLatitude(crd.latitude);
      setLongitude(crd.longitude);
    }

    function errorCurrentLocation(err) {
      console.log("ERROR(" + err.code + "): " + err.message);
      setLatitude("-35.768021379446026");
      setLongitude("-58.49708847640829");
      setCurrentResponse("fail");
    }
  };

  const { register, handleSubmit } = useForm();

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeFeature = (event) => {
    const {
      target: { value },
    } = event;
    setFeature(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeSelectedCategory = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategory(value);
  };

  const onSubmit = async (data) => {
    let nameUrl = "all";
    let categoryUrl = "all";
    let featuresUrl = "all";
    if (name !== "") {
      nameUrl = name;
    }
    if (data.category !== "" && data.category !== "Todas") {
      categoryUrl = data.category;
    }
    if (feature.length !== 0) {
      featuresUrl = feature;
    }
    window.location = `/${nameUrl}/${categoryUrl}/${featuresUrl}`;
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <div className="estilosDeSelect">
            <TextField
              className="nombre"
              label="Buscar lugar por nombre"
              onChange={handleChangeName}
              value={name}
              sx={{ width: 250 }}
              style={{ margin: 12 }}
            />
            <FormControl sx={{ width: 250 }} style={{ margin: 12 }}>
              <InputLabel id="feature-multiple-checkbox-label"></InputLabel>
              <InputLabel id="Categoria-label">Categoria</InputLabel>
              <Select
                {...register("category")}
                onChange={handleChangeSelectedCategory}
                labelId="Categoria-label"
                label="Categoria"
                value={selectedCategory}
              >
                <MenuItem value={"Todas"}>Todas</MenuItem>
                {categories.map(({ name, icon }) => (
                  <MenuItem value={name}>
                    {`${name}`}
                    {<FontAwesomeIcon icon={icon} />}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 250 }} style={{ margin: 12 }}>
              <InputLabel id="feature-multiple-checkbox-label">
                Caracteristicas
              </InputLabel>
              <Select
                labelId="feature-multiple-checkbox-label"
                id="feature-multiple-checkbox"
                multiple
                value={feature}
                onChange={handleChangeFeature}
                input={<OutlinedInput label="Seleccionar caracteristicas" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {features.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={feature.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              type="submit"
              style={{ background: "#39A2DB", margin: 15 }}
            >
              <SearchIcon />
            </Button>
          </div>
        </Box>
      </form>
      <div className="Map">
        <MapContainer
          className="Map-container"
          center={{
            lat: latitude,
            lng: longitude,
          }}
          zoom={15}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png" />
          <Markers
            places={places}
            current_latitude={latitude}
            current_longitude={longitude}
            current_response={currentResponse}
          />
        </MapContainer>
      </div>
    </div>
  );
}
