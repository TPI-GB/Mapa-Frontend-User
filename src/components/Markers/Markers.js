import React from "react";
import { Marker, Popup } from "react-leaflet";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import petitions from "../Petitions";
import "./Markers.scss";
const baseUrl = process.env.REACT_APP_BASE_URL;

const Markers = () => {
  let places = JSON.parse(sessionStorage.getItem("places"));
  let current_longitude = sessionStorage.getItem("current longitude");
  let current_latitude = sessionStorage.getItem("current latitude");
  if (
    places === null ||
    current_longitude === null ||
    current_latitude === null
  ) {
    setTimeout(() => {
      window.location = window.location.href;
    }, 300);
  }
  let markers = places.map((place, i) => (
    <Marker
      key={i}
      position={[place.lactitude, place.longitude]}
      icon={IconPlace(place)}
    >
      <Popup className="popup">
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <p>{InfoPlace(place)}</p>
      </Popup>
    </Marker>
  ));
  if (current_latitude !== "not found" && current_longitude !== "not found") {
    const current = (
      <Marker
        position={[
          sessionStorage.getItem("current latitude"),
          sessionStorage.getItem("current longitude"),
        ]}
        icon={IconUser()}
      >
        <Popup className="popup">
          <h3>Usted esta aqui</h3>
        </Popup>
      </Marker>
    );
    markers.push(current);
  }
  return markers;
};

const stylebox = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "90%",
  width: 750,
  overflow: "auto",
  bgcolor: "#b39ddb",
  border: "2px solid #000",
  borderRadius: "1%",
  boxShadow: 24,
  p: 4,
};

function IconUser() {
  const iconList = Object.keys(Icons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => Icons[icon]);

  library.add(...iconList);

  const iconMarkup = renderToStaticMarkup(
    <FontAwesomeIcon icon="user" color="blue" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
    className: "dummy",
  });
  return customMarkerIcon;
}

function IconPlace(place) {
  const iconList = Object.keys(Icons)
    .filter((key) => key !== "fas" && key !== "prefix")
    .map((icon) => Icons[icon]);

  library.add(...iconList);
  const [icon, setIcon] = useState([]);
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const response = await petitions.GetIconNameByCategoryName(place.category);
    setIcon(response);
  };
  const iconMarkup = renderToStaticMarkup(
    <FontAwesomeIcon icon={icon} color="red" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
    className: "dummy",
  });
  return customMarkerIcon;
}

function InfoPlace(place) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Box textAlign="center">
        <Button
          onClick={handleOpen}
          variant="contained"
          style={{ background: "#64b5f6" }}
        >
          Ver info
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={stylebox}>
          <Button
            onClick={handleClose}
            variant="contained"
            style={{ background: "#7E57C2" }}
          >
            <ArrowBackIcon />
            &nbsp;Regresar
          </Button>
          <Stack textAlign={"center"}>
            <h1>{place.name}</h1>
          </Stack>
          <Stack>
            <Carousel sx={{ flexGrow: 1 }} class="slides_container">
              {place.images.map((image) => (
                <Stack sx={{ width: 750, height: 450 }}>
                  <img
                    class="slides_container"
                    key={image}
                    alt="imagen"
                    src={`${baseUrl}/images/${image}`}
                  />
                </Stack>
              ))}
            </Carousel>
          </Stack>

          <Stack className="modal-title">
            <b>Categoría </b>
            <Stack>{place.category}</Stack>
          </Stack>

          <Stack className="modal-title">
            <b>Descripción </b>
          </Stack>
          <Stack>{place.description}</Stack>
          <Stack className="modal-title">
            <b>Características De Accesibilidad</b>
          </Stack>
          <Stack>
            {place.features.map((f) => (
              <li>{f}</li>
            ))}
          </Stack>
          {FormRating(place)}
          {FormComment(place)}
        </Box>
      </Modal>
    </div>
  );
}

function FormComment(place) {
  const { register, handleSubmit } = useForm();
  const [state, setState] = useState(place);

  const onSubmit = async (data) => {
    const newComment = { name: data.name, text: data.text };
    let dataCommentToPlace = {};
    dataCommentToPlace.place = state;
    dataCommentToPlace.comment = newComment;
    const response = await petitions.AddCommentToPlace(dataCommentToPlace);
    setState(response.data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack className="modal-title">
        <b>Dejar una opinión</b>
      </Stack>
      <Stack direction="row">
        <TextField
          style={{ background: "#c5cae9", borderRadius: "8% 8% 8% 8%" }}
          {...register("name")}
          required
          label="Nombre"
          placeholder="Nombre"
        />
      </Stack>
      <Stack mt="3px">
        <TextField
          style={{ background: "#c5cae9", borderRadius: "8% 8% 8% 8%" }}
          {...register("text")}
          required
          label="Comentario"
          placeholder="Comentario"
        />
      </Stack>
      <Stack direction="row" mt="3px">
        <Button
          variant="contained"
          type="submit"
          style={{
            background: "#5c5470",
            borderRadius: "8% 8% 8% 8%",
          }}
        >
          Dejar opinión
        </Button>
      </Stack>
      <Stack className="modal-title">
        <b>Opiniones</b>
      </Stack>
      <Stack mt={2}>
        {state.comments.map((c) => (
          <Stack mt={1}>
            <div
              className="comments"
              style={{
                backgroundColor: "#c5cae9",
                paddingLeft: 8,
              }}
            >
              <b>{c.name}</b>
              <p>{c.text}</p>
            </div>
          </Stack>
        ))}
      </Stack>
    </form>
  );
}

function FormRating(place) {
  const getColorRating = (place) => {
    if (place.rating <= 2) {
      return "red";
    } else if (state.rating <= 3) {
      return "yellow";
    } else {
      return "green";
    }
  };

  const { register, handleSubmit } = useForm();
  const [state, setState] = useState(place);
  const [stateColor, setStateColor] = useState(getColorRating(place));

  const onSubmit = async (data) => {
    data.place = state;
    const response = await petitions.EditRating(data);
    setState(response.data);
    setStateColor(getColorRating(response.data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack className="modal-title">
        <b>
          Puntaje
          <div style={{ color: `${stateColor}` }}>{state.rating}</div>
        </b>
      </Stack>
      <Stack className="modal-title">
        <b>Dar puntuación</b>
      </Stack>
      <Stack direction="row">
        <Select {...register("rating")}>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
          <MenuItem value="5">5</MenuItem>
        </Select>
      </Stack>
      <Stack direction="row" mt="3px">
        <Button
          variant="contained"
          type="submit"
          style={{ background: "#5c5470" }}
        >
          Dejar puntaje
        </Button>
      </Stack>
    </form>
  );
}

export default Markers;
